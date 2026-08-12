import { maxHpAtLevel, maxMpAtLevel } from './stats.js';

// EXP required to advance from `level` to `level + 1`
export function expThreshold(level) {
  return level * 20;
}

// Returns { member, leveled, levelsGained }
// Does NOT update hp/mp — caller must check if stat caps changed
export function applyExp(member, amount) {
  let { level, exp } = member;
  exp += amount;
  let levelsGained = 0;
  while (exp >= expThreshold(level)) {
    exp -= expThreshold(level);
    level += 1;
    levelsGained += 1;
  }
  return { member: { ...member, level, exp }, leveled: levelsGained > 0, levelsGained };
}

// After level-up, bring HP/MP up by the gained headroom (never lose HP on level-up)
export function applyLevelUpHealing(id, membBefore, membAfter) {
  const hpGain = maxHpAtLevel(id, membAfter.level) - maxHpAtLevel(id, membBefore.level);
  const mpGain = maxMpAtLevel(id, membAfter.level) - maxMpAtLevel(id, membBefore.level);
  return {
    ...membAfter,
    hp: Math.min(membAfter.hp + hpGain, maxHpAtLevel(id, membAfter.level)),
    mp: Math.min(membAfter.mp + mpGain, maxMpAtLevel(id, membAfter.level)),
  };
}
