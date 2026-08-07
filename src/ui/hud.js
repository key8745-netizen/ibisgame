// HUD、對話框、標題畫面等所有覆蓋在 Canvas 上的 UI 元件。

import { C, TILE } from '../world/map.js';

const FONT_SM    = '7px monospace';
const FONT_MD    = '8px monospace';
const FONT_LG    = 'bold 9px monospace';
const FONT_XL    = 'bold 14px monospace';
const FONT_TITLE = 'bold 22px monospace';

// ── 通用繪圖工具 ──────────────────────────────────────────────────────────────
function panel(ctx, x, y, w, h, bg = '#0e1428', border = '#545a80') {
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(x + 2, y + 3, w, h);
  ctx.fillStyle = border;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = bg;
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fillRect(x + 3, y + 3, w - 6, 1);
}

function wrapText(ctx, text, x, y, maxW, lineH, color = C.text) {
  ctx.font = FONT_MD;
  ctx.fillStyle = color;
  let line = '';
  let currentY = y;
  for (const ch of text) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxW && line.length) {
      ctx.fillText(line, x, currentY);
      line = ch;
      currentY += lineH;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, currentY);
}

function portrait(ctx, x, y, id) {
  ctx.fillStyle = '#181e38';
  ctx.fillRect(x, y, 30, 30);
  ctx.fillStyle = id === 'yohani' ? C.glow_cyan : id === 'shani' ? C.glow_pink : '#a0a0b0';
  ctx.fillRect(x,      y,      30, 2);
  ctx.fillRect(x,      y,      2,  30);
  ctx.fillRect(x + 28, y,      2,  30);
  ctx.fillRect(x,      y + 28, 30, 2);

  if (id === 'yohani') {
    ctx.fillStyle = '#3c3040'; ctx.fillRect(x + 7, y + 4,  16, 8);
    ctx.fillStyle = '#d4a078'; ctx.fillRect(x + 8, y + 8,  14, 11);
    ctx.fillStyle = '#4a6898'; ctx.fillRect(x + 6, y + 18, 18, 9);
    ctx.fillStyle = '#101828'; ctx.fillRect(x + 11, y + 13, 2, 2); ctx.fillRect(x + 17, y + 13, 2, 2);
    ctx.fillStyle = '#6a88b8'; ctx.fillRect(x + 8, y + 18, 14, 2);
  } else if (id === 'shani') {
    ctx.fillStyle = '#2c1c38'; ctx.fillRect(x + 6, y + 3,  18, 10);
    ctx.fillStyle = '#c88a68'; ctx.fillRect(x + 8, y + 9,  14, 10);
    ctx.fillStyle = '#8c4870'; ctx.fillRect(x + 6, y + 18, 18, 9);
    ctx.fillStyle = '#180820'; ctx.fillRect(x + 11, y + 13, 2, 2); ctx.fillRect(x + 17, y + 13, 2, 2);
    ctx.fillStyle = '#b06890'; ctx.fillRect(x + 8, y + 18, 14, 2);
  } else {
    ctx.fillStyle = C.glow_gold;
    ctx.fillRect(x + 12, y + 5,  6, 20);
    ctx.fillRect(x + 5,  y + 12, 20, 6);
  }
}

// 微型人物圖示（5×9 像素）
function drawPersonIcon(ctx, x, y, color, filled) {
  ctx.fillStyle = filled ? color : '#303050';
  // 頭
  ctx.fillRect(x + 1, y,     3, 3);
  // 身體
  ctx.fillRect(x,     y + 3, 5, 4);
  // 腳
  ctx.fillRect(x,     y + 7, 2, 2);
  ctx.fillRect(x + 3, y + 7, 2, 2);
  if (filled) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 2, y + 1, 1, 1); // 高光
  }
}

// ── 對話框 ────────────────────────────────────────────────────────────────────
export class DialogueBox {
  constructor() {
    this.queue    = [];
    this.current  = null;
    this.chars    = 0;
    this.timer    = 0;
    this.SPEED    = 34; // 字/秒
  }

  say(speaker, text, portraitId = 'system') {
    this.queue.push({ speaker, text, portraitId });
    if (!this.current) this._next();
  }

  _next() {
    this.current = this.queue.shift() ?? null;
    this.chars   = 0;
    this.timer   = 0;
  }

  get isOpen() { return this.current !== null; }

  update(dt, spacePressed) {
    if (!this.current) return;
    this.timer += dt;
    this.chars  = Math.min(this.current.text.length, Math.floor(this.timer * this.SPEED));
    const done  = this.chars >= this.current.text.length;
    if (spacePressed) {
      if (!done) {
        this.chars = this.current.text.length;
        this.timer = this.current.text.length / this.SPEED;
      } else {
        this._next();
      }
    }
  }

  draw(ctx, viewW, viewH) {
    if (!this.current) return;
    const x = 14, y = viewH - 72, w = viewW - 28, h = 58;
    panel(ctx, x, y, w, h, '#0a0f28', '#6068a0');
    portrait(ctx, x + 7, y + 7, this.current.portraitId);

    ctx.fillStyle = this.current.portraitId === 'yohani' ? C.glow_cyan
                  : this.current.portraitId === 'shani'  ? C.glow_pink
                  : C.glow_gold;
    ctx.font = 'bold 8px monospace';
    ctx.fillText(this.current.speaker, x + 44, y + 16);

    wrapText(ctx, this.current.text.slice(0, this.chars), x + 44, y + 28, w - 54, 10, C.text);

    if (this.chars >= this.current.text.length) {
      const blink = Math.floor(performance.now() / 350) % 2;
      ctx.fillStyle = C.glow_gold;
      ctx.fillRect(x + w - 14, y + h - 10 + blink, 4, 3);
    }
  }
}

// ── 角色 HUD（左上）────────────────────────────────────────────────────────
export function drawCharHUD(ctx, player, viewW) {
  const x = 6, y = 6, w = 132, h = 40;
  const color = player.id === 'yohani' ? C.glow_cyan : C.glow_pink;
  panel(ctx, x, y, w, h, '#0a0f24', color);
  portrait(ctx, x + 6, y + 5, player.id);

  ctx.fillStyle = color;
  ctx.font = 'bold 8px monospace';
  ctx.fillText(player.id === 'yohani' ? '長子 尤哈尼' : '長女 珊妮', x + 42, y + 14);

  ctx.fillStyle = '#8898b0';
  ctx.font = FONT_SM;
  ctx.fillText(player.id === 'yohani' ? '正式救援・橋梁支撐' : '地下道路・例外縫隙', x + 42, y + 26);

  // 按鍵提示
  ctx.fillStyle = '#505870';
  ctx.fillText('[X 換角色]', x + 42, y + 36);

  ctx.fillStyle = color;
  ctx.fillRect(x + w - 9, y + 15, 4, 4);
}

// ── 任務追蹤 HUD（右上）——圖示化 ─────────────────────────────────────────────
export function drawMissionHUD(ctx, nodes, rescuees, objective, viewW) {
  const w = 148, x = viewW - w - 6, y = 6, h = 40;
  panel(ctx, x, y, w, h, '#0a0f24', '#505878');

  ctx.fillStyle = C.glow_gold;
  ctx.font = 'bold 7px monospace';
  ctx.fillText('任務', x + 8, y + 13);

  // 4 個修復節點圖示燈
  const dotSize = 7;
  const dotPad  = 3;
  let dotX = x + 8;
  const dotY = y + 19;
  for (const node of nodes) {
    const color = node.required === 'yohani' ? C.glow_cyan : C.glow_pink;
    if (node.done) {
      ctx.fillStyle = color;
      ctx.fillRect(dotX, dotY, dotSize, dotSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(dotX + 1, dotY + 1, 2, 2);
    } else {
      ctx.fillStyle = '#202438';
      ctx.fillRect(dotX, dotY, dotSize, dotSize);
      ctx.fillStyle = color;
      ctx.fillRect(dotX, dotY, dotSize, 1);
      ctx.fillRect(dotX, dotY + dotSize - 1, dotSize, 1);
      ctx.fillRect(dotX, dotY, 1, dotSize);
      ctx.fillRect(dotX + dotSize - 1, dotY, 1, dotSize);
    }
    dotX += dotSize + dotPad;
  }

  // 分隔
  ctx.fillStyle = '#303450';
  ctx.fillRect(dotX + 1, y + 18, 1, 10);
  dotX += 5;

  // 3 個受困者人物圖示
  for (const r of rescuees) {
    const color = r.requirement === 'yohani' ? C.glow_cyan
                : r.requirement === 'shani'  ? C.glow_pink
                : C.glow_gold;
    drawPersonIcon(ctx, dotX, dotY - 1, color, r.rescued);
    dotX += 8 + dotPad;
  }

  // 進度條
  const barW     = w - 16;
  const allNodes = nodes.length;
  const doneNodes  = nodes.filter((n) => n.done).length;
  const allRescued = rescuees.length;
  const doneRescued = rescuees.filter((r) => r.rescued).length;
  const progress = objective < 2
    ? doneNodes / allNodes
    : doneRescued / allRescued;
  ctx.fillStyle = '#202438';
  ctx.fillRect(x + 8, y + 33, barW, 3);
  ctx.fillStyle = progress >= 1 ? '#60e090' : C.glow_gold;
  ctx.fillRect(x + 8, y + 33, Math.round(barW * progress), 3);
}

// ── 附近互動提示（畫面底部中央）──────────────────────────────────────────────
export function drawPrompt(ctx, label, viewW, viewH) {
  ctx.font = 'bold 7px monospace';
  const tw = ctx.measureText(label).width;
  const w  = tw + 46;
  const x  = ((viewW - w) / 2) | 0;
  const y  = viewH - 22;
  panel(ctx, x, y, w, 16, '#0a0f24', C.glow_gold);
  ctx.fillStyle = C.glow_gold;
  ctx.font = 'bold 8px monospace';
  ctx.fillText('Z', x + 7, y + 11);
  ctx.fillStyle = C.text;
  ctx.fillText(label, x + 22, y + 11);
}

// ── 錯誤角色小提示（不開對話框，直接在畫面上閃現）──────────────────────────
export function drawWrongCharHint(ctx, text, color, viewW, viewH) {
  ctx.font = 'bold 8px monospace';
  const tw = ctx.measureText(text).width;
  const w  = tw + 24;
  const x  = ((viewW - w) / 2) | 0;
  const y  = 50;
  const bg = color === C.glow_cyan ? '#060f14' : '#140610';
  panel(ctx, x, y, w, 16, bg, color);
  ctx.fillStyle = color;
  ctx.fillText(text, x + 12, y + 11);
}

// ── 離屏方向箭頭（指引最近目標）─────────────────────────────────────────────
export function drawOffscreenArrows(ctx, targets, camera, viewW, viewH) {
  const edgePad = 14;
  const halfW   = (viewW - edgePad * 2) / 2;
  const halfH   = (viewH - edgePad * 2) / 2;
  const cx      = viewW / 2;
  const cy      = viewH / 2;

  for (const { worldX, worldY, color } of targets) {
    const sx = worldX - camera.x;
    const sy = worldY - camera.y;

    // 目標已在畫面內，跳過
    if (sx >= edgePad && sx <= viewW - edgePad && sy >= edgePad && sy <= viewH - edgePad) continue;

    const dx = sx - cx;
    const dy = sy - cy;
    if (dx === 0 && dy === 0) continue;

    // 找螢幕邊緣交點
    let ax, ay;
    if (Math.abs(dx) * halfH > Math.abs(dy) * halfW) {
      // 左或右邊緣
      const sign = dx > 0 ? 1 : -1;
      ax = cx + sign * halfW;
      ay = cy + dy / Math.abs(dx) * halfW;
    } else {
      // 上或下邊緣
      const sign = dy > 0 ? 1 : -1;
      ay = cy + sign * halfH;
      ax = cx + dx / Math.abs(dy) * halfH;
    }
    ax = Math.max(edgePad, Math.min(viewW - edgePad, ax));
    ay = Math.max(edgePad, Math.min(viewH - edgePad, ay));

    const angle = Math.atan2(dy, dx);
    ctx.save();
    ctx.translate(ax | 0, ay | 0);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.78;
    ctx.beginPath();
    ctx.moveTo(7, 0);
    ctx.lineTo(-5, -5);
    ctx.lineTo(-5, 5);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

// ── 標題畫面 ─────────────────────────────────────────────────────────────────
export function drawTitle(ctx, time, viewW, viewH) {
  ctx.fillStyle = 'rgba(5,8,18,0.72)';
  ctx.fillRect(0, 0, viewW, viewH);

  for (let i = 0; i < 60; i += 1) {
    const h2x   = ((i * 2741) & 0xffff) / 65535;
    const h2y   = ((i * 5381) & 0xffff) / 65535;
    const blink = (Math.floor(time * 2.8 + i * 0.37)) % 5 === 0;
    ctx.fillStyle = blink ? '#fff8b0' : '#7080a0';
    ctx.fillRect((h2x * viewW) | 0, (h2y * 160) | 0, blink ? 2 : 1, blink ? 2 : 1);
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = C.glow_gold;
  ctx.font = 'bold 9px monospace';
  ctx.fillText('IBI PRODUCTIONS', viewW / 2, 50);

  ctx.fillStyle = C.text;
  ctx.font = FONT_TITLE;
  ctx.fillText('未完成的星路', viewW / 2, 82);

  ctx.fillStyle = C.glow_cyan;
  ctx.font = FONT_LG;
  ctx.fillText('— C01 · 轉運橋救援 —', viewW / 2, 100);

  panel(ctx, (viewW - 240) / 2, 114, 240, 54, '#08101e', '#4a5280');
  ctx.fillStyle = C.text;
  ctx.font = FONT_MD;
  ctx.fillText('切換兄妹，讓正式與地下兩條路重新接上', viewW / 2, 132);
  ctx.fillText('拯救受困在橋上的三名居民', viewW / 2, 146);
  const pulse = Math.floor(time * 2.2) % 2;
  ctx.fillStyle = pulse ? C.glow_gold : '#d8c060';
  ctx.font = FONT_LG;
  ctx.fillText('按  空白鍵  開始', viewW / 2, 168);

  ctx.fillStyle = '#6070a0';
  ctx.font = FONT_SM;
  ctx.fillText('方向鍵移動・Z行動・X切換角色・Esc暫停', viewW / 2, 222);
  ctx.fillText('純瀏覽器・無需安裝', viewW / 2, 233);
  ctx.textAlign = 'left';
}

// ── 暫停畫面 ─────────────────────────────────────────────────────────────────
export function drawPause(ctx, viewW, viewH) {
  ctx.fillStyle = 'rgba(3,5,14,0.78)';
  ctx.fillRect(0, 0, viewW, viewH);
  panel(ctx, (viewW - 200) / 2, (viewH - 100) / 2, 200, 100, '#08101e', '#6068a0');
  ctx.textAlign = 'center';
  ctx.fillStyle = C.glow_gold;
  ctx.font = FONT_XL;
  ctx.fillText('暫停', viewW / 2, viewH / 2 - 22);
  ctx.fillStyle = C.text;
  ctx.font = FONT_MD;
  ctx.fillText('Esc  繼續', viewW / 2, viewH / 2 + 4);
  ctx.fillText('X    重新開始', viewW / 2, viewH / 2 + 18);
  ctx.textAlign = 'left';
}

// ── 結局畫面 ─────────────────────────────────────────────────────────────────
export function drawWin(ctx, time, viewW, viewH) {
  ctx.fillStyle = 'rgba(3,5,14,0.84)';
  ctx.fillRect(0, 0, viewW, viewH);
  panel(ctx, (viewW - 340) / 2, (viewH - 170) / 2, 340, 170, '#08101e', C.glow_gold);
  ctx.textAlign = 'center';
  ctx.fillStyle = C.glow_gold;
  ctx.font = FONT_XL;
  ctx.fillText('救援完成', viewW / 2, viewH / 2 - 55);

  ctx.fillStyle = C.text;
  ctx.font = FONT_MD;
  ctx.fillText('正式道路與地下道路第一次重新接上。', viewW / 2, viewH / 2 - 28);
  ctx.fillText('兄妹沒有和解，但決定交換證據，',       viewW / 2, viewH / 2 - 14);
  ctx.fillText('共同調查讓橋崩解的真正原因。',           viewW / 2, viewH / 2);

  ctx.fillStyle = C.glow_cyan;
  ctx.font = FONT_LG;
  ctx.fillText('C01 第一個可玩段落完成', viewW / 2, viewH / 2 + 24);

  const pulse = Math.floor(time * 2) % 2;
  ctx.fillStyle = pulse ? C.glow_gold : C.text;
  ctx.font = FONT_MD;
  ctx.fillText('按  空白鍵  重新遊玩', viewW / 2, viewH / 2 + 50);
  ctx.textAlign = 'left';
}
