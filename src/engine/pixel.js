// 像素繪圖底層：所有美術都在載入時預先畫進離線 canvas，執行期只做 blit。

export function makeCanvas(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

/** 以整數像素為單位的畫筆，避免任何半像素造成的模糊。 */
export class Painter {
  constructor(ctx) {
    this.ctx = ctx;
  }

  px(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x | 0, y | 0, 1, 1);
  }

  rect(x, y, w, h, color) {
    if (w <= 0 || h <= 0) return;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
  }

  hline(x, y, len, color) {
    this.rect(x, y, len, 1, color);
  }

  vline(x, y, len, color) {
    this.rect(x, y, 1, len, color);
  }

  /** 斜線，用於鋼索與桁架。 */
  line(x0, y0, x1, y1, color) {
    let x = x0 | 0;
    let y = y0 | 0;
    const dx = Math.abs((x1 | 0) - x);
    const dy = -Math.abs((y1 | 0) - y);
    const sx = x < x1 ? 1 : -1;
    const sy = y < y1 ? 1 : -1;
    let err = dx + dy;
    for (let guard = 0; guard < 4096; guard += 1) {
      this.px(x, y, color);
      if (x === (x1 | 0) && y === (y1 | 0)) return;
      const e2 = err * 2;
      if (e2 >= dy) { err += dy; x += sx; }
      if (e2 <= dx) { err += dx; y += sy; }
    }
  }

  /** 空心矩形，像素風的框線。 */
  frame(x, y, w, h, color) {
    this.hline(x, y, w, color);
    this.hline(x, y + h - 1, w, color);
    this.vline(x, y, h, color);
    this.vline(x + w - 1, y, h, color);
  }

  /** 依 pixel map 繪製：每個字元對應一種顏色，'.' 代表透明。 */
  stamp(x, y, rows, palette) {
    for (let ry = 0; ry < rows.length; ry += 1) {
      const row = rows[ry];
      for (let rx = 0; rx < row.length; rx += 1) {
        const key = row[rx];
        if (key === '.' || key === ' ') continue;
        const color = palette[key];
        if (color) this.px(x + rx, y + ry, color);
      }
    }
  }
}

/** 產生一張可平鋪的柔和光暈貼圖，用來取代每幀重建 gradient。 */
export function makeGlow(radius, color, softness = 1) {
  const size = radius * 2;
  const { canvas, ctx } = makeCanvas(size, size);
  const gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(Math.min(0.85, 0.28 * softness), hexToRgba(color, 0.42));
  gradient.addColorStop(1, hexToRgba(color, 0));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}

export function hexToRgba(hex, alpha) {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value;
  const num = Number.parseInt(full, 16);
  return `rgba(${(num >> 16) & 255},${(num >> 8) & 255},${num & 255},${alpha})`;
}

export function mix(a, b, t) {
  const pa = Number.parseInt(a.slice(1), 16);
  const pb = Number.parseInt(b.slice(1), 16);
  const r = Math.round((((pa >> 16) & 255) * (1 - t)) + (((pb >> 16) & 255) * t));
  const g = Math.round((((pa >> 8) & 255) * (1 - t)) + (((pb >> 8) & 255) * t));
  const bl = Math.round(((pa & 255) * (1 - t)) + ((pb & 255) * t));
  return `#${((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1)}`;
}

/** 穩定亂數：同一座標永遠得到同一個值，讓場景細節不會逐幀跳動。 */
export function hash2(x, y, seed = 0) {
  let h = (x | 0) * 374761393 + (y | 0) * 668265263 + seed * 144665;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

export function createRng(seed) {
  let state = (seed | 0) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) / 4294967296);
  };
}
