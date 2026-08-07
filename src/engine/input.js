// 輸入層。按鍵事件在固定步長迴圈裡被消費，避免在高更新率螢幕上遺失輸入。
// 觸控：Map<pointerId, key> 追蹤每根手指對應的按鍵，防止多指互相干擾。

const ALIAS = new Map([
  ['KeyW', 'ArrowUp'], ['KeyA', 'ArrowLeft'], ['KeyS', 'ArrowDown'], ['KeyD', 'ArrowRight'],
  ['KeyZ', 'Space'], ['Enter', 'Space'], ['NumpadEnter', 'Space'],
  ['ShiftLeft', 'KeyX'], ['ShiftRight', 'KeyX'],
  ['KeyP', 'Escape'],
]);

const CAPTURED = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyX', 'Escape']);

export const normalize = (code) => ALIAS.get(code) ?? code;

class Input {
  constructor() {
    this.held    = new Set();
    this.pressed = new Set();
    this.anyInputSeen = false;
  }

  set(code, down) {
    const key = normalize(code);
    if (down) {
      if (!this.held.has(key)) this.pressed.add(key);
      this.held.add(key);
      this.anyInputSeen = true;
    } else {
      this.held.delete(key);
    }
  }

  isDown(key) { return this.held.has(key); }

  endStep() { if (this.pressed.size) this.pressed.clear(); }

  clearAll() {
    this.held.clear();
    this.pressed.clear();
  }

  axis() {
    let x = 0, y = 0;
    if (this.held.has('ArrowLeft'))  x -= 1;
    if (this.held.has('ArrowRight')) x += 1;
    if (this.held.has('ArrowUp'))    y -= 1;
    if (this.held.has('ArrowDown'))  y += 1;
    if (x && y) { x *= Math.SQRT1_2; y *= Math.SQRT1_2; }
    return { x, y };
  }
}

export const input = new Input();

// 每根手指 (pointerId) 對應的按鍵 key 及其 button 元素
const _pointerKeys = new Map();

export function bindInput(root = document) {
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    if (CAPTURED.has(normalize(event.code))) event.preventDefault();
    input.set(event.code, true);
  });
  window.addEventListener('keyup', (event) => input.set(event.code, false));
  window.addEventListener('blur', () => input.clearAll());
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) input.clearAll();
  });

  root.querySelectorAll('[data-key]').forEach((button) => {
    const code = button.dataset.key;

    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      try { button.setPointerCapture(event.pointerId); } catch { /* 不支援時忽略 */ }
      button.classList.add('is-pressed');
      _pointerKeys.set(event.pointerId, { key: code, button });
      input.set(code, true);
    });

    const release = (event) => {
      const entry = _pointerKeys.get(event.pointerId);
      if (entry?.key === code) {
        button.classList.remove('is-pressed');
        _pointerKeys.delete(event.pointerId);
        input.set(code, false);
      }
    };

    button.addEventListener('pointerup',           release);
    button.addEventListener('pointercancel',        release);
    button.addEventListener('lostpointercapture',   release);
    button.addEventListener('contextmenu', (e) => e.preventDefault());
  });
}
