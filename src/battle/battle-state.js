import { ENCOUNTERS } from '../content/encounters.js';
import { ENEMY_STATS } from '../content/enemies.js';
import { makeRng } from './rng.js';

export function createBattleEntry(encounterId, seed = Date.now()) {
  const encounter = ENCOUNTERS[encounterId];
  if (!encounter) throw new RangeError(`Unknown encounter: ${encounterId}`);

  return {
    encounterId,
    context: encounter.context,
    partyIds: [...encounter.partyIds],
    enemyIds: [...encounter.enemyIds],
    phase: 'command-selection',
    round: 1,
    pendingCommands: Object.fromEntries(encounter.partyIds.map((id) => [id, null])),
    enemies: encounter.enemyIds.map((id) => {
      const stats = ENEMY_STATS[id];
      if (!stats) throw new RangeError(`Unknown enemy: ${id}`);
      return { hp: stats.maxHp, maxHp: stats.maxHp, statusFlags: {} };
    }),
    rngState: makeRng(seed),
    activeGuard: null,
    leaderEffectUsed: false,
  };
}
