import { ENEMY_STATS } from '../content/enemies.js';
import { maxHpAtLevel, maxMpAtLevel } from './stats.js';
import { applyExp, applyLevelUpHealing } from './progression.js';

export function calcDefeatMoneyLoss(money) {
  return Math.floor(money * 0.25);
}

// Apply victory rewards to a cloned state. Returns the mutated clone.
export function completeBattleVictory(state) {
  const battle = state.battle;
  const expGain = battle.enemies.reduce((sum, _, i) => sum + (ENEMY_STATS[battle.enemyIds[i]]?.expReward ?? 0), 0);
  const moneyGain = battle.enemies.reduce((sum, _, i) => sum + (ENEMY_STATS[battle.enemyIds[i]]?.moneyReward ?? 0), 0);

  for (const id of battle.partyIds) {
    const before = state.party.members[id];
    const { member, levelsGained } = applyExp(before, expGain);
    state.party.members[id] = levelsGained > 0 ? applyLevelUpHealing(id, before, member) : member;
  }

  state.economy.money += moneyGain;
  state.battle.phase = 'complete';
  return state;
}

// Apply defeat penalties to a cloned state. Returns the mutated clone.
export function completeBattleDefeat(state) {
  const loss = calcDefeatMoneyLoss(state.economy.money);
  state.economy.money = Math.max(0, state.economy.money - loss);

  for (const id of Object.keys(state.party.members)) {
    const m = state.party.members[id];
    state.party.members[id] = {
      ...m,
      hp: maxHpAtLevel(id, m.level),
      mp: maxMpAtLevel(id, m.level),
    };
  }

  state.battle.phase = 'complete';
  return state;
}
