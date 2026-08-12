import { OPENING_PHASE, OPENING_POINTS } from './content/opening.js';
import { ACTIONS, bindInput, input } from './engine/input.js';
import { FixedStepLoop } from './engine/loop.js';
import { configurePixelCanvas, Painter } from './engine/pixel.js';
import { fitPixelCanvas, LOGICAL_HEIGHT, LOGICAL_WIDTH } from './engine/display.js';
import { applyOpeningEvent, OPENING_EVENT, resolveM2BattleStub, switchLeader } from './events/opening-director.js';
import { createInitialGameState } from './state/game-state.js';
import { createAppUI } from './ui/app-ui.js';
import { distanceToFieldPoint, isNearFieldPoint, updateFieldMovement } from './world/field-controller.js';
import { drawActor, drawCrownEarBeast, drawVillage, VILLAGE_HEIGHT, VILLAGE_WIDTH } from './world/village-map.js';

const canvas = document.querySelector('#gameCanvas');
const frame = document.querySelector('#gameFrame');
const ctx = configurePixelCanvas(canvas);
const painter = new Painter(ctx);
const ui = createAppUI(document);
const inputBinding = bindInput(document);
const state = createInitialGameState();
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const camera = { x: 0, y: 0 };
let time = 0;
let message = '鄰居把包好的午飯交給尤哈尼。送到水渠旁的熟人手上吧。';
let authoredScene = null;

function setMode(mode, nextMessage) {
  state.mode = mode;
  message = nextMessage;
}

function beginAuthoredScene(kind) {
  authoredScene = { kind, time: 0, startX: state.field.x, startY: state.field.y };
}

function startM2Battle(event, nextMessage) {
  applyOpeningEvent(state, event);
  message = `${nextMessage}（M2 integration stub：按確認模擬戰鬥結束；正式戰鬥系統於 M3 接入。）`;
}

function updateAuthoredScene(dt) {
  if (!authoredScene) return false;
  authoredScene.time += dt;

  if (authoredScene.kind === 'solo-warning') {
    if (authoredScene.time < 1.1) {
      message = '冠耳獸豎起耳冠、身體定住，發出短促警告。';
    } else if (authoredScene.time < 2.2) {
      message = '牠維持警戒姿勢，有控制地朝尤哈尼靠近。';
    } else {
      authoredScene = null;
      startM2Battle(OPENING_EVENT.SOLO_BATTLE_STARTED, '冠耳獸接近，進入尤哈尼的第一場單人戰鬥。');
    }
    return true;
  }

  if (authoredScene.kind === 'shared-panic') {
    if (authoredScene.time < 1.2) {
      message = '另一隻冠耳獸來回變向、退縮，耳冠後壓，明顯失去平常的穩定。';
    } else if (authoredScene.time < 2.5) {
      message = '牠又看向別處，像在躲避看不見的干擾；尾巴失序擺動。';
    } else if (authoredScene.time < 3.2) {
      message = '冠耳獸突然失控，直接朝兄妹衝來！';
    } else {
      authoredScene = null;
      startM2Battle(OPENING_EVENT.SHARED_BATTLE_STARTED, '短距離衝撞接觸，進入兄妹第一次共同戰鬥。');
    }
    return true;
  }
  return false;
}

function handleInteraction() {
  const phase = state.progression.openingPhase;

  if (phase === OPENING_PHASE.DELIVERY && isNearFieldPoint(state, OPENING_POINTS.DELIVERY_RECIPIENT)) {
    applyOpeningEvent(state, OPENING_EVENT.DELIVERED);
    message = '午飯送到了。轉身時，尤哈尼注意到旁邊水渠的水竟然往高處流。';
    return;
  }
  if (phase === OPENING_PHASE.CHANNEL && isNearFieldPoint(state, OPENING_POINTS.CHANNEL_OBSERVATION)) {
    applyOpeningEvent(state, OPENING_EVENT.CHANNEL_CONFIRMED);
    message = '固定的水渠坡度沒有改變，但葉片和碎屑持續逆著坡往上游移動。不是普通漩流。';
    return;
  }
  if (phase === OPENING_PHASE.SANI_STREAM && isNearFieldPoint(state, OPENING_POINTS.SANI_STREAM_TEST)) {
    applyOpeningEvent(state, OPENING_EVENT.STREAM_CONFIRMED);
    message = '珊妮把葉片放進天然溪流。葉片逆著岩坡往上游走；她再跟一小段，確認不是局部迴流。';
    return;
  }
  if (phase === OPENING_PHASE.CONVERGENCE && isNearFieldPoint(state, OPENING_POINTS.CONVERGENCE)) {
    applyOpeningEvent(state, OPENING_EVENT.CLUES_COMPARED);
    message = '尤哈尼說村內水渠逆流；珊妮說天然溪流也一樣。兩人只確定：同一種不可能的現象正在不同地方發生。';
    beginAuthoredScene('shared-panic');
    return;
  }
  if (phase === OPENING_PHASE.RETURN && isNearFieldPoint(state, OPENING_POINTS.VILLAGE_AUTHORITY)) {
    applyOpeningEvent(state, OPENING_EVENT.REPORTED_TO_VILLAGE);
    message = '兄妹只報告親眼看到的事：兩處逆流，以及一隻失常的冠耳獸。開場段落完成。';
    return;
  }

  message = '這裡目前沒有需要確認的事件。';
}

function update(dt) {
  time += dt;

  if (state.mode === 'title' && input.wasPressed(ACTIONS.CONFIRM)) {
    setMode('field', '尤哈尼先完成日常送飯差事。');
  } else if (state.mode === 'battle') {
    if (input.wasPressed(ACTIONS.CONFIRM) && resolveM2BattleStub(state)) {
      const phase = state.progression.openingPhase;
      message = phase === OPENING_PHASE.SANI_STREAM
        ? '第一戰結束。視角切到珊妮：她正在村外天然溪流旁確認自己的發現。'
        : '第二隻冠耳獸被制伏後仍很不安，隨即逃走。兄妹不知道牠在怕什麼。現在教學領隊切換。';
    }
  } else if (state.mode === 'field') {
    const sceneLocked = updateAuthoredScene(dt);
    if (!sceneLocked) {
      updateFieldMovement(state, input.axis(), dt);

      if (input.wasPressed(ACTIONS.CONFIRM)) handleInteraction();

      const leaderInput = input.wasPressed(ACTIONS.LEADER) || input.wasPressed(ACTIONS.CANCEL);
      if (leaderInput) {
        if (switchLeader(state)) {
          message = state.progression.openingPhase === OPENING_PHASE.RETURN
            ? '領隊切換完成：尤哈尼＝Protection / Guardian；珊妮＝Insight。現在回村報告。'
            : '已切換領隊。';
        } else {
          message = '領隊系統會在兄妹第一次共同戰鬥後解鎖。';
        }
      }

      if (state.progression.openingPhase === OPENING_PHASE.SOLO_APPROACH
          && distanceToFieldPoint(state, OPENING_POINTS.SOLO_BEAST) <= OPENING_POINTS.SOLO_BEAST.triggerRadius) {
        beginAuthoredScene('solo-warning');
      }
    }

    if (input.wasPressed(ACTIONS.MENU)) setMode('pause', '已暫停。按 Esc／選單繼續。');
  } else if (state.mode === 'pause' && input.wasPressed(ACTIONS.MENU)) {
    setMode('field', '已繼續。');
  }

  updateCamera(dt);
  input.endStep();
}

function updateCamera(dt) {
  const tx = Math.max(0, Math.min(VILLAGE_WIDTH - LOGICAL_WIDTH, state.field.x - LOGICAL_WIDTH / 2));
  const ty = Math.max(0, Math.min(VILLAGE_HEIGHT - LOGICAL_HEIGHT, state.field.y - LOGICAL_HEIGHT / 2));
  const factor = 1 - Math.pow(0.001, dt);
  camera.x += (tx - camera.x) * factor;
  camera.y += (ty - camera.y) * factor;
}

function drawOpeningEntities() {
  const phase = state.progression.openingPhase;

  if (phase === OPENING_PHASE.SOLO_APPROACH || authoredScene?.kind === 'solo-warning') {
    let x = OPENING_POINTS.SOLO_BEAST.x;
    let y = OPENING_POINTS.SOLO_BEAST.y;
    if (authoredScene?.kind === 'solo-warning' && authoredScene.time > 1.1) {
      const t = Math.min(1, (authoredScene.time - 1.1) / 1.1);
      x += (authoredScene.startX - x) * t;
      y += (authoredScene.startY - y) * t;
    }
    drawCrownEarBeast(painter, camera, x, y, 'alert');
  }

  if (phase === OPENING_PHASE.SHARED_PANIC || authoredScene?.kind === 'shared-panic') {
    let x = OPENING_POINTS.SHARED_BEAST.x;
    let y = OPENING_POINTS.SHARED_BEAST.y;
    if (authoredScene?.kind === 'shared-panic') {
      if (authoredScene.time < 2.5) {
        x += Math.round(Math.sin(authoredScene.time * 9) * 18);
        y += Math.round(Math.sin(authoredScene.time * 13) * 8);
      } else {
        const t = Math.min(1, (authoredScene.time - 2.5) / 0.7);
        x += (state.field.x - x) * t;
        y += (state.field.y - y) * t;
      }
    }
    drawCrownEarBeast(painter, camera, x, y, 'panic');
  }
}

function render() {
  drawVillage(painter, camera, state, time);
  drawOpeningEntities();

  if (state.mode !== 'battle') {
    drawActor(painter, camera, state.field.x, state.field.y, state.field.controlledId);
    if (state.party.activeIds.length > 1 && state.progression.openingPhase !== OPENING_PHASE.SHARED_PANIC) {
      const follower = state.field.controlledId === 'yohani' ? 'sani' : 'yohani';
      drawActor(painter, camera, state.field.x - 14, state.field.y + 12, follower);
    }
  } else {
    painter.rect(40, 48, 400, 160, '#111827');
    painter.frame(40, 48, 400, 160, '#d0b87d');
    painter.rect(70, 88, 150, 72, '#34261f');
    drawCrownEarBeast(painter, { x: -120, y: -108 }, 0, 0, state.battle?.encounterId.includes('shared') ? 'panic' : 'alert');
    if (!prefersReducedMotion) painter.rect(62, 188, 356, 2, '#735e42');
  }

  ui.sync(state, message);
}

function resize() { fitPixelCanvas(canvas, frame); }
window.addEventListener('resize', resize, { passive: true });
resize();

function pulseAction(action) {
  input.set(action, true);
  input.set(action, false);
}

document.querySelector('#menuButton')?.addEventListener('click', () => pulseAction(ACTIONS.MENU));
document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.mode === 'field') setMode('pause', '裝置切到背景，遊戲已安全暫停。');
});
window.addEventListener('blur', () => {
  if (state.mode === 'field') setMode('pause', '視窗失去焦點，遊戲已安全暫停。');
  inputBinding.clear();
});

const loop = new FixedStepLoop({ update, render });
loop.start();
