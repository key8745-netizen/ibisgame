import { COMMAND_TYPES } from './commands.js';
import { lcgNext, lcgInt } from './rng.js';

// Returns { command, rngState }
export function selectEnemyCommand(enemyIdx, battle, rngState) {
  const next = lcgNext(rngState);
  const targetIdx = lcgInt(next, battle.partyIds.length);
  return { command: { type: COMMAND_TYPES.ATTACK, targetIdx }, rngState: next };
}
