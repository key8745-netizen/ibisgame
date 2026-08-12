import { ENCOUNTERS, ENCOUNTER_CONTEXT } from '../content/encounters.js';
import { ENEMY_STATS } from '../content/enemies.js';
import { makeRng } from './rng.js';

// Explicitly typed snapshot input — no silent defaults allowed.
// partyIds:    current party.activeIds at battle entry (from game state snapshot)
// leaderId:    current field.leaderId at battle entry
// revivalPoint: current progression.revivalPoint at battle entry
export function createBattleEntry(encounterId, seed = Date.now(), { partyIds, leaderId, revivalPoint } = {}) {
  const encounter = ENCOUNTERS[encounterId];
  if (!encounter) throw new RangeError(`Unknown encounter: ${encounterId}`);

  if (!Array.isArray(partyIds) || partyIds.length === 0) {
    throw new RangeError('createBattleEntry: partyIds snapshot required');
  }
  if (typeof leaderId !== 'string' || leaderId.length === 0) {
    throw new RangeError('createBattleEntry: leaderId snapshot required');
  }
  if (!revivalPoint || typeof revivalPoint.mapId !== 'string') {
    throw new RangeError('createBattleEntry: revivalPoint snapshot required');
  }

  // For authored encounters with fixed party composition, validate the snapshot matches
  if (encounter.partyIds !== null && encounter.context !== ENCOUNTER_CONTEXT.RANDOM) {
    if (partyIds.length !== encounter.partyIds.length
        || partyIds.some((id, i) => id !== encounter.partyIds[i])) {
      throw new RangeError(
        `createBattleEntry: partyIds mismatch for ${encounterId} (expected [${encounter.partyIds}], got [${partyIds}])`,
      );
    }
  }

  return {
    encounterId,
    context: encounter.context,
    partyIds: [...partyIds],
    enemyIds: [...encounter.enemyIds],
    phase: 'command-selection',
    round: 1,
    pendingCommands: Object.fromEntries(partyIds.map((id) => [id, null])),
    enemies: encounter.enemyIds.map((id, i) => {
      const stats = ENEMY_STATS[id];
      if (!stats) throw new RangeError(`Unknown enemy: ${id}`);
      return { instanceId: `${id}-${i}`, hp: stats.maxHp, maxHp: stats.maxHp, statusFlags: {} };
    }),
    partyCombatState: Object.fromEntries(partyIds.map((id) => [id, { statusFlags: {} }])),
    rngState: makeRng(seed),
    activeGuard: null,
    snapshotLeaderId: leaderId,
    snapshotRevivalPoint: { mapId: revivalPoint.mapId, x: revivalPoint.x, y: revivalPoint.y },
  };
}
