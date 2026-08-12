import { objectiveForOpening } from '../content/opening.js';

export function createAppUI(root = document) {
  const modeLabel = root.querySelector('#modeLabel');
  const leaderLabel = root.querySelector('#leaderLabel');
  const messageText = root.querySelector('#messageText');
  const objectiveText = root.querySelector('#objectiveText');
  const names = { yohani: '尤哈尼', sani: '珊妮' };

  return {
    sync(state, message) {
      modeLabel.textContent = String(state.mode).toUpperCase();
      const actorName = names[state.field.controlledId] ?? state.field.controlledId;
      const leaderName = names[state.field.leaderId] ?? state.field.leaderId;
      leaderLabel.textContent = state.progression.leaderUnlocked ? `領隊：${leaderName}` : `操作：${actorName}`;
      if (message != null) messageText.textContent = message;
      if (objectiveText) objectiveText.textContent = objectiveForOpening(state.progression.openingPhase);
    },
  };
}
