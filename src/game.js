// 《未完成的星路》主遊戲迴圈。
// 固定步長 (60Hz) 物理 + 螢幕刷新率解耦的渲染。

import { input, bindInput } from './engine/input.js';
import { audio } from './engine/audio.js';
import { Painter, makeCanvas } from './engine/pixel.js';
import { TILE, WORLD_W, WORLD_H, isWalkable, getBakedMap } from './world/map.js';
import { RepairNode, Rescuee } from './world/objects.js';
import { Character } from './world/characters.js';
import { ParticleSystem } from './ui/particles.js';
import {
  DialogueBox, drawCharHUD, drawMissionHUD, drawPrompt,
  drawTitle, drawPause, drawWin,
} from './ui/hud.js';

// ── Canvas 設定 ─────────────────────────────────────────────────────────────
const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d', { alpha: false });
ctx.imageSmoothingEnabled = false;

const VIEW_W = canvas.width;   // 480
const VIEW_H = canvas.height;  // 270

// 離屏渲染緩衝（在此畫完再 blit 到主 canvas，防止撕裂）
const { canvas: offscreen, ctx: offCtx } = makeCanvas(VIEW_W, VIEW_H);
offCtx.imageSmoothingEnabled = false;
const offPainter = new Painter(offCtx);

const SAVE_KEY = 'ibisgame-c01-v2';

// ── 初始值 ──────────────────────────────────────────────────────────────────
const YOHANI_START = { x: 14 * TILE, y: 14 * TILE };
const SHANI_START  = { x: 11 * TILE, y: 24 * TILE };

const NODE_DEFS = [
  { id: 'support-west',  x: 22 * TILE, y: 13 * TILE, type: 'console', required: 'yohani', label: '西側橋梁支撐' },
  { id: 'support-east',  x: 44 * TILE, y: 13 * TILE, type: 'console', required: 'yohani', label: '東側橋梁支撐' },
  { id: 'seal-lower',    x: 29 * TILE, y: 24 * TILE, type: 'seal',    required: 'shani',  label: '地下例外道路' },
  { id: 'seal-upper',    x: 40 * TILE, y: 15 * TILE, type: 'seal',    required: 'shani',  label: '上層封鎖標記' },
];

const RESCUEE_DEFS = [
  { id: 'formal',     x: 53 * TILE, y: 13 * TILE, name: '橋面居民',   req: 'yohani' },
  { id: 'underground',x: 33 * TILE, y: 25 * TILE, name: '地下同行者', req: 'shani' },
  { id: 'child',      x: 62 * TILE, y: 15 * TILE, name: '迷路的孩子', req: 'both' },
];

// ── 遊戲狀態類 ──────────────────────────────────────────────────────────────
class Game {
  constructor() {
    this.mode = 'title'; // title | play | pause | win
    this.time = 0;
    this.winTimer = 0;
    this.lastSave = 0;

    this.camera = { x: 0, y: 0, targetX: 0, targetY: 0, shake: 0, shakeIntensity: 0 };

    // 修復節點
    this.nodes = NODE_DEFS.map((def) => new RepairNode(def));
    this.repaired = new Set();

    // 受困者
    this.rescuees = RESCUEE_DEFS.map((d) => new Rescuee(d.id, d.x, d.y, d.name, d.req));

    // 角色
    this.chars = [
      new Character('yohani', YOHANI_START.x, YOHANI_START.y),
      new Character('shani',  SHANI_START.x,  SHANI_START.y),
    ];
    this.activeIdx = 0;
    this.chars[0].activate();

    // UI
    this.dialogue = new DialogueBox();
    this.particles = new ParticleSystem();

    // 任務進度：0=修復中, 1=部分完成, 2=路接上了, 3=全部救援
    this.objective = 0;

    this.load();
  }

  get active() { return this.chars[this.activeIdx]; }
  get inactive() { return this.chars[1 - this.activeIdx]; }

  // ── 存檔 / 讀檔 ───────────────────────────────────────────────────────────
  save(force = false) {
    if (!force && this.time - this.lastSave < 1.5) return;
    this.lastSave = this.time;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        objective: this.objective,
        repaired: [...this.repaired],
        rescued: this.rescuees.filter((r) => r.rescued).map((r) => r.id),
        positions: this.chars.map((c) => ({ x: c.x | 0, y: c.y | 0 })),
      }));
    } catch { /* localStorage 可能被停用 */ }
  }

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.repaired) {
        for (const id of saved.repaired) this.repaired.add(id);
        for (const node of this.nodes) node.done = this.repaired.has(node.id);
      }
      if (saved.rescued) {
        for (const r of this.rescuees) r.rescued = saved.rescued.includes(r.id);
      }
      if (saved.positions?.length === 2) {
        this.chars.forEach((c, i) => {
          const pos = saved.positions[i];
          if (pos) { c.x = pos.x; c.y = pos.y; }
        });
      }
      this.objective = saved.objective ?? 0;
    } catch {
      localStorage.removeItem(SAVE_KEY);
    }
  }

  reset() {
    localStorage.removeItem(SAVE_KEY);
    window.location.reload();
  }

  // ── 碰撞偵測 ─────────────────────────────────────────────────────────────
  collides(char) {
    const corners = [
      [char.x + 2,           char.y + char.h - 2],
      [char.x + char.w - 2,  char.y + char.h - 2],
      [char.x + 2,           char.y + char.h + 2],
      [char.x + char.w - 2,  char.y + char.h + 2],
    ];
    return corners.some(([cx, cy]) => !isWalkable(cx, cy, this.repaired));
  }

  // ── 互動 ─────────────────────────────────────────────────────────────────
  interact() {
    const player = this.active;
    const pc = player.center;
    const REACH = 30;

    // 先找最近未完成的修復節點
    const node = this.nodes
      .filter((n) => !n.done)
      .sort((a, b) => dist2(pc, a.center) - dist2(pc, b.center))[0];

    if (node && dist(pc, node.center) < REACH) {
      if (node.required !== player.id) {
        const need = node.required === 'yohani' ? '尤哈尼' : '珊妮';
        this.dialogue.say('系統', `這個裝置需要${need}的能力。按 X 切換角色。`, 'system');
        audio.deny();
        return;
      }
      // 修復！
      node.done = true;
      this.repaired.add(node.id);
      this.particles.repairFlash(node.x + TILE / 2, node.y + TILE / 2,
        player.id === 'yohani' ? '#40e0d0' : '#e040a0');
      this.camera.shake = 0.6;
      audio.repair();
      this.dialogue.say(player.id === 'yohani' ? '尤哈尼' : '珊妮',
        node.label + '——完成。', player.id);
      this.save(true);
      this.checkObjective();
      return;
    }

    // 找最近未救出的受困者
    const rescuee = this.rescuees
      .filter((r) => !r.rescued)
      .sort((a, b) => dist2(pc, a.center) - dist2(pc, b.center))[0];

    if (rescuee && dist(pc, rescuee.center) < REACH) {
      if (!this.allNodesRepaired()) {
        this.dialogue.say(rescuee.name, '橋還沒修好……先把支撐和封鎖都處理完吧。', 'system');
        audio.deny();
        return;
      }
      if (rescuee.requirement !== 'both' && rescuee.requirement !== player.id) {
        const need = rescuee.requirement === 'yohani' ? '尤哈尼' : '珊妮';
        this.dialogue.say(rescuee.name, `這段路我需要${need}帶我走。`, 'system');
        audio.deny();
        return;
      }
      if (rescuee.requirement === 'both') {
        const d = dist(this.chars[0].center, this.chars[1].center);
        if (d > 80) {
          this.dialogue.say('迷路的孩子', '可以讓你們兩個都靠近我嗎？我怕走散。', 'system');
          audio.deny();
          return;
        }
      }
      // 救出！
      rescuee.rescued = true;
      this.particles.rescueFlash(rescuee.x + 6, rescuee.y + 6);
      this.camera.shake = 0.4;
      audio.fanfare();
      this.dialogue.say(rescuee.name, '謝謝！我會沿著你們留的標記撤離。', 'system');
      this.save(true);
      this.checkObjective();
      return;
    }

    audio.blip(240);
  }

  allNodesRepaired() { return this.nodes.every((n) => n.done); }

  checkObjective() {
    const repaired = this.nodes.filter((n) => n.done).length;
    const rescued = this.rescuees.filter((r) => r.rescued).length;
    const next = rescued >= 3 ? 3 : repaired >= 4 ? 2 : repaired > 0 ? 1 : 0;

    if (next > this.objective) {
      this.objective = next;
      if (next === 2) {
        this.dialogue.say('系統', '兩條道路接上了。現在去找三名受困者——每個人需要不同的救援方式。', 'system');
        audio.fanfare();
      }
      if (next === 3) this.triggerWin();
    }
  }

  triggerWin() {
    this.mode = 'win';
    this.winTimer = 0;
    this.camera.shake = 1.2;
    this.particles.winCelebration(VIEW_W / 2 + this.camera.x, this.camera.y + VIEW_H / 2);
    audio.fanfare();
    setTimeout(() => audio.fanfare(), 500);
    localStorage.removeItem(SAVE_KEY);
  }

  switchChar() {
    const from = this.active;
    from.deactivate();
    this.activeIdx = 1 - this.activeIdx;
    const to = this.active;
    to.activate();
    this.particles.switchFlash(to.x + to.w / 2, to.y + to.h / 2,
      to.id === 'yohani' ? '#40e0d0' : '#e040a0');
    audio.switchChar(this.activeIdx === 0);
    this.camera.shake = 0.3;
  }

  // ── 更新 ─────────────────────────────────────────────────────────────────
  update(dt) {
    this.time += dt;

    if (this.mode === 'title') {
      if (input.pressed.has('Space')) this.start();
      input.endStep();
      return;
    }

    if (input.pressed.has('Escape')) {
      if (this.mode === 'play') this.mode = 'pause';
      else if (this.mode === 'pause') this.mode = 'play';
      audio.blip(340);
    }

    if (this.mode === 'pause') {
      if (input.pressed.has('KeyX')) this.reset();
      input.endStep();
      return;
    }

    if (this.mode === 'win') {
      this.winTimer += dt;
      this.particles.update(dt);
      if (input.pressed.has('Space') && this.winTimer > 1.2) this.reset();
      input.endStep();
      return;
    }

    // play mode
    this.dialogue.update(dt, input.pressed.has('Space'));

    if (!this.dialogue.isOpen && input.pressed.has('KeyX')) {
      this.switchChar();
    }

    if (!this.dialogue.isOpen && input.pressed.has('Space')) {
      this.interact();
    }

    // 只有活躍角色接受移動輸入
    const ax = input.axis();
    this.chars.forEach((c, i) => {
      if (c.active) {
        c.update(dt, ax.x, ax.y, (ch) => this.collides(ch), () => audio.footstep());
      } else {
        // 非活躍角色保持步行動畫靜止
        c.update(dt, 0, 0, () => false, null);
      }
    });

    this.nodes.forEach((n) => n.update(dt));
    this.rescuees.forEach((r) => r.update(dt));
    this.particles.update(dt);
    this.updateCamera(dt);
    this.save();
    input.endStep();
  }

  start() {
    this.mode = 'play';
    audio.ensure();
    audio.startMusic();
    this.dialogue.say('系統',
      '轉運橋的正式結構與地下例外道路同時崩解。切換尤哈尼（藍）與珊妮（粉），讓兩條路重新接上。',
      'system');
    this.dialogue.say('尤哈尼', '我先穩住橋面。珊妮，你找得到下面的路嗎？', 'yohani');
    this.dialogue.say('珊妮', '找得到。但別替我決定走哪裡。需要改路，我會告訴你。', 'shani');
  }

  // ── 相機 ──────────────────────────────────────────────────────────────────
  updateCamera(dt) {
    const player = this.active;
    const tx = Math.max(0, Math.min(WORLD_W - VIEW_W, player.x + player.w / 2 - VIEW_W / 2));
    const ty = Math.max(0, Math.min(WORLD_H - VIEW_H, player.y + player.h / 2 - VIEW_H / 2));
    const factor = 1 - Math.pow(0.001, dt);
    this.camera.x += (tx - this.camera.x) * factor;
    this.camera.y += (ty - this.camera.y) * factor;
    this.camera.shake = Math.max(0, this.camera.shake - dt * 6);
  }

  // ── 水面動畫 ──────────────────────────────────────────────────────────────
  drawWaterAnimation(p) {
    // 只在相機視野內的水面範圍繪製動態波紋
    const UPPER_TY1 = 18;
    const LOWER_TY0 = 22;
    const waterTop = UPPER_TY1 * TILE - this.camera.y;
    const waterBot = LOWER_TY0 * TILE - this.camera.y;
    if (waterBot < 0 || waterTop > VIEW_H) return;

    const visTop = Math.max(0, waterTop | 0);
    const visBot = Math.min(VIEW_H, waterBot | 0);
    const period = this.time * 7;

    for (let py = visTop; py < visBot; py += 4) {
      for (let px = 0; px < VIEW_W; px += 16) {
        const wx = (px + (this.camera.x | 0)) / TILE | 0;
        const phase = (period + wx * 2.7 + py * 1.3) % (Math.PI * 2);
        const w = 4 + Math.round(Math.sin(phase) * 2);
        p.hline(px + 2, py, w, '#2a5070');
        p.hline(px + 2, py + 1, w - 1, '#3a6888');
      }
    }
  }

  // ── 渲染 ──────────────────────────────────────────────────────────────────
  draw() {
    const p = offPainter;
    const c = offCtx;

    // 搖晃偏移
    const shake = this.camera.shake;
    const ox = shake > 0 ? Math.round((Math.random() - 0.5) * shake * 5) : 0;
    const oy = shake > 0 ? Math.round((Math.random() - 0.5) * shake * 3) : 0;

    c.save();
    c.translate(ox, oy);

    // 繪製預烘焙世界地圖
    const worldMap = getBakedMap(this.repaired);
    const cx = this.camera.x | 0;
    const cy = this.camera.y | 0;
    c.drawImage(worldMap, cx, cy, VIEW_W, VIEW_H, 0, 0, VIEW_W, VIEW_H);

    // 水面動態波紋疊加
    this.drawWaterAnimation(p);

    // 遠景平行捲動雲（輕量版，疊在地圖上面）
    this.drawClouds(p);

    // 物件層
    for (const node of this.nodes) node.draw({ x: cx, y: cy }, p);
    for (const rescuee of this.rescuees) rescuee.draw({ x: cx, y: cy }, p);

    // 角色（非活躍先畫，確保活躍角色在最上層）
    this.chars[1 - this.activeIdx].draw({ x: cx, y: cy }, p);
    this.chars[this.activeIdx].draw({ x: cx, y: cy }, p);

    // 粒子
    this.particles.draw(c, { x: cx, y: cy });

    c.restore();

    // HUD（不受搖晃影響）
    if (this.mode !== 'title') {
      drawCharHUD(c, this.active, VIEW_W);
      drawMissionHUD(c,
        this.nodes.filter((n) => n.done).length, this.nodes.length,
        this.rescuees.filter((r) => r.rescued).length, this.rescuees.length,
        this.objective, VIEW_W);

      // 互動提示
      if (!this.dialogue.isOpen && this.mode === 'play') {
        const prompt = this.nearbyPrompt();
        if (prompt) drawPrompt(c, prompt, VIEW_W, VIEW_H);
      }
    }

    this.dialogue.draw(c, VIEW_W, VIEW_H);
    if (this.mode === 'title') drawTitle(c, this.time, VIEW_W, VIEW_H);
    if (this.mode === 'pause') drawPause(c, VIEW_W, VIEW_H);
    if (this.mode === 'win')   drawWin(c, this.time, VIEW_W, VIEW_H);

    // 最後一次 blit 到真實 canvas
    ctx.drawImage(offscreen, 0, 0);
  }

  drawClouds(p) {
    const parallax = this.camera.x * 0.04;
    p.ctx.globalAlpha = 0.28;
    p.ctx.fillStyle = '#c4b8d0';
    const bands = [
      { y: 18, w: 28, step: 74, h: 4, offsetTime: 0 },
      { y: 30, w: 22, step: 58, h: 3, offsetTime: 100 },
    ];
    for (const band of bands) {
      const period = VIEW_W + 90;
      for (let i = 0; i < 8; i += 1) {
        const rawX = (i * band.step + this.time * 4 - parallax + band.offsetTime) % period;
        const x = rawX < 0 ? rawX + period : rawX;
        p.rect(x - 45, band.y, band.w, band.h, '#c4b8d0');
        p.rect(x - 45 + 7, band.y - 3, band.w - 12, band.h, '#d8cce0');
      }
    }
    p.ctx.globalAlpha = 1;
  }

  nearbyPrompt() {
    const pc = this.active.center;
    const REACH = 30;

    const node = this.nodes
      .filter((n) => !n.done)
      .find((n) => dist(pc, n.center) < REACH);
    if (node) return node.label;

    const rescuee = this.rescuees
      .filter((r) => !r.rescued)
      .find((r) => dist(pc, r.center) < REACH);
    if (rescuee) return `協助  ${rescuee.name}`;

    return null;
  }
}

// ── 工具函式 ─────────────────────────────────────────────────────────────────
function dist2(a, b) { return (a.x - b.x) ** 2 + (a.y - b.y) ** 2; }
function dist(a, b)  { return Math.hypot(a.x - b.x, a.y - b.y); }

// ── 主迴圈 ───────────────────────────────────────────────────────────────────
bindInput(document);

const soundBtn = document.querySelector('#soundButton');
const fullBtn  = document.querySelector('#fullscreenButton');
const gameFrame = document.querySelector('#gameFrame');
const loading   = document.querySelector('#loading');

let soundOn = true;
soundBtn?.addEventListener('click', () => {
  soundOn = !soundOn;
  audio.setEnabled(soundOn);
  if (soundBtn) {
    soundBtn.textContent = `聲音：${soundOn ? '開' : '關'}`;
    soundBtn.setAttribute('aria-pressed', String(soundOn));
  }
  if (soundOn) audio.blip(660);
});

fullBtn?.addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) await gameFrame.requestFullscreen();
    else await document.exitFullscreen();
  } catch { /* 有些瀏覽器不支援全螢幕，靜默忽略 */ }
});

const STEP = 1 / 60;
const MAX_FRAME_DT = 0.1;
const game = new Game();
let prev = performance.now();
let accumulator = 0;

function frame(now) {
  const elapsed = Math.min((now - prev) / 1000, MAX_FRAME_DT);
  prev = now;
  accumulator += elapsed;

  while (accumulator >= STEP) {
    game.update(STEP);
    accumulator -= STEP;
  }

  game.draw();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

// 移除載入遮罩
setTimeout(() => {
  if (loading) {
    loading.classList.add('hidden');
  }
}, 300);
