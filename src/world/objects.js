// 可互動物件（修復節點＋受困者）的視覺與邏輯。
// 所有物件的位置都相對於世界座標系統，draw 方法接收相機偏移。

import { Painter, hash2 } from '../engine/pixel.js';
import { C, TILE } from './map.js';

// ── 共用輔助 ─────────────────────────────────────────────────────────────────

function drawLabel(p, worldX, worldY, camera, text, color, pulse) {
  const sx = (worldX - camera.x) | 0;
  const sy = (worldY - camera.y) | 0;
  const floatY = Math.round(Math.sin(pulse * 2.5) * 2);

  const ctx = p.ctx;
  ctx.font = 'bold 7px monospace';
  const tw = ctx.measureText(text).width;
  const lx = (sx - tw / 2) | 0;
  const ly = sy + floatY;

  // 背板
  ctx.fillStyle = 'rgba(8,12,24,0.78)';
  ctx.fillRect(lx - 3, ly - 8, tw + 6, 10);
  ctx.fillStyle = color;
  ctx.fillText(text, lx, ly);
}

// ── RepairNode ────────────────────────────────────────────────────────────────
// 視覺表現：半固定在橋梁位置的控制台 / 封鎖標誌。

export class RepairNode {
  constructor({ id, x, y, type, required, label }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.type = type;       // 'console' | 'seal'
    this.required = required; // 'yohani' | 'sani'
    this.label = label;
    this.done = false;
    this.pulse = hash2(x, y) * Math.PI * 2;
    this.w = TILE;
    this.h = TILE;
  }

  get center() { return { x: this.x + this.w / 2, y: this.y + this.h / 2 }; }

  update(dt) {
    this.pulse += dt * 2.2;
  }

  draw(camera, p) {
    const sx = (this.x - camera.x) | 0;
    const sy = (this.y - camera.y) | 0;
    const flash = (Math.sin(this.pulse) + 1) / 2;

    if (this.type === 'console') {
      this.drawConsole(p, sx, sy, flash);
    } else {
      this.drawSeal(p, sx, sy, flash);
    }

    if (!this.done) {
      const color = this.required === 'yohani' ? C.glow_cyan : C.glow_pink;
      drawLabel(p, this.x + this.w / 2, this.y - 8, camera, this.label, color, this.pulse);
    }
  }

  drawConsole(p, sx, sy, flash) {
    const active = this.done;
    // 底座
    p.rect(sx + 2, sy + 9, 12, 8, C.tunnel1);
    p.rect(sx + 3, sy + 6, 10, 5, C.steelHigh);
    p.rect(sx + 4, sy + 7, 8, 4, active ? '#1a3028' : '#1a2030');
    // 螢幕
    if (active) {
      p.rect(sx + 5, sy + 8, 6, 2, '#20e070');
      p.rect(sx + 6, sy + 8, 4, 1, '#80ffa0');
    } else {
      const cy = Math.floor(flash * 1.5);
      p.rect(sx + 5, sy + 8 + cy, 6, 1, C.glow_cyan);
    }
    // 腳架
    p.rect(sx + 4, sy + 14, 3, 3, C.steel);
    p.rect(sx + 9, sy + 14, 3, 3, C.steel);
    // 外框高光
    p.hline(sx + 3, sy + 6, 10, C.cableHigh);
    if (!active) {
      // 脈動圓形指示燈
      p.rect(sx + 13, sy + 7, 2, 2, flash > 0.5 ? C.glow_cyan : C.steel);
    } else {
      p.rect(sx + 13, sy + 7, 2, 2, '#20e070');
    }
  }

  drawSeal(p, sx, sy, flash) {
    const active = this.done;
    if (active) {
      // 解除後：小門打開狀態
      p.rect(sx + 3, sy + 3, 10, 12, '#1a3050');
      p.rect(sx + 4, sy + 4, 4, 10, '#0a1828');
      p.frame(sx + 3, sy + 3, 10, 12, C.patchEdge);
      // 綠色完成燈
      p.rect(sx + 5, sy + 1, 6, 2, '#20e070');
    } else {
      // 未解除：警示標誌
      const col = flash > 0.55 ? C.warnOrange : C.warnYellow;
      p.rect(sx + 1, sy + 2, 14, 13, C.tunnel2);
      p.frame(sx + 1, sy + 2, 14, 13, col);
      // 驚嘆號
      p.rect(sx + 7, sy + 4, 2, 6, col);
      p.rect(sx + 7, sy + 11, 2, 2, col);
      // 上方浮動脈動指示
      const floatY = Math.round(Math.sin(this.pulse) * 2);
      p.rect(sx + 6, sy - 4 + floatY, 4, 3, C.glow_pink);
    }
  }
}

// ── Rescuee ───────────────────────────────────────────────────────────────────
// 受困者：獨特的像素像外觀，依救援需求穿不同顏色外套。

const RESCUEE_PALETTES = {
  yohani: { coat: '#4a6098', coatHigh: '#6a80b8', hair: '#3a2838', skin: '#d0a070' },
  sani:   { coat: '#904878', coatHigh: '#b06898', hair: '#2a1830', skin: '#c08060' },
  both:   { coat: '#8a7030', coatHigh: '#c0a040', hair: '#1a2030', skin: '#d8a878' },
};

export class Rescuee {
  constructor(id, x, y, name, requirement) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.name = name;
    this.requirement = requirement;
    this.w = 12;
    this.h = 14;
    this.rescued = false;
    this.bob = hash2(x, y) * Math.PI * 2;
    this.wave = 0;
    this.waveDir = 1;
  }

  get center() { return { x: this.x + this.w / 2, y: this.y + this.h / 2 }; }

  update(dt) {
    if (this.rescued) return;
    this.bob += dt * 2.8;
    this.wave += dt * this.waveDir * 7;
    if (Math.abs(this.wave) > 1) this.waveDir *= -1;
  }

  draw(camera, p) {
    if (this.rescued) return;
    const sx = (this.x - camera.x) | 0;
    const sy = (this.y - camera.y + Math.sin(this.bob) * 1.5) | 0;
    const pal = RESCUEE_PALETTES[this.requirement] || RESCUEE_PALETTES.both;
    const waveOffset = Math.round(this.wave);

    // 陰影
    p.ctx.globalAlpha = 0.35;
    p.rect(sx + 1, sy + 13, 10, 2, '#000000');
    p.ctx.globalAlpha = 1;

    // 頭髮
    p.rect(sx + 2, sy, 8, 4, pal.hair);
    p.rect(sx + 1, sy + 1, 2, 4, pal.hair);
    // 臉
    p.rect(sx + 2, sy + 3, 8, 5, pal.skin);
    // 眼睛
    p.rect(sx + 4, sy + 5, 1, 1, '#101020');
    p.rect(sx + 7, sy + 5, 1, 1, '#101020');
    // 揮手手臂（在搖擺）
    p.rect(sx - 1 + waveOffset, sy + 6, 2, 4, pal.skin);
    p.rect(sx + 11, sy + 5 - waveOffset, 2, 4, pal.skin);
    // 外套
    p.rect(sx + 1, sy + 7, 10, 5, pal.coat);
    p.hline(sx + 2, sy + 7, 8, pal.coatHigh);
    // 腿
    p.rect(sx + 2, sy + 11, 3, 3, '#282838');
    p.rect(sx + 7, sy + 11, 3, 3, '#282838');

    // 頭上金色求救標誌
    const floatY = Math.round(Math.sin(this.bob * 1.3) * 2);
    p.rect(sx + 4, sy - 8 + floatY, 4, 3, C.glow_gold);
    // 求救標誌本體（!）
    p.rect(sx + 5, sy - 13 + floatY, 2, 4, C.glow_gold);
    p.rect(sx + 5, sy - 8 + floatY, 2, 1, C.glow_gold);

    // 名字標籤（靠近時才看得到清楚）
    const ctx = p.ctx;
    ctx.font = '6px monospace';
    ctx.fillStyle = C.glow_gold;
    const tw = ctx.measureText(this.name).width;
    ctx.fillText(this.name, (sx + 6 - tw / 2) | 0, sy - 16 + floatY);
  }
}
