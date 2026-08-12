import { ENEMY_STATS } from '../content/enemies.js';
import { maxHpAtLevel, maxMpAtLevel } from './stats.js';
import { applyExp, applyLevelUpHealing } from './progression.js';

export function calcDefeatMoneyLoss(money) {
  return Math.floor(money * 0.25);
}

// Apply EXP and money victory rewards to state.party.members (battle.partyIds only).
// Does NOT set battle.phase or clear battle — the caller (resolver) handles that.
export function applyVictoryRewards(state) {
  const battle = state.battle;
  const expGain = battle.enemies.reduce((sum, _, i) => sum + (ENEMY_STATS[battle.enemyIds[i]]?.expReward ?? 0), 0);
  const moneyGain = battle.enemies.reduce((sum, _, i) => sum + (ENEMY_STATS[battle.enemyIds[i]]?.moneyReward ?? 0), 0);

  for (const id of battle.partyIds) {
    const before = state.party.members[id];
    const { member, levelsGained } = applyExp(before, expGain);
    state.party.members[id] = levelsGained > 0 ? applyLevelUpHealing(id, before, member) : member;
  }

  state.economy.money += moneyGain;
}

// Apply defeat penalties: money loss + HP/MP restore for battle.partyIds only.
// Reserve members (not in battle.partyIds) are NOT affected.
// Does NOT clear battle or set mode — the caller (resolver) handles that.
export function applyDefeatPenalties(state) {
  const battle = state.battle;
  const loss = calcDefeatMoneyLoss(state.economy.money);
  state.economy.money = Math.max(0, state.economy.money - loss);

  for (const id of battle.partyIds) {
    const m = state.party.members[id];
    state.party.members[id] = {
      ...m,
      hp: maxHpAtLevel(id, m.level),
      mp: maxMpAtLevel(id, m.level),
    };
  }

  // Restore field position to revival point snapshot from battle entry
  const rp = battle.snapshotRevivalPoint ?? state.progression.revivalPoint;
  if (rp) {
    state.field.mapId = rp.mapId;
    state.field.x = rp.x;
    state.field.y = rp.y;
  }
}
