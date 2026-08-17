export const ACTIONS = Object.freeze({
  UP: 'up', DOWN: 'down', LEFT: 'left', RIGHT: 'right',
  CONFIRM: 'confirm', CANCEL: 'cancel', MENU: 'menu', LEADER: 'leader',
});

const KEY_ACTION = new Map([
  ['ArrowUp', ACTIONS.UP], ['KeyW', ACTIONS.UP],
  ['ArrowDown', ACTIONS.DOWN], ['KeyS', ACTIONS.DOWN],
  ['ArrowLeft', ACTIONS.LEFT], ['KeyA', ACTIONS.LEFT],
  ['ArrowRight', ACTIONS.RIGHT], ['KeyD', ACTIONS.RIGHT],
  ['KeyZ', ACTIONS.CONFIRM], ['Space', ACTIONS.CONFIRM], ['Enter', ACTIONS.CONFIRM], ['NumpadEnter', ACTIONS.CONFIRM],
  ['KeyX', ACTIONS.CANCEL], ['ShiftLeft', ACTIONS.CANCEL], ['ShiftRight', ACTIONS.CANCEL],
  ['Escape', ACTIONS.MENU],
]);

export class InputState {
  constructor() {
    this.held = new Set();
    this.pressed = new Set();
  }

  set(action, down) {
    if (!Object.values(ACTIONS).includes(action)) return;
    if (down) {
      if (!this.held.has(action)) this.pressed.add(action);
      this.held.add(action);
    } else {
      this.held.delete(action);
    }
  }

  isDown(action) { return this.held.has(action); }
  wasPressed(action) { return this.pressed.has(action); }
  endStep() { this.pressed.clear(); }
  clearAll() { this.held.clear(); this.pressed.clear(); }

  axis() {
    let x = 0;
    let y = 0;
    if (this.held.has(ACTIONS.LEFT)) x -= 1;
    if (this.held.has(ACTIONS.RIGHT)) x += 1;
    if (this.held.has(ACTIONS.UP)) y -= 1;
    if (this.held.has(ACTIONS.DOWN)) y += 1;
    if (x && y) { x *= Math.SQRT1_2; y *= Math.SQRT1_2; }
    return { x, y };
  }
}

export const input = new InputState();

export function bindInput(root = document) {
  const pointers = new Map();

  const clear = () => {
    input.clearAll();
    for (const { button } of pointers.values()) button?.classList.remove('is-pressed');
    pointers.clear();
  };

  window.addEventListener('keydown', (event) => {
    const action = KEY_ACTION.get(event.code);
    if (!action) return;
    event.preventDefault();
    if (event.repeat) return;
    input.set(action, true);
  });

  window.addEventListener('keyup', (event) => {
    const action = KEY_ACTION.get(event.code);
    if (action) input.set(action, false);
  });

  window.addEventListener('blur', clear);
  document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });

  root.querySelectorAll('[data-action]').forEach((button) => {
    const action = button.dataset.action;
    const release = (event) => {
      const entry = pointers.get(event.pointerId);
      if (!entry) return;
      entry.button.classList.remove('is-pressed');
      input.set(entry.action, false);
      pointers.delete(event.pointerId);
    };

    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      try { button.setPointerCapture(event.pointerId); } catch { /* optional */ }
      button.classList.add('is-pressed');
      pointers.set(event.pointerId, { action, button });
      input.set(action, true);
    });
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
    button.addEventListener('contextmenu', (event) => event.preventDefault());
  });

  return { clear };
}
