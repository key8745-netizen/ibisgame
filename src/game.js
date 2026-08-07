// 《未完成的星路》主遊戲迴圈。固定步長 (60Hz) 物理 + 螢幕刷新率解耦的渲染。

import { input, bindInput } from './engine/input.js';
import { audio } from './engine/audio.js';
import { Painter, makeCanvas } from './engine/pixel.js';
import {
  TILE, WORLD_W, WORLD_H, isWalkable, getBakedMap,
} from './world/map.js';
import {
  NODE_DEFS, RESCUEE_DEFS, YOHANI_START, SHANI_START,
  SAVE_KEY, SAVE_VERSION, WALKABLE, validateSave, isVictory,
  BOTH_RESCUE_RADIUS,
} from './c01-level.js';
import { RepairNode, Rescuee } from './world/objects.js';
import { Character } from './world/characters.js';
import { ParticleSystem } from './ui/particles.js';
import {
  DialogueBox, drawCharHUD, drawMissionHUD, drawPrompt,
  drawTitle, drawPause, drawWin,
  drawWrongCharHint, drawOffscreenArrows,
} from './ui/hud.js';

// ── Canvas 設定 ─────────────────────────────────────────────────────────────
const canvas    = document.querySelector('#game');
const ctx       = canvas.getContext('2d', { alpha: false });
ctx.imageSmoothingEnabled = false;

const VIEW_W = canvas.width;   // 480
const VIEW_H = canvas.height;  // 270

const { canvas: offscreen, ctx: offCtx } = makeCanvas(VIEW_W, VIEW_H);
offCtx.imageSmoothingEnabled = false;
const offPainter = new Painter(offCtx);

// 減少動畫偏好（OS 層級）
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── 遊戲狀態類 ──────────────────────────────────────────────────────────────
class Game {
  constructor() {
    this.mode     = 'title'; // title | play | pause | win
    this.time     = 0;
    this.winTimer = 0;
    this.lastSave = 0;

    this.camera = { x: 0, y: 0, shake: 0 };

    this.nodes    = NODE_DEFS.map((def) => new RepairNode(def));
    this.repaired = new Set();

    this.rescuees = RESCUEE_DEFS.map((d) => new Rescuee(d.id, d.x, d.y, d.name, d.requirement));

    this.chars = [
      new Character('yohani', YOHANI_START.x, YOHANI_START.y),
      new Character('shani',  SHANI_START.x,  SHANI_START.y),
    ];
    this.activeIdx = 0;
    this.chars[0].activate();

    this.dialogue = new DialogueBox();
    this.particles = new ParticleSystem({ reducedMotion: prefersReducedMotion });

    this.objective    = 0;
    this.wrongCharHint = null; // { text, color, timer }

    this.load();
  }

  get active()   { return this.chars[this.activeIdx]; }
  get inactive() { return this.chars[1 - this.activeIdx]; }

  // ── 存檔 / 讀檔 ────────────────────────────────────────────────────────────
  save(force = false) {
    if (!force && this.time - this.lastSave < 1.5) return;
    this.lastSave = this.time;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        version:   SAVE_VERSION,
        objective: this.objective,
        repaired:  [...this.repaired],
        rescued:   this.rescuees.filter((r) => r.rescued).map((r) => r.id),
        positions: this.chars.map((c) => ({ x: c.x | 0, y: c.y | 0 })),
      }));
    } catch { /* localStorage 可能被停用 */ }
  }

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const saved = validateSave(JSON.parse(raw));
      if (!saved) { localStorage.removeItem(SAVE_KEY); return; }

      for (const id of saved.repaired) this.repaired.add(id);
      for (const node of this.nodes)   node.done = this.repaired.has(node.id);
      for (const r of this.rescuees)   r.rescued  = saved.rescued.includes(r.id);

      if (saved.positions) {
        this.chars.forEach((c, i) => {
          const pos = saved.positions[i];
          if (pos) { c.x = pos.x; c.y = pos.y; }
        });
      }
      this.objective = saved.objective;
    } catch {
      localStorage.removeItem(SAVE_KEY);
    }
  }

  reset() {
    localStorage.removeItem(SAVE_KEY);
    window.location.reload();
  }

  // ── 碰撞偵測 ──────────────────────────────────────────────────────────────
  collides(char) {
    const corners = [
      [char.x + 2,          char.y + char.h - 2],
      [char.x + char.w - 2, char.y + char.h - 2],
      [char.x + 2,          char.y + char.h + 2],
      [char.x + char.w - 2, char.y + char.h + 2],
    ];
    return corners.some(([cx, cy]) => !isWalkable(cx, cy, this.repaired));
  }

  // ── 互動 ──────────────────────────────────────────────────────────────────
  interact() {
    const player = this.active;
    const pc     = player.center;
    const REACH  = 30;

    // 找最近未完成修復節點
    const node = this.nodes
      .filter((n) => !n.done)
      .sort((a, b) => dist2(pc, a.center) - dist2(pc, b.center))[0];

    if (node && dist(pc, node.center) < REACH) {
      if (node.required !== player.id) {
        const need  = node.required === 'yohani' ? '尤哈尼' : '珊妮';
        const color = node.required === 'yohani' ? '#40e0d0' : '#e040a0';
        this.wrongCharHint = { text: `需換${need}`, color, timer: 2.2 };
        audio.deny();
        return;
      }
      node.done = true;
      this.repaired.add(node.id);
      if (!prefersReducedMotion) this.camera.shake = 0.6;
      this.particles.repairFlash(
        node.x + TILE / 2, node.y + TILE / 2,
        player.id === 'yohani' ? '#40e0d0' : '#e040a0',
      );
      audio.repair();
      this.dialogue.say(
        player.id === 'yohani' ? '尤哈尼' : '珊妮',
        node.label + '——完成。', player.id,
      );
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
        const need  = rescuee.requirement === 'yohani' ? '尤哈尼' : '珊妮';
        const color = rescuee.requirement === 'yohani' ? '#40e0d0' : '#e040a0';
        this.wrongCharHint = { text: `需換${need}`, color, timer: 2.2 };
        audio.deny();
        return;
      }
      if (rescuee.requirement === 'both') {
        const yohaniNear = dist(this.chars[0].center, rescuee.center) <= BOTH_RESCUE_RADIUS;
        const shaniNear  = dist(this.chars[1].center, rescuee.center) <= BOTH_RESCUE_RADIUS;
        if (!yohaniNear || !shaniNear) {
          this.dialogue.say('迷路的孩子', '可以讓你們兩個都靠近我嗎？我怕走散。', 'system');
          audio.deny();
          return;
        }
      }
      rescuee.rescued = true;
      this.particles.rescueFlash(rescuee.x + 6, rescuee.y + 6);
      if (!prefersReducedMotion) this.camera.shake = 0.4;
      audio.fanfare();
      this.dialogue.say(rescuee.name, '謝謝！我會沿著你們留的標記撤離。', 'system');
      this.save(true);
      this.checkObjective();
      return;
    }

    audio.blip(240);
  }

  allNodesRepaired() { return this.nodes.every((n) => n.done); }

  getBothRescueHintState() {
    if (!this.allNodesRepaired()) return null;
    const child = this.rescuees.find((r) => r.requirement === 'both' && !r.rescued);
    if (!child) return null;
    const yNear = dist(this.chars[0].center, child.center) <= BOTH_RESCUE_RADIUS;
    const sNear = dist(this.chars[1].center, child.center) <= BOTH_RESCUE_RADIUS;
    if (yNear === sNear) return null;
    if (yNear) return { text: '等珊妮',   color: '#e040a0', worldX: this.chars[1].x, worldY: this.chars[1].y };
    return           { text: '等尤哈尼', color: '#40e0d0', worldX: this.chars[0].x, worldY: this.chars[0].y };
  }

  checkObjective() {
    const repaired = this.nodes.filter((n) => n.done).length;
    const rescued  = this.rescuees.filter((r) => r.rescued).length;
    const next     = rescued >= 3 ? 3 : repaired >= 4 ? 2 : repaired > 0 ? 1 : 0;
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
    this.mode     = 'win';
    this.winTimer = 0;
    if (!prefersReducedMotion) this.camera.shake = 1.2;
    this.particles.winCelebration(
      VIEW_W / 2 + this.camera.x,
      this.camera.y + VIEW_H / 2,
    );
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
    this.particles.switchFlash(
      to.x + to.w / 2, to.y + to.h / 2,
      to.id === 'yohani' ? '#40e0d0' : '#e040a0',
    );
    audio.switchChar(this.activeIdx === 0);
    if (!prefersReducedMotion) this.camera.shake = 0.3;
  }

  // ── 更新 ──────────────────────────────────────────────────────────────────
  update(dt) {
    this.time += dt;

    // 錯誤角色提示計時
    if (this.wrongCharHint) {
      this.wrongCharHint.timer -= dt;
      if (this.wrongCharHint.timer <= 0) this.wrongCharHint = null;
    }

    if (this.mode === 'title') {
      if (input.pressed.has('Space')) this.start();
      input.endStep();
      return;
    }

    if (input.pressed.has('Escape')) {
      if (this.mode === 'play')  this.mode = 'pause';
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

    if (!this.dialogue.isOpen && input.pressed.has('KeyX')) this.switchChar();
    if (!this.dialogue.isOpen && input.pressed.has('Space')) this.interact();

    const ax = input.axis();
    this.chars.forEach((c) => {
      if (c.active) {
        c.update(dt, ax.x, ax.y, (ch) => this.collides(ch), () => audio.footstep());
      } else {
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
    this.dialogue.say('珊妮',   '找得到。但別替我決定走哪裡。需要改路，我會告訴你。', 'shani');
  }

  // ── 相機 ──────────────────────────────────────────────────────────────────
  updateCamera(dt) {
    const player = this.active;
    const tx     = Math.max(0, Math.min(WORLD_W - VIEW_W, player.x + player.w / 2 - VIEW_W / 2));
    const ty     = Math.max(0, Math.min(WORLD_H - VIEW_H, player.y + player.h / 2 - VIEW_H / 2));
    const factor = 1 - Math.pow(0.001, dt);
    this.camera.x += (tx - this.camera.x) * factor;
    this.camera.y += (ty - this.camera.y) * factor;
    this.camera.shake = Math.max(0, this.camera.shake - dt * 6);
  }

  // ── 水面動畫 ──────────────────────────────────────────────────────────────
  drawWaterAnimation(p) {
    const waterTop = WALKABLE.upper.ty1  * TILE - this.camera.y;
    const waterBot = WALKABLE.tunnel.ty0 * TILE - this.camera.y;
    if (waterBot < 0 || waterTop > VIEW_H) return;

    const visTop = Math.max(0, waterTop | 0);
    const visBot = Math.min(VIEW_H, waterBot | 0);
    const period = this.time * 7;

    for (let py = visTop; py < visBot; py += 4) {
      for (let px = 0; px < VIEW_W; px += 16) {
        const wx    = (px + (this.camera.x | 0)) / TILE | 0;
        const phase = (period + wx * 2.7 + py * 1.3) % (Math.PI * 2);
        const w     = 4 + Math.round(Math.sin(phase) * 2);
        p.hline(px + 2, py,     w,     '#2a5070');
        p.hline(px + 2, py + 1, w - 1, '#3a6888');
      }
    }
  }

  // ── 離屏方向箭頭目標 ──────────────────────────────────────────────────────
  getOffscreenTargets() {
    if (!this.allNodesRepaired()) {
      // 最近一個未完成節點（對應活躍角色）
      const targets = this.nodes
        .filter((n) => !n.done && n.required === this.active.id)
        .sort((a, b) => dist2(this.active.center, a.center) - dist2(this.active.center, b.center));
      if (targets.length) {
        const n = targets[0];
        return [{ worldX: n.x, worldY: n.y, color: n.required === 'yohani' ? '#40e0d0' : '#e040a0' }];
      }
    } else {
      // 最近一個未救出的受困者
      const targets = this.rescuees
        .filter((r) => !r.rescued)
        .sort((a, b) => dist2(this.active.center, a.center) - dist2(this.active.center, b.center));
      if (targets.length) {
        const r = targets[0];
        return [{ worldX: r.x, worldY: r.y, color: '#f0d040' }];
      }
    }
    return [];
  }

  // ── 渲染 ──────────────────────────────────────────────────────────────────
  draw() {
    const p  = offPainter;
    const c  = offCtx;

    const shake = prefersReducedMotion ? 0 : this.camera.shake;
    const ox    = shake > 0 ? Math.round((Math.random() - 0.5) * shake * 5) : 0;
    const oy    = shake > 0 ? Math.round((Math.random() - 0.5) * shake * 3) : 0;

    c.save();
    c.translate(ox, oy);

    // 預烘焙世界地圖
    const worldMap = getBakedMap(this.repaired);
    const cx = this.camera.x | 0;
    const cy = this.camera.y | 0;
    c.drawImage(worldMap, cx, cy, VIEW_W, VIEW_H, 0, 0, VIEW_W, VIEW_H);

    // 水面動態波紋（每幀疊加）
    this.drawWaterAnimation(p);

    // 雲層
    this.drawClouds(p);

    // 物件層
    for (const node of this.nodes)    node.draw({ x: cx, y: cy }, p);
    for (const rescuee of this.rescuees) rescuee.draw({ x: cx, y: cy }, p);

    // 角色（非活躍先畫）
    this.chars[1 - this.activeIdx].draw({ x: cx, y: cy }, p);
    this.chars[this.activeIdx].draw({ x: cx, y: cy }, p);

    this.particles.draw(c, { x: cx, y: cy });
    c.restore();

    // HUD（不受搖晃影響）
    if (this.mode !== 'title') {
      drawCharHUD(c, this.active, VIEW_W);
      drawMissionHUD(c, this.nodes, this.rescuees, this.objective, VIEW_W);

      if (!this.dialogue.isOpen && this.mode === 'play') {
        const prompt = this.nearbyPrompt();
        if (prompt) drawPrompt(c, prompt, VIEW_W, VIEW_H);

        // 離屏方向箭頭
        const arrowTargets = this.getOffscreenTargets();
        if (arrowTargets.length) {
          drawOffscreenArrows(c, arrowTargets, { x: cx, y: cy }, VIEW_W, VIEW_H);
        }

        // 合作救援持續提示（一人在場一人未到時）
        if (!this.wrongCharHint) {
          const coopHint = this.getBothRescueHintState();
          if (coopHint) {
            drawWrongCharHint(c, coopHint.text, coopHint.color, VIEW_W, VIEW_H);
            drawOffscreenArrows(c, [{ worldX: coopHint.worldX, worldY: coopHint.worldY, color: coopHint.color }], { x: cx, y: cy }, VIEW_W, VIEW_H);
          }
        }
      }
    }

    // 錯誤角色小提示
    if (this.wrongCharHint) {
      drawWrongCharHint(c, this.wrongCharHint.text, this.wrongCharHint.color, VIEW_W, VIEW_H);
    }

    this.dialogue.draw(c, VIEW_W, VIEW_H);
    if (this.mode === 'title') drawTitle(c, this.time, VIEW_W, VIEW_H);
    if (this.mode === 'pause') drawPause(c, VIEW_W, VIEW_H);
    if (this.mode === 'win')   drawWin(c, this.time, VIEW_W, VIEW_H);

    ctx.drawImage(offscreen, 0, 0);
  }

  drawClouds(p) {
    const parallax = this.camera.x * 0.04;
    p.ctx.globalAlpha = 0.28;
    const bands = [
      { y: 18, w: 28, step: 74,  h: 4, offsetTime: 0 },
      { y: 30, w: 22, step: 58,  h: 3, offsetTime: 100 },
    ];
    for (const band of bands) {
      const period = VIEW_W + 90;
      for (let i = 0; i < 8; i += 1) {
        const rawX = (i * band.step + this.time * 4 - parallax + band.offsetTime) % period;
        const x    = rawX < 0 ? rawX + period : rawX;
        p.rect(x - 45, band.y, band.w, band.h, '#c4b8d0');
        p.rect(x - 45 + 7, band.y - 3, band.w - 12, band.h, '#d8cce0');
      }
    }
    p.ctx.globalAlpha = 1;
  }

  nearbyPrompt() {
    const pc    = this.active.center;
    const REACH = 30;
    const node  = this.nodes.filter((n) => !n.done)
                            .find((n) => dist(pc, n.center) < REACH);
    if (node) return node.label;
    const rescuee = this.rescuees.filter((r) => !r.rescued)
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

const soundBtn  = document.querySelector('#soundButton');
const fullBtn   = document.querySelector('#fullscreenButton');
const gameFrame = document.querySelector('#gameFrame');
const loading   = document.querySelector('#loading');

// 全螢幕支援檢查
if (fullBtn && !document.fullscreenEnabled) {
  fullBtn.hidden = true;
}

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
  } catch { /* 靜默忽略 */ }
});

const STEP          = 1 / 60;
const MAX_FRAME_DT  = 0.1;
const game          = new Game();
let prev            = performance.now();
let accumulator     = 0;

// 視窗失去焦點 / 切到後台時自動暫停
document.addEventListener('visibilitychange', () => {
  if (document.hidden && game.mode === 'play') {
    game.mode = 'pause';
    input.clearAll();
  }
});
window.addEventListener('blur', () => {
  if (game.mode === 'play') {
    game.mode = 'pause';
    input.clearAll();
  }
});

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

setTimeout(() => {
  if (loading) loading.classList.add('hidden');
}, 300);
