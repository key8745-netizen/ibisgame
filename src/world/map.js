// 橋梁世界地圖。所有圖塊均以離線 canvas 預先繪製，主迴圈只做 blit + 相機裁切。
// 世界座標：X 向右，Y 向下，單位像素，圖塊 16×16。

import { Painter, hash2, makeCanvas } from '../engine/pixel.js';

export const TILE = 16;
export const MAP_COLS = 80;      // 世界寬度（圖塊）
export const MAP_ROWS = 36;      // 世界高度（圖塊）
export const WORLD_W = MAP_COLS * TILE;
export const WORLD_H = MAP_ROWS * TILE;

// ── 調色板 ──────────────────────────────────────────────────────────────────
export const C = {
  sky0: '#0a0f28',
  sky1: '#1c2c5a',
  sky2: '#2e4a7a',
  fog: '#4a6090',

  water0: '#080e22',
  water1: '#0d1a3c',
  water2: '#1a3060',
  waterHigh: '#2a507a',
  foam: '#3a6e9a',
  foam2: '#5a8aaa',
  reflection: '#1a2850',

  distant0: '#1a2240',
  distant1: '#243060',
  distWin: '#3a4880',
  distRoof: '#4a5890',

  pillar0: '#1a1e36',
  pillar1: '#252840',
  pillarEdge: '#3a3e60',
  pillarTop: '#4a4e6a',
  rust: '#5a3020',

  deck0: '#2a2e48',
  deck1: '#3a3e58',
  deck2: '#484c6a',
  deckEdge: '#5a5e7a',
  deckPlank: '#303450',
  deckCrack: '#1a1e34',

  cable: '#6a7090',
  cableHigh: '#8a90aa',
  steel: '#4a5068',
  steelHigh: '#6a7088',

  tunnel0: '#0e1020',
  tunnel1: '#181c30',
  tunnel2: '#242840',
  tunnelEdge: '#343860',
  tunnelPipe: '#1a3040',
  tunnelPipeHigh: '#2a5060',
  tunnelCrack: '#0a0e1c',

  dangerCrack: '#8a2030',
  warnOrange: '#cc6820',
  warnYellow: '#cca820',
  patchBlue: '#2a4a6a',
  patchEdge: '#3a6a8a',

  glow_cyan: '#40e0d0',
  glow_pink: '#e040a0',
  glow_gold: '#f0d040',
  lamp: '#ffe860',
  lampPost: '#303450',
  lampGlow: 'rgba(255,240,100,0.18)',

  text: '#f0ecdc',
  ink: '#080c18',
};

// ── 通行區域定義 ─────────────────────────────────────────────────────────────
// 橋上層：ty 11‥18，tx 4‥75
// 橋下層（地下通道）：ty 22‥28，tx 5‥74
// 水面＆遠景：其餘
const BRIDGE_TX0 = 4,  BRIDGE_TX1 = 75;
const UPPER_TY0 = 11,  UPPER_TY1 = 18;
const LOWER_TY0 = 22,  LOWER_TY1 = 28;

// 斷橋破損區域：尚未啟動時封鎖
export const BREACH = [
  // [ tx0, tx1, ty0, ty1, repairId ]
  [21, 26, 12, 17, 'support-west'],
  [42, 47, 12, 17, 'support-east'],
  // 地下
  [28, 33, 23, 27, 'seal-lower'],
  [38, 43, 14, 18, 'seal-upper'],
];

export function isWalkable(worldX, worldY, repaired) {
  const tx = Math.floor(worldX / TILE);
  const ty = Math.floor(worldY / TILE);

  // 世界邊界
  if (tx < 1 || tx >= MAP_COLS - 1 || ty < 2 || ty >= MAP_ROWS - 2) return false;

  const onUpper = tx >= BRIDGE_TX0 && tx <= BRIDGE_TX1 && ty >= UPPER_TY0 && ty <= UPPER_TY1;
  const onLower = tx >= BRIDGE_TX0 && tx <= BRIDGE_TX1 && ty >= LOWER_TY0 && ty <= LOWER_TY1;

  if (!onUpper && !onLower) return false;

  // 斷橋封鎖
  for (const [bx0, bx1, by0, by1, id] of BREACH) {
    if (!repaired.has(id) && tx >= bx0 && tx <= bx1 && ty >= by0 && ty <= by1) return false;
  }

  return true;
}

// ── 離線 Canvas 預烘焙 ──────────────────────────────────────────────────────

let _baked = null;

export function getBakedMap(repaired) {
  // 每次修復狀態改變都重新烘焙（修復節點最多 4 個，代價很低）
  const key = [...repaired].sort().join(',');
  if (_baked?.key === key) return _baked.canvas;
  const { canvas, ctx } = makeCanvas(WORLD_W, WORLD_H);
  const p = new Painter(ctx);
  bakeWorld(p, repaired);
  _baked = { key, canvas };
  return canvas;
}

function bakeWorld(p, repaired) {
  // 全圖以天空漸層填充（之後水面、橋梁蓋上去）
  const grad = p.ctx.createLinearGradient(0, 0, 0, WORLD_H);
  grad.addColorStop(0, C.sky0);
  grad.addColorStop(0.25, C.sky1);
  grad.addColorStop(0.55, C.sky2);
  grad.addColorStop(1, C.fog);
  p.ctx.fillStyle = grad;
  p.ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  drawStars(p);
  drawDistantSkyline(p);
  drawBridgeStructure(p, repaired);
  drawTunnelSection(p, repaired);
  drawWaterSurface(p);
  drawForegroundDetails(p, repaired);
  drawLamps(p);
}

// ── 星空 ──────────────────────────────────────────────────────────────────
function drawStars(p) {
  for (let i = 0; i < 240; i += 1) {
    const x = Math.floor(hash2(i, 0) * WORLD_W);
    const y = Math.floor(hash2(i, 1) * UPPER_TY0 * TILE);
    const bright = hash2(i, 2);
    const color = bright > 0.92 ? '#fff8d0' : bright > 0.78 ? '#c0d0e8' : '#606880';
    const size = bright > 0.94 ? 2 : 1;
    p.rect(x, y, size, size, color);
  }
}

// ── 遠景城市剪影 ────────────────────────────────────────────────────────────
function drawDistantSkyline(p) {
  const groundY = (UPPER_TY0 - 1) * TILE;
  for (let chunk = -1; chunk < Math.ceil(WORLD_W / 256) + 1; chunk += 1) {
    const base = chunk * 256;
    for (let i = 0; i < 8; i += 1) {
      const bx = base + Math.floor(hash2(chunk * 10 + i, 3) * 240);
      const bw = 16 + Math.floor(hash2(chunk * 10 + i, 4) * 28);
      const bh = 28 + Math.floor(hash2(chunk * 10 + i, 5) * 60);
      const by = groundY - bh;

      // 建築主體
      const dark = hash2(chunk * 10 + i, 6) > 0.5;
      p.rect(bx, by, bw, bh, dark ? C.distant0 : C.distant1);
      // 邊緣高光
      p.vline(bx + bw - 1, by, bh, C.distWin);
      // 屋頂線
      p.hline(bx, by, bw, C.distRoof);

      // 窗格
      for (let wy = by + 4; wy < by + bh - 4; wy += 6) {
        for (let wx = bx + 3; wx < bx + bw - 3; wx += 5) {
          const lit = hash2(wx, wy) > 0.52;
          if (lit) {
            p.rect(wx, wy, 2, 3, '#d0c890');
            p.rect(wx, wy, 2, 1, '#ffe8a0');
          }
        }
      }
      // 水塔
      if (hash2(chunk * 10 + i, 7) > 0.74) {
        const tx = bx + Math.floor(bw * 0.5) - 3;
        p.rect(tx, by - 10, 6, 10, C.distRoof);
        p.rect(tx - 2, by - 10, 10, 4, C.distant1);
      }
    }
  }
}

// ── 橋梁主體 ────────────────────────────────────────────────────────────────
function drawBridgeStructure(p, repaired) {
  const deckTop = UPPER_TY0 * TILE;
  const deckBot = UPPER_TY1 * TILE;
  const deckH = deckBot - deckTop;

  // 橋墩（每 16 格一根）
  for (let px = BRIDGE_TX0 * TILE; px <= BRIDGE_TX1 * TILE; px += 16 * TILE) {
    const pw = 10;
    const pillarX = px + TILE / 2 - pw / 2;
    const pillarTop = deckBot;
    const pillarBot = LOWER_TY1 * TILE + TILE;
    p.rect(pillarX, pillarTop, pw, pillarBot - pillarTop, C.pillar0);
    p.vline(pillarX, pillarTop, pillarBot - pillarTop, C.pillarEdge);
    p.vline(pillarX + pw - 1, pillarTop, pillarBot - pillarTop, C.pillarEdge);
    // 橋頂帽
    p.rect(pillarX - 2, pillarTop, pw + 4, 3, C.pillarTop);
    // 生銹漬
    for (let ry = pillarTop + 5; ry < pillarBot; ry += 7) {
      if (hash2(px, ry) > 0.78) p.rect(pillarX + 2, ry, 3, 2, C.rust);
    }
  }

  // 橋面主體
  p.rect(BRIDGE_TX0 * TILE, deckTop, (BRIDGE_TX1 - BRIDGE_TX0) * TILE, deckH, C.deck1);

  // 鋪面紋路（橫向木板條）
  for (let ty = deckTop + 4; ty < deckBot - 4; ty += 3) {
    p.hline(BRIDGE_TX0 * TILE, ty, (BRIDGE_TX1 - BRIDGE_TX0) * TILE, C.deckPlank);
  }

  // 橋面上緣 & 下緣護欄
  p.rect(BRIDGE_TX0 * TILE, deckTop, (BRIDGE_TX1 - BRIDGE_TX0) * TILE, 3, C.deckEdge);
  p.rect(BRIDGE_TX0 * TILE, deckBot - 3, (BRIDGE_TX1 - BRIDGE_TX0) * TILE, 3, C.deck0);

  // 護欄柱
  for (let gx = BRIDGE_TX0 * TILE; gx <= BRIDGE_TX1 * TILE; gx += 12) {
    p.rect(gx, deckTop - 6, 2, 8, C.steel);
    p.hline(gx - 6, deckTop - 5, 14, C.cable);
  }

  // 鋼索（二條拋物線）
  drawCables(p, deckTop);

  // 斷橋與修復區
  drawBreaches(p, repaired, deckTop, deckBot);
}

function drawCables(p, deckTop) {
  const tx0 = BRIDGE_TX0 * TILE;
  const tx1 = BRIDGE_TX1 * TILE;
  const midX = (tx0 + tx1) / 2;
  const topY = deckTop - 18;
  const sag = 40;
  // 兩條主纜
  for (let cable = 0; cable < 2; cable += 1) {
    const offsetY = cable * 6;
    let prevX = tx0;
    let prevY = topY + offsetY;
    for (let x = tx0 + 2; x <= tx1; x += 2) {
      const t = (x - tx0) / (tx1 - tx0);
      const y = topY + offsetY + sag * 4 * t * (1 - t);
      const color = cable === 0 ? C.cable : C.cableHigh;
      p.line(prevX, prevY, x, y, color);
      prevX = x; prevY = y;
    }
  }
  // 吊索（每 12px 一根）
  for (let x = tx0 + 12; x < tx1; x += 12) {
    const t = (x - tx0) / (tx1 - tx0);
    const cableY = topY + sag * 4 * t * (1 - t);
    const deckY = deckTop - 5;
    if (cableY < deckY) p.vline(x, cableY, deckY - cableY, C.steel);
  }
}

function drawBreaches(p, repaired, deckTop, deckBot) {
  for (const [bx0, bx1, by0, by1, id] of BREACH) {
    const worldX = bx0 * TILE;
    const worldW = (bx1 - bx0 + 1) * TILE;
    const worldY = by0 * TILE;
    const worldH = (by1 - by0 + 1) * TILE;

    if (repaired.has(id)) {
      // 修復後：覆蓋深色補丁
      p.rect(worldX, worldY, worldW, worldH, C.patchBlue);
      p.frame(worldX, worldY, worldW, worldH, C.patchEdge);
      for (let cy = worldY + 3; cy < worldY + worldH - 3; cy += 4) {
        p.hline(worldX + 3, cy, worldW - 6, C.deckPlank);
      }
    } else {
      // 未修復：顯示缺口
      p.rect(worldX, worldY, worldW, worldH, C.sky0);
      // 裂縫邊緣
      p.frame(worldX, worldY, worldW, worldH, C.dangerCrack);
      // 斷裂紋
      for (let i = 0; i < 5; i += 1) {
        const cx = worldX + 3 + Math.floor(hash2(bx0 * 10 + i, 8) * (worldW - 6));
        const cy0 = worldY + Math.floor(hash2(bx0 * 10 + i, 9) * worldH * 0.4);
        const cy1 = cy0 + 4 + Math.floor(hash2(bx0 * 10 + i, 10) * 10);
        p.vline(cx, cy0, cy1 - cy0, C.dangerCrack);
      }
      // 警示色鐵條碎片
      p.rect(worldX, worldY, 3, worldH, '#331010');
      p.rect(worldX + worldW - 3, worldY, 3, worldH, '#331010');
    }
  }
}

// ── 地下通道 ────────────────────────────────────────────────────────────────
function drawTunnelSection(p, repaired) {
  const ty0 = LOWER_TY0 * TILE;
  const ty1 = LOWER_TY1 * TILE;
  const tx0 = BRIDGE_TX0 * TILE;
  const tx1 = (BRIDGE_TX1 + 1) * TILE;
  const h = ty1 - ty0;

  // 地道主體
  p.rect(tx0, ty0, tx1 - tx0, h, C.tunnel1);

  // 天花板與地板
  p.rect(tx0, ty0, tx1 - tx0, 4, C.tunnel2);
  p.rect(tx0, ty1 - 4, tx1 - tx0, 4, C.tunnel0);

  // 壁面質感
  for (let ty = ty0 + 6; ty < ty1 - 4; ty += 9) {
    p.hline(tx0, ty, tx1 - tx0, C.tunnel2);
  }

  // 管道
  for (let px = tx0 + 28; px < tx1; px += 48) {
    p.rect(px, ty0 + 4, 6, 6, C.tunnelPipe);
    p.hline(px, ty0 + 4, 6, C.tunnelPipeHigh);
    p.hline(px, ty0 + 10, 6, C.tunnel0);
  }

  // 邊框
  p.rect(tx0, ty0, 4, h, C.tunnelEdge);
  p.rect(tx1 - 4, ty0, 4, h, C.tunnelEdge);

  // 通道裂縫（由斷橋決定）
  drawTunnelBreaches(p, repaired, ty0, ty1);
}

function drawTunnelBreaches(p, repaired, ty0, ty1) {
  for (const [bx0, bx1, by0, by1, id] of BREACH) {
    if (by0 < LOWER_TY0 || by0 > LOWER_TY1) continue;
    const worldX = bx0 * TILE;
    const worldW = (bx1 - bx0 + 1) * TILE;
    const worldY = by0 * TILE;
    const worldH = (by1 - by0 + 1) * TILE;

    if (repaired.has(id)) {
      p.rect(worldX, worldY, worldW, worldH, C.patchBlue);
      p.frame(worldX, worldY, worldW, worldH, C.patchEdge);
    } else {
      p.rect(worldX, worldY, worldW, worldH, C.tunnel0);
      p.frame(worldX, worldY, worldW, worldH, C.dangerCrack);
      // 大型警示標誌
      const cx = worldX + Math.floor(worldW / 2);
      const cy = worldY + Math.floor(worldH / 2);
      p.rect(cx - 5, cy - 5, 10, 10, C.warnOrange);
      p.rect(cx - 3, cy - 3, 6, 6, C.tunnel0);
      p.vline(cx, cy - 2, 5, C.warnOrange);
      p.rect(cx - 1, cy + 2, 3, 1, C.warnOrange);
    }
  }
}

// ── 水面 ────────────────────────────────────────────────────────────────────
function drawWaterSurface(p) {
  // 橋下水面區
  const waterTop = UPPER_TY1 * TILE;
  const waterBot = LOWER_TY0 * TILE;
  const tx0 = BRIDGE_TX0 * TILE;
  const tx1 = (BRIDGE_TX1 + 1) * TILE;

  p.rect(0, waterTop, WORLD_W, waterBot - waterTop, C.water0);
  p.rect(tx0, waterTop, tx1 - tx0, waterBot - waterTop, C.water1);

  // 波紋
  for (let wy = waterTop + 2; wy < waterBot; wy += 5) {
    for (let wx = tx0; wx < tx1; wx += 18) {
      const off = Math.floor(hash2(wx, wy) * 12);
      p.hline(wx + off, wy, 6, hash2(wx, wy + 1) > 0.5 ? C.foam : C.waterHigh);
    }
  }

  // 橋墩在水中的倒影
  for (let px = BRIDGE_TX0 * TILE; px <= BRIDGE_TX1 * TILE; px += 16 * TILE) {
    const pw = 10;
    const pillarX = px + TILE / 2 - pw / 2;
    for (let ry = waterTop + 2; ry < waterBot - 2; ry += 2) {
      const alpha = 0.35 - (ry - waterTop) / (waterBot - waterTop) * 0.25;
      p.ctx.globalAlpha = alpha;
      p.rect(pillarX, ry, pw, 1, C.pillar1);
    }
    p.ctx.globalAlpha = 1;
  }

  // 側邊水面（橋外）
  p.rect(0, waterTop, tx0, waterBot - waterTop, C.water0);
  p.rect(tx1, waterTop, WORLD_W - tx1, waterBot - waterTop, C.water0);
}

// ── 前景細節 ────────────────────────────────────────────────────────────────
function drawForegroundDetails(p, repaired) {
  // 橋頭入口
  const entryW = 12;
  const deckTop = UPPER_TY0 * TILE;
  const deckBot = UPPER_TY1 * TILE;

  for (const entryX of [BRIDGE_TX0 * TILE - entryW, BRIDGE_TX1 * TILE + 2]) {
    p.rect(entryX, deckTop - 10, entryW, deckBot - deckTop + 10, C.pillarTop);
    p.frame(entryX, deckTop - 10, entryW, deckBot - deckTop + 10, C.pillarEdge);
    p.rect(entryX + 2, deckTop - 4, entryW - 4, 6, C.sky0); // 拱門洞
  }

  // 地面端（橋外走道）
  const groundTop = LOWER_TY1 * TILE;
  p.rect(0, groundTop, WORLD_W, WORLD_H - groundTop, '#141828');
  p.rect(0, groundTop, WORLD_W, 3, '#202438');
  // 地面雜草
  for (let gx = 0; gx < WORLD_W; gx += 7) {
    if (hash2(gx, 99) > 0.6) {
      const gy = groundTop;
      p.vline(gx, gy - 3, 3, '#2a4830');
      if (hash2(gx, 100) > 0.5) p.px(gx - 1, gy - 4, '#2a4830');
    }
  }
}

// ── 路燈 ────────────────────────────────────────────────────────────────────
function drawLamps(p) {
  const deckTop = UPPER_TY0 * TILE;
  for (let lx = BRIDGE_TX0 * TILE + 32; lx < BRIDGE_TX1 * TILE; lx += 64) {
    // 燈柱
    p.rect(lx, deckTop - 14, 2, 14, C.lampPost);
    // 橫臂
    p.rect(lx, deckTop - 14, 8, 2, C.lampPost);
    // 燈罩
    p.rect(lx + 6, deckTop - 16, 6, 4, C.lamp);
    p.rect(lx + 7, deckTop - 15, 4, 2, '#ffffff');
    // 光暈（預先畫到 canvas，不須每幀重繪）
    const grdOuter = p.ctx.createRadialGradient(lx + 9, deckTop - 12, 0, lx + 9, deckTop - 12, 28);
    grdOuter.addColorStop(0, 'rgba(255,240,100,0.22)');
    grdOuter.addColorStop(0.5, 'rgba(255,240,100,0.07)');
    grdOuter.addColorStop(1, 'rgba(255,240,100,0)');
    p.ctx.fillStyle = grdOuter;
    p.ctx.beginPath();
    p.ctx.arc(lx + 9, deckTop - 12, 28, 0, Math.PI * 2);
    p.ctx.fill();
  }
}
