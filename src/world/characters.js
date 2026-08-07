// 尤哈尼與珊妮的像素精靈。
// 16×16 繪製空間，走路動畫 4 幀，每個方向都有正確的朝向。
// 「脈衝光暈」在角色剛切換時顯示約 0.5 秒。

import { Painter } from '../engine/pixel.js';
import { TILE, C } from './map.js';

const SPEED = 74;     // px/s
const STEP_SFX_INTERVAL = 0.3; // 每步音效間隔

// 像素圖：尤哈尼（藍系）
const YOHANI = {
  hair: '#3c3040',
  hairHL: '#5a4858',
  skin: '#d4a078',
  skinHL: '#e8c090',
  body: '#4a6898',
  bodyHL: '#6a88b8',
  trim: '#90b8d0',
  legs: '#252c40',
  shoe: '#181a28',
  eye: '#101828',
  glow: C.glow_cyan,
};

// 像素圖：珊妮（紫粉系）
const SANI = {
  hair: '#2c1c38',
  hairHL: '#4a3060',
  skin: '#c88a68',
  skinHL: '#e0a880',
  body: '#8c4870',
  bodyHL: '#b06890',
  trim: '#e090b0',
  legs: '#2c2840',
  shoe: '#1a1828',
  eye: '#180820',
  glow: C.glow_pink,
};

function drawSprite(p, x, y, pal, facing, walkFrame, active, glowPct) {
  // 光暈
  if (active) {
    const gr = p.ctx.createRadialGradient(x + 7, y + 12, 0, x + 7, y + 12, 16);
    gr.addColorStop(0, pal.glow + 'aa');
    gr.addColorStop(0.5, pal.glow + '22');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    p.ctx.fillStyle = gr;
    p.ctx.fillRect(x - 9, y, 32, 16);

    if (glowPct > 0) {
      p.ctx.globalAlpha = glowPct * 0.5;
      p.ctx.fillStyle = pal.glow;
      p.ctx.fillRect(x - 4, y - 2, 24, 18);
      p.ctx.globalAlpha = 1;
    }
  }

  // 地板陰影
  p.ctx.globalAlpha = 0.3;
  p.rect(x + 2, y + 13, 10, 2, '#000');
  p.ctx.globalAlpha = 1;

  // 腿部動畫（4幀走路週期）
  const f = walkFrame % 4;
  let [legL, legR] = [[0, 0], [0, 0]];
  if (f === 0)      { legL = [0, 0]; legR = [0, 0]; }
  else if (f === 1) { legL = [-1, 0]; legR = [1, 1]; }
  else if (f === 2) { legL = [0, 0]; legR = [0, 0]; }
  else              { legL = [1, 1]; legR = [-1, 0]; }

  p.rect(x + 3 + legL[0], y + 9 + legL[1], 3, 4 - legL[1], pal.legs);
  p.rect(x + 8 + legR[0], y + 9 + legR[1], 3, 4 - legR[1], pal.legs);
  p.rect(x + 3 + legL[0], y + 12, 3, 2, pal.shoe);
  p.rect(x + 8 + legR[0], y + 12, 3, 2, pal.shoe);

  // 身體
  p.rect(x + 2, y + 4, 10, 6, pal.body);
  p.hline(x + 3, y + 4, 8, pal.bodyHL);
  p.hline(x + 2, y + 9, 10, pal.trim);
  // 衣領
  p.rect(x + 4, y + 4, 6, 2, pal.trim);

  // 手臂（依朝向與走路幀偏移）
  const armSwing = f === 1 ? -1 : f === 3 ? 1 : 0;
  p.rect(x,     y + 5 + armSwing, 2, 4, pal.skin);  // 左臂
  p.rect(x + 12, y + 5 - armSwing, 2, 4, pal.skin); // 右臂

  // 頭
  p.rect(x + 3, y, 8, 5, pal.skin);
  p.hline(x + 4, y, 6, pal.skinHL);
  p.rect(x + 3, y, 8, 2, pal.hair);
  p.hline(x + 4, y, 6, pal.hairHL);
  p.rect(x + 2, y + 1, 2, 3, pal.hair); // 瀏海

  // 眼睛（依朝向）
  if (facing === 'left') {
    p.px(x + 4, y + 3, pal.eye);
    p.px(x + 5, y + 3, pal.skin); // 看左邊時左眼在前
  } else if (facing === 'right') {
    p.px(x + 9, y + 3, pal.eye);
  } else if (facing === 'up') {
    // 看背影，不畫眼睛，多畫頭髮
    p.rect(x + 3, y, 8, 4, pal.hair);
  } else {
    p.px(x + 5, y + 3, pal.eye);
    p.px(x + 8, y + 3, pal.eye);
  }

  // 活躍指示框（底部小條）
  if (active) {
    p.hline(x + 3, y + 15, 8, pal.glow);
  }
}

export class Character {
  constructor(id, startX, startY) {
    this.id = id;
    this.x = startX;
    this.y = startY;
    this.w = 14;
    this.h = 14;
    this.speed = SPEED;
    this.active = false;
    this.facing = 'down';
    this.walkAcc = 0;
    this.walkFrame = 0;
    this.stepTimer = 0;
    this.glow = 0;         // 0..1 切換後的閃光殘留
    this.pal = id === 'yohani' ? YOHANI : SANI;
  }

  get center() { return { x: this.x + this.w / 2, y: this.y + this.h / 2 }; }

  activate() {
    this.active = true;
    this.glow = 1;
  }

  deactivate() {
    this.active = false;
    this.glow = 0;
  }

  update(dt, moveX, moveY, collide, onStep) {
    this.glow = Math.max(0, this.glow - dt * 2.5);
    if (!this.active) return;

    const moving = moveX !== 0 || moveY !== 0;

    if (Math.abs(moveX) > Math.abs(moveY)) {
      this.facing = moveX < 0 ? 'left' : 'right';
    } else if (moveY !== 0) {
      this.facing = moveY < 0 ? 'up' : 'down';
    }

    if (moving) {
      const oldX = this.x;
      const oldY = this.y;

      // X 軸移動
      this.x += moveX * this.speed * dt;
      if (collide(this)) this.x = oldX;

      // Y 軸移動
      this.y += moveY * this.speed * dt;
      if (collide(this)) this.y = oldY;

      const moved = this.x !== oldX || this.y !== oldY;
      if (moved) {
        this.walkAcc += dt;
        this.stepTimer += dt;
        this.walkFrame = Math.floor(this.walkAcc * 9) % 4;
        if (this.stepTimer >= STEP_SFX_INTERVAL) {
          this.stepTimer = 0;
          if (onStep) onStep();
        }
      } else {
        this.walkFrame = 0;
        this.stepTimer = 0;
      }
    } else {
      this.walkFrame = 0;
      this.walkAcc = 0;
    }
  }

  draw(camera, p) {
    const sx = (this.x - camera.x) | 0;
    const sy = (this.y - camera.y) | 0;
    drawSprite(p, sx, sy, this.pal, this.facing, this.walkFrame, this.active, this.glow);
  }
}
