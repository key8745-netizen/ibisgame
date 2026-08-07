// 尤哈尼與珊妮 — v2 精靈系統
// 視覺幀：Yohani 32×48 / Sani 28×42  碰撞盒維持 14×14（不可改動）
// 圖集格式：rows 0=down 1=left 2=right 3=up；cols 0-3 Idle / 4-9 Walk / 10-13 Interact
// 載入失敗自動退回 v1 程序渲染器，遊戲繼續，儲存不受影響。

import { Painter } from '../engine/pixel.js';
import { TILE, C } from './map.js';

const SPEED = 74; // px/s  ← 不可改動
const STEP_SFX_INTERVAL = 0.3;
const BOTH_RESCUE_RADIUS_UNCHANGED = true; // 碰撞半徑守護標記

// ── 圖集規格 ─────────────────────────────────────────────────────────────────
const CHAR_CFG = {
  yohani: {
    atlas:   'assets/characters/spr_yohani_v2.png',
    frameW:  32,
    frameH:  48,
    offsetX: -9,   // draw offset relative to collision x
    offsetY: -34,  // draw offset relative to collision y
    idleDur:    200, // ms per idle frame
    walkDur:    100, // ms per walk frame
    interactDur: 120, // ms per interact frame
    interactTotal: 480, // 4×120ms
  },
  sani: {
    atlas:   'assets/characters/spr_sani_v2.png',
    frameW:  28,
    frameH:  42,
    offsetX: -7,
    offsetY: -28,
    idleDur:    150,
    walkDur:     80,
    interactDur: 100,
    interactTotal: 400, // 4×100ms
  },
};

const DIR_ROW = { down: 0, left: 1, right: 2, up: 3 };

// ── Atlas loader (singleton per character) ───────────────────────────────────
const _atlases = {};
let _warnedOnce = false;

function loadAtlas(charId) {
  if (_atlases[charId]) return _atlases[charId];
  const cfg = CHAR_CFG[charId];
  const entry = { img: null, loaded: false, valid: false };
  _atlases[charId] = entry;

  const img = new window.Image();
  img.onload = () => {
    const expectedW = 14 * cfg.frameW;
    const expectedH = 4  * cfg.frameH;
    if (img.naturalWidth === expectedW && img.naturalHeight === expectedH) {
      entry.img    = img;
      entry.loaded = true;
      entry.valid  = true;
    } else {
      if (!_warnedOnce) {
        console.warn(`[characters] atlas dimension mismatch for ${charId}: got ${img.naturalWidth}×${img.naturalHeight}, expected ${expectedW}×${expectedH} — falling back to procedural renderer`);
        _warnedOnce = true;
      }
    }
  };
  img.onerror = () => {
    if (!_warnedOnce) {
      console.warn(`[characters] atlas load failed for ${charId} — falling back to procedural renderer`);
      _warnedOnce = true;
    }
  };
  img.src = cfg.atlas;
  return entry;
}

// ── v1 Procedural fallback palette ───────────────────────────────────────────
const YOHANI_PAL = {
  hair: '#3c3040', hairHL: '#5a4858',
  skin: '#d4a078', skinHL: '#e8c090',
  body: '#4a6898', bodyHL: '#6a88b8', trim: '#90b8d0',
  legs: '#252c40', shoe: '#181a28', eye: '#101828', glow: C.glow_cyan,
};
const SANI_PAL = {
  hair: '#2c1c38', hairHL: '#4a3060',
  skin: '#c88a68', skinHL: '#e0a880',
  body: '#8c4870', bodyHL: '#b06890', trim: '#e090b0',
  legs: '#2c2840', shoe: '#1a1828', eye: '#180820', glow: C.glow_pink,
};

function drawSpriteFallback(p, x, y, pal, facing, walkFrame, active, glowPct) {
  if (active) {
    const gr = p.ctx.createRadialGradient(x+7,y+12,0,x+7,y+12,16);
    gr.addColorStop(0, pal.glow+'aa'); gr.addColorStop(0.5,pal.glow+'22'); gr.addColorStop(1,'rgba(0,0,0,0)');
    p.ctx.fillStyle = gr; p.ctx.fillRect(x-9,y,32,16);
    if (glowPct > 0) {
      p.ctx.globalAlpha = glowPct*0.5; p.ctx.fillStyle = pal.glow;
      p.ctx.fillRect(x-4,y-2,24,18); p.ctx.globalAlpha = 1;
    }
  }
  p.ctx.globalAlpha = 0.3; p.rect(x+2,y+13,10,2,'#000'); p.ctx.globalAlpha = 1;
  const f = walkFrame % 4;
  const legL = f===1?[-1,0]:f===3?[1,1]:[0,0];
  const legR = f===1?[1,1]:f===3?[-1,0]:[0,0];
  p.rect(x+3+legL[0],y+9+legL[1],3,4-legL[1],pal.legs);
  p.rect(x+8+legR[0],y+9+legR[1],3,4-legR[1],pal.legs);
  p.rect(x+3+legL[0],y+12,3,2,pal.shoe);
  p.rect(x+8+legR[0],y+12,3,2,pal.shoe);
  p.rect(x+2,y+4,10,6,pal.body);
  p.hline(x+3,y+4,8,pal.bodyHL); p.hline(x+2,y+9,10,pal.trim);
  p.rect(x+4,y+4,6,2,pal.trim);
  const armSwing = f===1?-1:f===3?1:0;
  p.rect(x,y+5+armSwing,2,4,pal.skin); p.rect(x+12,y+5-armSwing,2,4,pal.skin);
  p.rect(x+3,y,8,5,pal.skin); p.hline(x+4,y,6,pal.skinHL);
  p.rect(x+3,y,8,2,pal.hair); p.hline(x+4,y,6,pal.hairHL);
  p.rect(x+2,y+1,2,3,pal.hair);
  if (facing==='left')       { p.px(x+4,y+3,pal.eye); p.px(x+5,y+3,pal.skin); }
  else if (facing==='right') { p.px(x+9,y+3,pal.eye); }
  else if (facing==='up')    { p.rect(x+3,y,8,4,pal.hair); }
  else                       { p.px(x+5,y+3,pal.eye); p.px(x+8,y+3,pal.eye); }
  if (active) p.hline(x+3,y+15,8,pal.glow);
}

// ── Character class ───────────────────────────────────────────────────────────
export class Character {
  constructor(id, startX, startY) {
    this.id      = id;
    this.x       = startX;
    this.y       = startY;
    this.w       = 14; // collision width  — LOCKED
    this.h       = 14; // collision height — LOCKED
    this.speed   = SPEED;
    this.active  = false;
    this.facing  = 'down';
    this.walkAcc    = 0;
    this.walkFrame  = 0;  // legacy walk frame (used by fallback)
    this.stepTimer  = 0;
    this.glow       = 0;

    // v2 animation state
    this._animMs    = 0; // accumulator in ms
    this._state     = 'idle'; // 'idle' | 'walk' | 'interact'
    this._interactTimer = 0;  // countdown ms

    this.pal    = id === 'yohani' ? YOHANI_PAL : SANI_PAL;
    this._cfg   = CHAR_CFG[id];
    this._atlas = loadAtlas(id);
  }

  get center() { return { x: this.x + this.w / 2, y: this.y + this.h / 2 }; }

  activate()   { this.active = true;  this.glow = 1; }
  deactivate() { this.active = false; this.glow = 0; }

  // Call from game after a successful interact (repair/rescue)
  triggerInteract() {
    this._state = 'interact';
    this._interactTimer = this._cfg.interactTotal;
    this._animMs = 0;
  }

  _getAtlasCol() {
    const cfg = this._cfg;
    if (this._state === 'walk') {
      const period = 6 * cfg.walkDur;
      return 4 + Math.floor((this._animMs % period) / cfg.walkDur);
    }
    if (this._state === 'interact') {
      const period = 4 * cfg.interactDur;
      return 10 + Math.floor((this._animMs % period) / cfg.interactDur);
    }
    // idle
    const period = 4 * cfg.idleDur;
    return Math.floor((this._animMs % period) / cfg.idleDur);
  }

  update(dt, moveX, moveY, collide, onStep) {
    this.glow = Math.max(0, this.glow - dt * 2.5);

    // interact countdown
    if (this._interactTimer > 0) {
      this._interactTimer -= dt * 1000;
      if (this._interactTimer <= 0) { this._interactTimer = 0; }
    }

    if (!this.active) return;

    const moving = moveX !== 0 || moveY !== 0;

    if (Math.abs(moveX) > Math.abs(moveY)) {
      this.facing = moveX < 0 ? 'left' : 'right';
    } else if (moveY !== 0) {
      this.facing = moveY < 0 ? 'up' : 'down';
    }

    if (moving) {
      const oldX = this.x, oldY = this.y;
      this.x += moveX * this.speed * dt;
      if (collide(this)) this.x = oldX;
      this.y += moveY * this.speed * dt;
      if (collide(this)) this.y = oldY;

      const moved = this.x !== oldX || this.y !== oldY;
      if (moved) {
        this.walkAcc  += dt;
        this.stepTimer += dt;
        this.walkFrame  = Math.floor(this.walkAcc * 9) % 4;
        if (this.stepTimer >= STEP_SFX_INTERVAL) { this.stepTimer = 0; if (onStep) onStep(); }
      } else {
        this.walkFrame = 0; this.stepTimer = 0;
      }
      // animation state (don't override interact)
      if (this._interactTimer <= 0) this._state = moved ? 'walk' : 'idle';
    } else {
      this.walkFrame = 0; this.walkAcc = 0;
      if (this._interactTimer <= 0) this._state = 'idle';
    }

    this._animMs += dt * 1000;
  }

  draw(camera, p) {
    const sx = (this.x - camera.x) | 0;
    const sy = (this.y - camera.y) | 0;

    const atl = this._atlas;
    if (atl.loaded && atl.valid) {
      const cfg  = this._cfg;
      const col  = this._getAtlasCol();
      const row  = DIR_ROW[this.facing] ?? 0;
      const dx   = sx + cfg.offsetX;
      const dy   = sy + cfg.offsetY;

      // Glow halo
      if (this.active) {
        const cx = sx + 7, cy = sy + 7;
        const radius = 24;
        const gr = p.ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        gr.addColorStop(0, this.pal.glow + 'aa');
        gr.addColorStop(0.5, this.pal.glow + '22');
        gr.addColorStop(1, 'rgba(0,0,0,0)');
        p.ctx.fillStyle = gr;
        p.ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
        if (this.glow > 0) {
          p.ctx.globalAlpha = this.glow * 0.35;
          p.ctx.fillStyle = this.pal.glow;
          p.ctx.fillRect(dx, dy, cfg.frameW, cfg.frameH);
          p.ctx.globalAlpha = 1;
        }
      }

      // Shadow
      p.ctx.globalAlpha = 0.25;
      p.rect(sx + 1, sy + 13, 12, 2, '#000');
      p.ctx.globalAlpha = 1;

      // Sprite
      p.ctx.drawImage(atl.img,
        col * cfg.frameW, row * cfg.frameH, cfg.frameW, cfg.frameH,
        dx, dy, cfg.frameW, cfg.frameH,
      );

      // Active underline at collision bottom
      if (this.active) {
        p.hline(sx + 2, sy + 13, 10, this.pal.glow);
      }
    } else {
      // Procedural fallback
      drawSpriteFallback(p, sx, sy, this.pal, this.facing, this.walkFrame, this.active, this.glow);
    }
  }
}
