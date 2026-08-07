// 輸入層。按鍵事件在固定步長迴圈裡被消費，避免在高更新率螢幕上遺失輸入。

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
    this.held = new Set();
    /** 尚未被任何一次 update 消費的「本次按下」。 */
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

  isDown(key) {
    return this.held.has(key);
  }

  /** 只有真的跑了一次模擬步進才清空，0 步的畫格不會吃掉玩家的按鍵。 */
  endStep() {
    if (this.pressed.size) this.pressed.clear();
  }

  clearAll() {
    this.held.clear();
    this.pressed.clear();
  }

  axis() {
    let x = 0;
    let y = 0;
    if (this.held.has('ArrowLeft')) x -= 1;
    if (this.held.has('ArrowRight')) x += 1;
    if (this.held.has('ArrowUp')) y -= 1;
    if (this.held.has('ArrowDown')) y += 1;
    if (x && y) {
      x *= Math.SQRT1_2;
      y *= Math.SQRT1_2;
    }
    return { x, y };
  }
}

export const input = new Input();

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
    const press = (event) => {
      event.preventDefault();
      try { button.setPointerCapture(event.pointerId); } catch { /* 不支援時忽略 */ }
      button.classList.add('is-pressed');
      input.set(code, true);
    };
    const release = (event) => {
      event.preventDefault();
      button.classList.remove('is-pressed');
      input.set(code, false);
    };
    button.addEventListener('pointerdown', press);
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
    button.addEventListener('contextmenu', (event) => event.preventDefault());
  });
}
