import { ABILITY_IDS, CHARACTER_IDS } from '../content/ids.js';

export const COMMAND_TYPES = Object.freeze({
  ATTACK: 'attack',
  DEFEND: 'defend',
  ABILITY: 'ability',
  ITEM: 'item',
  RUN: 'run',
});

const KNOWN_ABILITY_IDS = new Set(Object.values(ABILITY_IDS));
const YOHANI_ABILITIES = new Set([ABILITY_IDS.GUARD_AID]);
const SANI_ABILITIES = new Set([ABILITY_IDS.STAR_FLAME, ABILITY_IDS.MINOR_HEAL]);

// Which abilities target enemies vs. allies
const ENEMY_TARGETED_ABILITIES = new Set([ABILITY_IDS.STAR_FLAME]);
const ALLY_TARGETED_ABILITIES = new Set([ABILITY_IDS.GUARD_AID, ABILITY_IDS.MINOR_HEAL]);
const TARGETED_ABILITIES = new Set([...ENEMY_TARGETED_ABILITIES, ...ALLY_TARGETED_ABILITIES]);

// MP cost per ability
export const ABILITY_MP_COST = Object.freeze({
  [ABILITY_IDS.STAR_FLAME]: 3,
  [ABILITY_IDS.MINOR_HEAL]: 4,
  [ABILITY_IDS.GUARD_AID]: 0,
});

const RUN_ALLOWED_CONTEXTS = new Set(['random']);

function isNonNegInt(v) { return Number.isInteger(v) && v >= 0; }

// battleCtx shape (all fields optional; omit for pure structural validation):
// {
//   context: string,          // battle context ('random' | 'authored-solo' | ...)
//   mp: number,               // current MP of the acting character
//   enemies: {hp, maxHp}[],  // current enemy states for range/alive checks
//   partyIds: string[],       // party members for ally target range checks
// }
export function validateCommand(command, characterId, battleCtx) {
  if (!command || typeof command.type !== 'string') return false;

  const ctx = battleCtx?.context;
  const mp = battleCtx?.mp ?? Infinity;
  const enemies = battleCtx?.enemies ?? [];
  const partyIds = battleCtx?.partyIds ?? [];

  switch (command.type) {
    case COMMAND_TYPES.ATTACK: {
      if (!isNonNegInt(command.targetIdx)) return false;
      if (enemies.length > 0) {
        if (command.targetIdx >= enemies.length) return false;
        if (enemies[command.targetIdx]?.hp <= 0) return false;
      }
      return true;
    }
    case COMMAND_TYPES.DEFEND:
      return true;
    case COMMAND_TYPES.ABILITY: {
      if (!KNOWN_ABILITY_IDS.has(command.abilityId)) return false;
      if (YOHANI_ABILITIES.has(command.abilityId) && characterId !== CHARACTER_IDS.YOHANI) return false;
      if (SANI_ABILITIES.has(command.abilityId) && characterId !== CHARACTER_IDS.SANI) return false;

      const cost = ABILITY_MP_COST[command.abilityId] ?? 0;
      if (mp < cost) return false;

      if (TARGETED_ABILITIES.has(command.abilityId)) {
        if (!isNonNegInt(command.targetIdx)) return false;
        if (ENEMY_TARGETED_ABILITIES.has(command.abilityId) && enemies.length > 0) {
          if (command.targetIdx >= enemies.length) return false;
          if (enemies[command.targetIdx]?.hp <= 0) return false;
        }
        if (ALLY_TARGETED_ABILITIES.has(command.abilityId) && partyIds.length > 0) {
          if (command.targetIdx >= partyIds.length) return false;
        }
      }
      return true;
    }
    case COMMAND_TYPES.ITEM:
      return isNonNegInt(command.slotIdx);
    case COMMAND_TYPES.RUN:
      // Requires explicit context — silently omitting context is NOT allowed
      if (!ctx || !RUN_ALLOWED_CONTEXTS.has(ctx)) return false;
      return true;
    default:
      return false;
  }
}
