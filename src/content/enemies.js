import { ENEMY_IDS } from './ids.js';

export const ENEMY_STATS = Object.freeze({
  [ENEMY_IDS.CROWN_EAR_BEAST]: Object.freeze({
    id: ENEMY_IDS.CROWN_EAR_BEAST,
    maxHp: 18,
    attack: 6,
    defense: 0,
    speed: 6,
    expReward: 12,
    moneyReward: 4,
  }),
});
