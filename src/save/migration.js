import { CHARACTER_IDS, MAP_IDS } from '../content/ids.js';
import { SAVE_VERSION } from '../state/game-state.js';

// Migrate a raw parsed save from v1 to v2 schema (returns mutated copy or null on failure)
function migrateV1ToV2(raw) {
  if (!raw || typeof raw !== 'object' || raw.version !== 1) return null;
  const s = structuredClone(raw);

  s.version = 2;

  // equipment: new in v2
  s.equipment = {
    [CHARACTER_IDS.YOHANI]: { weapon: null, armor: null, shield: null, accessory: null },
    [CHARACTER_IDS.SANI]: { weapon: null, armor: null, focus: null, accessory: null },
  };

  // progression.revivalPoint: new in v2
  if (s.progression && !s.progression.revivalPoint) {
    s.progression.revivalPoint = { mapId: MAP_IDS.XISHI_VILLAGE, x: 148, y: 356 };
  }

  // pause: new in v2
  if (!('pause' in s)) s.pause = null;

  // battle: v1 only ever stored m2Stub battles (m2Stub: true flag).
  // Drop confirmed stubs silently. Any other in-progress battle is unexpected — refuse migration.
  if (s.battle !== null) {
    if (!s.battle?.m2Stub) return null;  // unknown v1 battle — refuse
    s.battle = null;
    if (s.mode === 'battle') s.mode = 'field';
  }

  return s;
}

// Try to migrate an arbitrary raw object to current SAVE_VERSION.
// Returns the migrated object (still unvalidated) or null if not migratable.
export function tryMigrate(raw) {
  if (!raw || typeof raw.version !== 'number') return null;
  if (raw.version === SAVE_VERSION) return null;  // already current — no migration needed
  if (raw.version === 1) return migrateV1ToV2(raw);
  return null;
}
