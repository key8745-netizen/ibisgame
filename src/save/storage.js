import { validateGameState } from '../state/game-state.js';
import { tryMigrate } from './migration.js';

export const SAVE_NAMESPACE = 'ibisgame-jrpg-v1';
export const MANUAL_SLOT_COUNT = 3;

export const saveKeys = Object.freeze({
  manual: (slot) => `${SAVE_NAMESPACE}:manual:${slot}`,
  autosave: `${SAVE_NAMESPACE}:autosave`,
  suspend: `${SAVE_NAMESPACE}:suspend`,
});

export class SaveStore {
  constructor(storage) { this.storage = storage; }

  writeManual(slot, state) {
    if (!Number.isInteger(slot) || slot < 0 || slot >= MANUAL_SLOT_COUNT) throw new RangeError('invalid manual save slot');
    return this.write(saveKeys.manual(slot), state);
  }

  writeAutosave(state) { return this.write(saveKeys.autosave, state); }
  writeSuspend(state) { return this.write(saveKeys.suspend, state); }
  readManual(slot) {
    if (!Number.isInteger(slot) || slot < 0 || slot >= MANUAL_SLOT_COUNT) return null;
    return this.read(saveKeys.manual(slot));
  }
  readAutosave() { return this.read(saveKeys.autosave); }
  readSuspend() { return this.read(saveKeys.suspend); }

  write(key, state) {
    const valid = validateGameState(state);
    if (!valid) throw new TypeError('refusing to persist invalid game state');
    this.storage.setItem(key, JSON.stringify(valid));
    return true;
  }

  read(key) {
    try {
      const raw = this.storage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const direct = validateGameState(parsed);
      if (direct) return direct;
      const migrated = tryMigrate(parsed);
      if (!migrated) return null;
      return validateGameState(migrated);
    } catch {
      return null;
    }
  }
}
