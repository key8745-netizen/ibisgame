import { CHARACTER_IDS, ITEM_IDS, MAP_IDS } from '../content/ids.js';
import { OPENING_PHASE, OPENING_PHASES } from '../content/opening.js';
import { KNOWN_ENCOUNTER_IDS } from '../content/encounters.js';
import { ENEMY_STATS } from '../content/enemies.js';
import { GAME_MODES, isGameMode } from './modes.js';

export const SAVE_VERSION = 2;
const KNOWN_CHARACTERS = new Set(Object.values(CHARACTER_IDS));
const KNOWN_MAPS = new Set(Object.values(MAP_IDS));
const KNOWN_OPENING_PHASES = new Set(OPENING_PHASES);

const VALID_BATTLE_CONTEXTS = new Set(['authored-solo', 'authored-shared', 'random', 'boss']);
const VALID_BATTLE_PHASES = new Set(['command-selection']);
const VALID_RESUME_MODES = new Set(GAME_MODES.filter((m) => m !== 'pause'));

export function createInitialGameState() {
  return {
    version: SAVE_VERSION,
    mode: 'title',
    sceneId: 'opening',
    field: {
      mapId: MAP_IDS.XISHI_VILLAGE,
      x: 148,
      y: 356,
      controlledId: CHARACTER_IDS.YOHANI,
      leaderId: CHARACTER_IDS.YOHANI,
    },
    party: {
      activeIds: [CHARACTER_IDS.YOHANI],
      reserveIds: [],
      members: {
        [CHARACTER_IDS.YOHANI]: { level: 1, exp: 0, hp: 24, mp: 4 },
        [CHARACTER_IDS.SANI]: { level: 1, exp: 0, hp: 18, mp: 12 },
      },
    },
    economy: { money: 0 },
    inventory: {
      shared: { [ITEM_IDS.LUNCH_PARCEL]: 1 },
      battleCarry: { [CHARACTER_IDS.YOHANI]: [], [CHARACTER_IDS.SANI]: [] },
    },
    equipment: {
      [CHARACTER_IDS.YOHANI]: { weapon: null, armor: null, shield: null, accessory: null },
      [CHARACTER_IDS.SANI]: { weapon: null, armor: null, focus: null, accessory: null },
    },
    progression: {
      openingPhase: OPENING_PHASE.DELIVERY,
      leaderUnlocked: false,
      revivalPoint: { mapId: MAP_IDS.XISHI_VILLAGE, x: 148, y: 356 },
      flags: {},
    },
    pause: null,
    battle: null,
  };
}

const isFiniteInt = (value) => Number.isInteger(value) && Number.isFinite(value);
const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function validateBattle(b, state) {
  if (!isPlainObject(b)) return false;
  if (typeof b.encounterId !== 'string' || b.encounterId.length === 0) return false;
  if (!KNOWN_ENCOUNTER_IDS.has(b.encounterId)) return false;
  if (!VALID_BATTLE_CONTEXTS.has(b.context)) return false;
  if (!VALID_BATTLE_PHASES.has(b.phase)) return false;
  if (!isFiniteInt(b.round) || b.round < 1) return false;
  if (!Array.isArray(b.partyIds) || b.partyIds.length < 1) return false;

  // partyIds must be unique known characters
  const partySet = new Set(b.partyIds);
  if (partySet.size !== b.partyIds.length) return false;
  if ([...partySet].some((id) => !KNOWN_CHARACTERS.has(id))) return false;

  // authored context party composition constraints
  if (b.context === 'authored-solo') {
    if (b.partyIds.length !== 1 || b.partyIds[0] !== CHARACTER_IDS.YOHANI) return false;
  }
  if (b.context === 'authored-shared') {
    if (b.partyIds.length !== 2
        || b.partyIds[0] !== CHARACTER_IDS.YOHANI
        || b.partyIds[1] !== CHARACTER_IDS.SANI) return false;
  }

  // pendingCommands keys must exactly equal partyIds (order-independent)
  if (!isPlainObject(b.pendingCommands)) return false;
  const cmdKeys = new Set(Object.keys(b.pendingCommands));
  if (cmdKeys.size !== partySet.size) return false;
  if ([...partySet].some((id) => !cmdKeys.has(id))) return false;
  for (const v of Object.values(b.pendingCommands)) {
    if (v !== null && (!isPlainObject(v) || typeof v.type !== 'string')) return false;
  }

  // battle.partyIds must match party.activeIds exactly (same set, same order)
  if (!Array.isArray(state.party?.activeIds)) return false;
  if (b.partyIds.length !== state.party.activeIds.length) return false;
  if (b.partyIds.some((id, i) => id !== state.party.activeIds[i])) return false;

  if (!Array.isArray(b.enemyIds) || b.enemyIds.length < 1) return false;
  if (b.enemyIds.some((id) => !ENEMY_STATS[id])) return false;
  if (!Array.isArray(b.enemies) || b.enemies.length !== b.enemyIds.length) return false;
  for (const enemy of b.enemies) {
    if (!isPlainObject(enemy)) return false;
    if (typeof enemy.instanceId !== 'string' || enemy.instanceId.length === 0) return false;
    if (!isFiniteInt(enemy.hp) || enemy.hp < 0) return false;
    if (!isFiniteInt(enemy.maxHp) || enemy.maxHp < 1) return false;
    if (enemy.hp > enemy.maxHp) return false;
  }

  // partyCombatState: keys must exactly match partyIds, each value is plain object with statusFlags
  if (!isPlainObject(b.partyCombatState)) return false;
  const combatKeys = new Set(Object.keys(b.partyCombatState));
  if (combatKeys.size !== partySet.size) return false;
  if ([...partySet].some((id) => !combatKeys.has(id))) return false;
  for (const v of Object.values(b.partyCombatState)) {
    if (!isPlainObject(v) || !isPlainObject(v.statusFlags)) return false;
  }

  if (!isFiniteInt(b.rngState) || b.rngState <= 0) return false;

  // snapshotLeaderId must be a known character
  if (!KNOWN_CHARACTERS.has(b.snapshotLeaderId)) return false;

  // snapshotRevivalPoint must have a valid map and finite coordinates
  if (!isPlainObject(b.snapshotRevivalPoint)) return false;
  if (!KNOWN_MAPS.has(b.snapshotRevivalPoint.mapId)) return false;
  if (!Number.isFinite(b.snapshotRevivalPoint.x) || !Number.isFinite(b.snapshotRevivalPoint.y)) return false;

  // activeGuard: null or plain object with known-character guarderId and targetId
  if (b.activeGuard !== null) {
    if (!isPlainObject(b.activeGuard)) return false;
    if (!KNOWN_CHARACTERS.has(b.activeGuard.guarderId)) return false;
    if (!KNOWN_CHARACTERS.has(b.activeGuard.targetId)) return false;
  }

  // Authored context ↔ opening phase cross-validation
  const openingPhase = state.progression?.openingPhase;
  if (b.context === 'authored-solo' && openingPhase !== OPENING_PHASE.SOLO_APPROACH) return false;
  if (b.context === 'authored-shared' && openingPhase !== OPENING_PHASE.SHARED_PANIC) return false;

  return true;
}

export function validateGameState(candidate) {
  if (!isPlainObject(candidate) || candidate.version !== SAVE_VERSION || !isGameMode(candidate.mode)) return null;

  if (!isPlainObject(candidate.field) || !KNOWN_MAPS.has(candidate.field.mapId)) return null;
  if (!Number.isFinite(candidate.field.x) || !Number.isFinite(candidate.field.y)) return null;
  if (!KNOWN_CHARACTERS.has(candidate.field.controlledId)) return null;

  if (!isPlainObject(candidate.party)
      || !Array.isArray(candidate.party.activeIds)
      || !Array.isArray(candidate.party.reserveIds)) return null;
  if (candidate.party.activeIds.length < 1 || candidate.party.activeIds.length > 4) return null;

  const active = new Set(candidate.party.activeIds);
  if (active.size !== candidate.party.activeIds.length) return null;
  if ([...active].some((id) => !KNOWN_CHARACTERS.has(id))) return null;

  // leaderId must be in party.activeIds
  if (!active.has(candidate.field.leaderId)) return null;

  if (!isPlainObject(candidate.party.members)) return null;
  for (const id of KNOWN_CHARACTERS) {
    const member = candidate.party.members[id];
    if (!isPlainObject(member)) return null;
    if (!isFiniteInt(member.level) || member.level < 1) return null;
    if (!isFiniteInt(member.exp) || member.exp < 0) return null;
    if (!isFiniteInt(member.hp) || member.hp < 0) return null;
    if (!isFiniteInt(member.mp) || member.mp < 0) return null;
  }

  if (!isPlainObject(candidate.economy) || !isFiniteInt(candidate.economy.money) || candidate.economy.money < 0) return null;

  if (!isPlainObject(candidate.inventory) || !isPlainObject(candidate.inventory.shared)) return null;
  if (!isPlainObject(candidate.inventory.battleCarry)) return null;
  for (const id of KNOWN_CHARACTERS) {
    const carry = candidate.inventory.battleCarry[id];
    if (!Array.isArray(carry) || carry.length > 3) return null;
    for (const slot of carry) {
      if (!isPlainObject(slot) || typeof slot.itemId !== 'string' || !isFiniteInt(slot.uses) || slot.uses < 0) return null;
    }
  }

  if (!isPlainObject(candidate.equipment)) return null;
  for (const id of KNOWN_CHARACTERS) {
    if (!isPlainObject(candidate.equipment[id])) return null;
  }

  if (!isPlainObject(candidate.progression) || !isPlainObject(candidate.progression.flags)) return null;
  if (!KNOWN_OPENING_PHASES.has(candidate.progression.openingPhase)) return null;
  if (typeof candidate.progression.leaderUnlocked !== 'boolean') return null;
  if (!isPlainObject(candidate.progression.revivalPoint)) return null;
  if (!KNOWN_MAPS.has(candidate.progression.revivalPoint.mapId)) return null;

  // Pause contract: mode='pause' ↔ pause object with valid non-pause resumeMode; mode≠'pause' → pause=null
  if (candidate.mode === 'pause') {
    if (!isPlainObject(candidate.pause)) return null;
    if (!VALID_RESUME_MODES.has(candidate.pause.resumeMode)) return null;
  } else {
    if (candidate.pause !== null) return null;
  }

  if (candidate.battle !== null) {
    if (!validateBattle(candidate.battle, candidate)) return null;
  }

  // mode↔battle cross-check
  if (candidate.mode === 'battle' && candidate.battle === null) return null;
  if (candidate.battle !== null
      && candidate.mode !== 'battle'
      && !(candidate.mode === 'pause' && candidate.pause?.resumeMode === 'battle')) return null;

  return structuredClone(candidate);
}
