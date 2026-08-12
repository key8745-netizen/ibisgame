export function createAppUI(root = document) {
  const modeLabel = root.querySelector('#modeLabel');
  const leaderLabel = root.querySelector('#leaderLabel');
  const messageText = root.querySelector('#messageText');
  const names = { yohani: '尤哈尼', sani: '珊妮' };

  return {
    sync(state, message) {
      modeLabel.textContent = String(state.mode).toUpperCase();
      leaderLabel.textContent = names[state.field.leaderId] ?? state.field.leaderId;
      if (message != null) messageText.textContent = message;
    },
  };
}
