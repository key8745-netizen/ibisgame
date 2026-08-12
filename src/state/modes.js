export const GAME_MODES = Object.freeze([
  'title', 'field', 'menu', 'dialogue-event', 'battle', 'shop-service', 'save', 'pause', 'ending',
]);

export function isGameMode(value) { return GAME_MODES.includes(value); }
