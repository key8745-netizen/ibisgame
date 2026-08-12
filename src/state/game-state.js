import { CHARACTER_IDS, MAP_IDS } from '../content/ids.js';
import { isGameMode } from './modes.js';

export const SAVE_VERSION = 1;
const KNOWN_CHARACTERS = new Set(Object.values(CHARACTER_IDS));
const KNOWN_MAPS = new Set(Object.values(MAP_IDS));

export function createInitialGameState() {
  return {
    version: SAVE_VERSION,
    mode: 'title',
    sceneId: 'foundation',
    field: {
      mapId: MAP_IDS.XISHI_VILLAGE,
      x: 240,
      y: 150,
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
    inventory: { shared: {}, battleCarry: { [CHARACTER_IDS.YOHANI]: [], [CHARACTER_IDS.SANI]: [] } },
    progression: { flags: {} },
  };
}

const isFiniteInt = (value) => Number.isInteger(value) && Number.isFinite(value);
const isPlainObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

export function validateGameState(candidate) {
  if (!isPlainObject(candidate) || candidate.version !== SAVE_VERSION || !isGameMode(candidate.mode)) return null;
  if (!isPlainObject(candidate.field) || !KNOWN_MAPS.has(candidate.field.mapId)) return null;
  if (!Number.isFinite(candidate.field.x) || !Number.isFinite(candidate.field.y)) return null;
  if (!isPlainObject(candidate.party) || !Array.isArray(candidate.party.activeIds) || !Array.isArray(candidate.party.reserveIds)) return null;
  if (candidate.party.activeIds.length < 1 || candidate.party.activeIds.length > 4) return null;

  const active = new Set(candidate.party.activeIds);
  if (active.size !== candidate.party.activeIds.length) return null;
  if ([...active].some((id) => !KNOWN_CHARACTERS.has(id))) return null;
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
  if (!isPlainObject(candidate.inventory) || !isPlainObject(candidate.progression)) return null;

  return structuredClone(candidate);
}
