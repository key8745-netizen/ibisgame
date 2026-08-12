import { ACTIONS, bindInput, input } from './engine/input.js';
import { FixedStepLoop } from './engine/loop.js';
import { configurePixelCanvas, Painter } from './engine/pixel.js';
import { fitPixelCanvas, LOGICAL_HEIGHT, LOGICAL_WIDTH } from './engine/display.js';
import { createInitialGameState } from './state/game-state.js';
import { createAppUI } from './ui/app-ui.js';

const canvas = document.querySelector('#gameCanvas');
const frame = document.querySelector('#gameFrame');
const ctx = configurePixelCanvas(canvas);
const painter = new Painter(ctx);
const ui = createAppUI(document);
const inputBinding = bindInput(document);
const state = createInitialGameState();
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let message = 'M1 技術基礎已啟動。按確認進入 foundation field。';

function setMode(mode, nextMessage) {
  state.mode = mode;
  message = nextMessage;
}

function update(dt) {
  if (state.mode === 'title' && input.wasPressed(ACTIONS.CONFIRM)) {
    setMode('field', 'Foundation field：只驗證輸入、狀態與渲染邊界；正式溪石村內容會在 M2 進入。');
  } else if (state.mode === 'field') {
    const axis = input.axis();
    const speed = 72;
    state.field.x = Math.max(10, Math.min(LOGICAL_WIDTH - 10, state.field.x + axis.x * speed * dt));
    state.field.y = Math.max(24, Math.min(LOGICAL_HEIGHT - 12, state.field.y + axis.y * speed * dt));

    if (input.wasPressed(ACTIONS.MENU)) setMode('pause', '已暫停。按 Esc／選單繼續。');
    if (input.wasPressed(ACTIONS.CANCEL) || input.wasPressed(ACTIONS.LEADER)) {
      message = '目前只有尤哈尼在 active party；領隊切換會依 GD-107 在 M2 正式解鎖。';
    }
  } else if (state.mode === 'pause' && input.wasPressed(ACTIONS.MENU)) {
    setMode('field', '已繼續。');
  }

  input.endStep();
}

function render() {
  painter.rect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT, '#111827');
  painter.rect(0, 188, LOGICAL_WIDTH, 82, '#243a2b');
  painter.rect(0, 202, LOGICAL_WIDTH, 18, '#314c36');
  painter.rect(26, 40, 428, 112, '#17283a');
  painter.frame(26, 40, 428, 112, '#526b86');

  const px = Math.round(state.field.x);
  const py = Math.round(state.field.y);
  painter.rect(px - 5, py - 10, 10, 14, '#d7b06a');
  painter.rect(px - 3, py - 14, 6, 5, '#f0d1a1');
  if (!prefersReducedMotion && state.mode === 'field') painter.rect(px - 6, py + 5, 12, 1, '#0b1018');

  ui.sync(state, message);
}

function resize() { fitPixelCanvas(canvas, frame); }
window.addEventListener('resize', resize, { passive: true });
resize();

document.querySelector('#menuButton')?.addEventListener('click', () => input.set(ACTIONS.MENU, true));
document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.mode === 'field') setMode('pause', '裝置切到背景，遊戲已安全暫停。');
});
window.addEventListener('blur', () => {
  if (state.mode === 'field') setMode('pause', '視窗失去焦點，遊戲已安全暫停。');
  inputBinding.clear();
});

const loop = new FixedStepLoop({ update, render });
loop.start();
