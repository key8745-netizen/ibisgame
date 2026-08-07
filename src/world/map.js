// 橋梁世界地圖。所有圖塊均以離線 canvas 預先繪製，主迴圈只做 blit + 相機裁切。
// 位置常數及破損定義由 c01-level.js 統一管理。

import { Painter, hash2, makeCanvas } from '../engine/pixel.js';
import {
  TILE, MAP_COLS, MAP_ROWS, WORLD_W, WORLD_H,
  WALKABLE, BREACH_DEFS, isWalkable,
} from '../c01-level.js';

// 重新匯出，供 game.js / hud.js 統一從 map.js 取用
export { TILE, MAP_COLS, MAP_ROWS, WORLD_W, WORLD_H, isWalkable };

// 輔助：各層圖塊邊界（從 WALKABLE 取用，保持唯一來源）
const { upper, tunnel, west: W_CONN, east: E_CONN } = WALKABLE;
const BRIDGE_TX0 = upper.tx0;
const BRIDGE_TX1 = upper.tx1;
const UPPER_TY0  = upper.ty0;
const UPPER_TY1  = upper.ty1;
const LOWER_TY0  = tunnel.ty0;
const LOWER_TY1  = tunnel.ty1;

// ── 調色板 ──────────────────────────────────────────────────────────────────
export const C = {
  sky0: '#0a0f28', sky1: '#1c2c5a', sky2: '#2e4a7a', fog: '#4a6090',

  water0: '#080e22', water1: '#0d1a3c', water2: '#1a3060',
  waterHigh: '#2a507a', foam: '#3a6e9a', foam2: '#5a8aaa', reflection: '#1a2850',

  distant0: '#1a2240', distant1: '#243060', distWin: '#3a4880', distRoof: '#4a5890',

  pillar0: '#1a1e36', pillar1: '#252840', pillarEdge: '#3a3e60', pillarTop: '#4a4e6a',
  rust: '#5a3020',

  deck0: '#2a2e48', deck1: '#3a3e58', deck2: '#484c6a', deckEdge: '#5a5e7a',
  deckPlank: '#303450', deckCrack: '#1a1e34',

  cable: '#6a7090', cableHigh: '#8a90aa', steel: '#4a5068', steelHigh: '#6a7088',

  // 地下通道：琥珀 / 鐵鏽 / 苔綠 配色（取代原藍灰系）
  tunnel0:       '#120c04',
  tunnel1:       '#1c1408',
  tunnel2:       '#2c1c0c',
  tunnelEdge:    '#5c2c14',
  tunnelPipe:    '#1c3014',
  tunnelPipeHigh:'#14503c',
  tunnelCrack:   '#0a0602',

  // 梯道連接區
  stair0: '#1e1828', stair1: '#2a2240', stairStep: '#3c3258',

  dangerCrack: '#8a2030', warnOrange: '#cc6820', warnYellow: '#cca820',
  patchBlue: '#2a4a6a', patchEdge: '#3a6a8a',

  glow_cyan: '#40e0d0', glow_pink: '#e040a0', glow_gold: '#f0d040',
  lamp: '#ffe860', lampPost: '#303450', lampGlow: 'rgba(255,240,100,0.18)',

  text: '#f0ecdc', ink: '#080c18',
};

// ── 離線 Canvas 預烘焙 ──────────────────────────────────────────────────────

let _baked = null;

export function getBakedMap(repaired) {
  const key = [...repaired].sort().join(',');
  if (_baked?.key === key) return _baked.canvas;
  const { canvas, ctx } = makeCanvas(WORLD_W, WORLD_H);
  const p = new Painter(ctx);
  bakeWorld(p, repaired);
  _baked = { key, canvas };
  return canvas;
}

function bakeWorld(p, repaired) {
  const grad = p.ctx.createLinearGradient(0, 0, 0, WORLD_H);
  grad.addColorStop(0,    C.sky0);
  grad.addColorStop(0.25, C.sky1);
  grad.addColorStop(0.55, C.sky2);
  grad.addColorStop(1,    C.fog);
  p.ctx.fillStyle = grad;
  p.ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  drawStars(p);
  drawDistantSkyline(p);
  drawBridgeStructure(p, repaired);
  drawStairwayConnectors(p);
  drawTunnelSection(p, repaired);
  drawWaterSurface(p);
  drawForegroundDetails(p);
  drawLamps(p);
}

// ── 星空 ──────────────────────────────────────────────────────────────────
function drawStars(p) {
  for (let i = 0; i < 240; i += 1) {
    const x      = Math.floor(hash2(i, 0) * WORLD_W);
    const y      = Math.floor(hash2(i, 1) * UPPER_TY0 * TILE);
    const bright = hash2(i, 2);
    const color  = bright > 0.92 ? '#fff8d0' : bright > 0.78 ? '#c0d0e8' : '#606880';
    const size   = bright > 0.94 ? 2 : 1;
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
      const dark = hash2(chunk * 10 + i, 6) > 0.5;
      p.rect(bx, by, bw, bh, dark ? C.distant0 : C.distant1);
      p.vline(bx + bw - 1, by, bh, C.distWin);
      p.hline(bx, by, bw, C.distRoof);
      for (let wy = by + 4; wy < by + bh - 4; wy += 6) {
        for (let wx = bx + 3; wx < bx + bw - 3; wx += 5) {
          if (hash2(wx, wy) > 0.52) {
            p.rect(wx, wy, 2, 3, '#d0c890');
            p.rect(wx, wy, 2, 1, '#ffe8a0');
          }
        }
      }
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
  const deckH   = deckBot - deckTop;

  // 橋墩（每 16 格一根）
  for (let px = BRIDGE_TX0 * TILE; px <= BRIDGE_TX1 * TILE; px += 16 * TILE) {
    const pw       = 10;
    const pillarX  = px + TILE / 2 - pw / 2;
    const pillarTop = deckBot;
    const pillarBot = LOWER_TY1 * TILE + TILE;
    p.rect(pillarX, pillarTop, pw, pillarBot - pillarTop, C.pillar0);
    p.vline(pillarX,          pillarTop, pillarBot - pillarTop, C.pillarEdge);
    p.vline(pillarX + pw - 1, pillarTop, pillarBot - pillarTop, C.pillarEdge);
    p.rect(pillarX - 2, pillarTop, pw + 4, 3, C.pillarTop);
    for (let ry = pillarTop + 5; ry < pillarBot; ry += 7) {
      if (hash2(px, ry) > 0.78) p.rect(pillarX + 2, ry, 3, 2, C.rust);
    }
  }

  p.rect(BRIDGE_TX0 * TILE, deckTop, (BRIDGE_TX1 - BRIDGE_TX0) * TILE, deckH, C.deck1);
  for (let ty = deckTop + 4; ty < deckBot - 4; ty += 3) {
    p.hline(BRIDGE_TX0 * TILE, ty, (BRIDGE_TX1 - BRIDGE_TX0) * TILE, C.deckPlank);
  }
  p.rect(BRIDGE_TX0 * TILE, deckTop,      (BRIDGE_TX1 - BRIDGE_TX0) * TILE, 3, C.deckEdge);
  p.rect(BRIDGE_TX0 * TILE, deckBot - 3,  (BRIDGE_TX1 - BRIDGE_TX0) * TILE, 3, C.deck0);

  for (let gx = BRIDGE_TX0 * TILE; gx <= BRIDGE_TX1 * TILE; gx += 12) {
    p.rect(gx, deckTop - 6, 2, 8, C.steel);
    p.hline(gx - 6, deckTop - 5, 14, C.cable);
  }

  drawCables(p, deckTop);
  drawBridgeBreaches(p, repaired, deckTop, deckBot);
}

function drawCables(p, deckTop) {
  const tx0  = BRIDGE_TX0 * TILE;
  const tx1  = BRIDGE_TX1 * TILE;
  const topY = deckTop - 18;
  const sag  = 40;
  for (let cable = 0; cable < 2; cable += 1) {
    const offsetY = cable * 6;
    let prevX = tx0;
    let prevY = topY + offsetY;
    for (let x = tx0 + 2; x <= tx1; x += 2) {
      const t = (x - tx0) / (tx1 - tx0);
      const y = topY + offsetY + sag * 4 * t * (1 - t);
      p.line(prevX, prevY, x, y, cable === 0 ? C.cable : C.cableHigh);
      prevX = x; prevY = y;
    }
  }
  for (let x = tx0 + 12; x < tx1; x += 12) {
    const t      = (x - tx0) / (tx1 - tx0);
    const cableY = topY + sag * 4 * t * (1 - t);
    const deckY  = deckTop - 5;
    if (cableY < deckY) p.vline(x, cableY, deckY - cableY, C.steel);
  }
}

function drawBridgeBreaches(p, repaired, deckTop, deckBot) {
  for (const { id, tx0: bx0, tx1: bx1, ty0: by0, ty1: by1 } of BREACH_DEFS) {
    if (by0 >= LOWER_TY0) continue; // 只畫橋面破損
    const worldX = bx0 * TILE;
    const worldW = (bx1 - bx0 + 1) * TILE;
    const worldY = by0 * TILE;
    const worldH = (by1 - by0 + 1) * TILE;
    if (repaired.has(id)) {
      p.rect(worldX, worldY, worldW, worldH, C.patchBlue);
      p.frame(worldX, worldY, worldW, worldH, C.patchEdge);
      for (let cy = worldY + 3; cy < worldY + worldH - 3; cy += 4) {
        p.hline(worldX + 3, cy, worldW - 6, C.deckPlank);
      }
    } else {
      p.rect(worldX, worldY, worldW, worldH, C.sky0);
      p.frame(worldX, worldY, worldW, worldH, C.dangerCrack);
      for (let i = 0; i < 5; i += 1) {
        const cx  = worldX + 3 + Math.floor(hash2(bx0 * 10 + i, 8) * (worldW - 6));
        const cy0 = worldY + Math.floor(hash2(bx0 * 10 + i, 9) * worldH * 0.4);
        const cy1 = cy0 + 4 + Math.floor(hash2(bx0 * 10 + i, 10) * 10);
        p.vline(cx, cy0, cy1 - cy0, C.dangerCrack);
      }
      p.rect(worldX, worldY, 3, worldH, '#331010');
      p.rect(worldX + worldW - 3, worldY, 3, worldH, '#331010');
    }
  }
}

// ── 西東梯道連接區 ────────────────────────────────────────────────────────────
function drawStairwayConnectors(p) {
  const gapTop = UPPER_TY1 * TILE;  // 橋面底邊
  const gapBot = LOWER_TY0 * TILE;  // 地道頂邊
  const gapH   = gapBot - gapTop;

  for (const zone of [W_CONN, E_CONN]) {
    const zx = zone.tx0 * TILE;
    const zw = (zone.tx1 - zone.tx0 + 1) * TILE;
    const zy = zone.ty0 * TILE;
    const zh = (zone.ty1 - zone.ty0 + 1) * TILE;

    // 連接梯道主體
    p.rect(zx, zy, zw, zh, C.stair0);
    // 兩側邊框
    p.vline(zx,          zy, zh, C.stair1);
    p.vline(zx + zw - 1, zy, zh, C.stair1);

    // 階梯紋路（水域間隙區段）
    const steps = 7;
    const stepH = gapH / steps;
    for (let s = 0; s < steps; s += 1) {
      const sy     = (gapTop + s * stepH) | 0;
      const indent = (s % 2) * 4;
      p.rect(zx + 2 + indent, sy, zw - 4 - indent, 2, C.stairStep);
      p.rect(zx + 2 + indent, sy + 2, zw - 4 - indent, (stepH - 2) | 0, C.stair0);
    }

    // 上下銜接口（與橋面/地道齊平）
    p.rect(zx, gapTop - 3, zw, 3, C.stair1);
    p.rect(zx, gapBot,     zw, 3, C.stair1);
  }
}

// ── 地下通道 ────────────────────────────────────────────────────────────────
function drawTunnelSection(p, repaired) {
  const ty0 = LOWER_TY0 * TILE;
  const ty1 = (LOWER_TY1 + 1) * TILE;
  const tx0 = BRIDGE_TX0 * TILE;
  const tx1 = (BRIDGE_TX1 + 1) * TILE;
  const h   = ty1 - ty0;

  // 主體（琥珀底）
  p.rect(tx0, ty0, tx1 - tx0, h, C.tunnel1);
  // 天花板
  p.rect(tx0, ty0, tx1 - tx0, 4, C.tunnel2);
  // 地板
  p.rect(tx0, ty1 - 4, tx1 - tx0, 4, C.tunnel0);

  // 壁面橫紋
  for (let ty = ty0 + 6; ty < ty1 - 4; ty += 9) {
    p.hline(tx0, ty, tx1 - tx0, C.tunnel2);
  }

  // 管道（鐵鏽紅框＋苔綠高光）
  for (let px = tx0 + 28; px < tx1; px += 48) {
    p.rect(px, ty0 + 4, 6, 6, C.tunnelPipe);
    p.hline(px, ty0 + 4, 6, C.tunnelPipeHigh);
    p.hline(px, ty0 + 10, 6, C.tunnel0);
  }

  // 側邊框
  p.rect(tx0, ty0, 4, h, C.tunnelEdge);
  p.rect(tx1 - 4, ty0, 4, h, C.tunnelEdge);

  // 地道破損
  drawTunnelBreaches(p, repaired);
}

function drawTunnelBreaches(p, repaired) {
  for (const { id, tx0: bx0, tx1: bx1, ty0: by0, ty1: by1 } of BREACH_DEFS) {
    if (by0 < LOWER_TY0) continue; // 只畫地道破損
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
  const waterTop = UPPER_TY1 * TILE;
  const waterBot = LOWER_TY0 * TILE;
  const tx0 = BRIDGE_TX0 * TILE;
  const tx1 = (BRIDGE_TX1 + 1) * TILE;

  p.rect(0, waterTop, WORLD_W, waterBot - waterTop, C.water0);
  p.rect(tx0, waterTop, tx1 - tx0, waterBot - waterTop, C.water1);

  for (let wy = waterTop + 2; wy < waterBot; wy += 5) {
    for (let wx = tx0; wx < tx1; wx += 18) {
      const off = Math.floor(hash2(wx, wy) * 12);
      p.hline(wx + off, wy, 6, hash2(wx, wy + 1) > 0.5 ? C.foam : C.waterHigh);
    }
  }

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

  p.rect(0, waterTop, tx0, waterBot - waterTop, C.water0);
  p.rect(tx1, waterTop, WORLD_W - tx1, waterBot - waterTop, C.water0);
}

// ── 前景細節 ────────────────────────────────────────────────────────────────
function drawForegroundDetails(p) {
  const entryW  = 12;
  const deckTop = UPPER_TY0 * TILE;
  const deckBot = UPPER_TY1 * TILE;

  for (const entryX of [BRIDGE_TX0 * TILE - entryW, BRIDGE_TX1 * TILE + 2]) {
    p.rect(entryX, deckTop - 10, entryW, deckBot - deckTop + 10, C.pillarTop);
    p.frame(entryX, deckTop - 10, entryW, deckBot - deckTop + 10, C.pillarEdge);
    p.rect(entryX + 2, deckTop - 4, entryW - 4, 6, C.sky0);
  }

  const groundTop = LOWER_TY1 * TILE;
  p.rect(0, groundTop, WORLD_W, WORLD_H - groundTop, '#141828');
  p.rect(0, groundTop, WORLD_W, 3, '#202438');
  for (let gx = 0; gx < WORLD_W; gx += 7) {
    if (hash2(gx, 99) > 0.6) {
      p.vline(gx, groundTop - 3, 3, '#2a4830');
      if (hash2(gx, 100) > 0.5) p.px(gx - 1, groundTop - 4, '#2a4830');
    }
  }
}

// ── 路燈 ────────────────────────────────────────────────────────────────────
function drawLamps(p) {
  const deckTop = UPPER_TY0 * TILE;
  for (let lx = BRIDGE_TX0 * TILE + 32; lx < BRIDGE_TX1 * TILE; lx += 64) {
    p.rect(lx, deckTop - 14, 2, 14, C.lampPost);
    p.rect(lx, deckTop - 14, 8, 2, C.lampPost);
    p.rect(lx + 6, deckTop - 16, 6, 4, C.lamp);
    p.rect(lx + 7, deckTop - 15, 4, 2, '#ffffff');
    const grd = p.ctx.createRadialGradient(lx + 9, deckTop - 12, 0, lx + 9, deckTop - 12, 28);
    grd.addColorStop(0, 'rgba(255,240,100,0.22)');
    grd.addColorStop(0.5, 'rgba(255,240,100,0.07)');
    grd.addColorStop(1, 'rgba(255,240,100,0)');
    p.ctx.fillStyle = grd;
    p.ctx.beginPath();
    p.ctx.arc(lx + 9, deckTop - 12, 28, 0, Math.PI * 2);
    p.ctx.fill();
  }
}
