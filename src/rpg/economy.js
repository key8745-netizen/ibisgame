import { ENEMY_STATS } from '../content/enemies.js';
import { maxHpAtLevel, maxMpAtLevel } from './stats.js';
import { applyExp, applyLevelUpHealing } from './progression.js';

export function calcDefeatMoneyLoss(money) {
  return Math.floor(money * 0.25);
}

// Apply victory rewards to a cloned state. Mutates and returns the clone.
// Sets battle.phase='complete'. Does NOT clear battle — resolver handles phase transitions.
export function completeBattleVictory(state) {
  const battle = state.battle;

  // Idempotent guard: rewards already applied when phase is already complete
  if (battle.phase === 'complete') return state;

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

// Apply defeat penalties to a cloned state. Mutates and returns the clone.
// Sets battle.phase='complete'. Does NOT clear battle — resolver handles phase transitions.
export function completeBattleDefeat(state) {
  // Idempotent guard
  if (state.battle.phase === 'complete') return state;

  const loss = calcDefeatMoneyLoss(state.economy.money);
  state.economy.money = Math.max(0, state.economy.money - loss);

  // Restore HP/MP to full for all members
  for (const id of Object.keys(state.party.members)) {
    const m = state.party.members[id];
    state.party.members[id] = {
      ...m,
      hp: maxHpAtLevel(id, m.level),
      mp: maxMpAtLevel(id, m.level),
    };
  }

  // Use battle-entry revival point snapshot if available, else fall back to progression
  if (state.battle.snapshotRevivalPoint) {
    state.field.mapId = state.battle.snapshotRevivalPoint.mapId;
    state.field.x = state.battle.snapshotRevivalPoint.x;
    state.field.y = state.battle.snapshotRevivalPoint.y;
  } else if (state.progression.revivalPoint) {
    state.field.mapId = state.progression.revivalPoint.mapId;
    state.field.x = state.progression.revivalPoint.x;
    state.field.y = state.progression.revivalPoint.y;
  }

  state.battle.phase = 'complete';
  return state;
}
