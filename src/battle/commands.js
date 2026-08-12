import { ABILITY_IDS, CHARACTER_IDS } from '../content/ids.js';

export const COMMAND_TYPES = Object.freeze({
  ATTACK: 'attack',
  DEFEND: 'defend',
  ABILITY: 'ability',
  ITEM: 'item',
});

const KNOWN_ABILITY_IDS = new Set(Object.values(ABILITY_IDS));
const YOHANI_ABILITIES = new Set([ABILITY_IDS.GUARD_AID, ABILITY_IDS.STAR_FLAME]);
const SANI_ABILITIES = new Set([ABILITY_IDS.MINOR_HEAL]);
const TARGETED_ABILITIES = new Set([ABILITY_IDS.GUARD_AID, ABILITY_IDS.STAR_FLAME, ABILITY_IDS.MINOR_HEAL]);

function isNonNegInt(v) { return Number.isInteger(v) && v >= 0; }

export function validateCommand(command, characterId) {
  if (!command || typeof command.type !== 'string') return false;
  switch (command.type) {
    case COMMAND_TYPES.ATTACK:
      return isNonNegInt(command.targetIdx);
    case COMMAND_TYPES.DEFEND:
      return true;
    case COMMAND_TYPES.ABILITY: {
      if (!KNOWN_ABILITY_IDS.has(command.abilityId)) return false;
      if (YOHANI_ABILITIES.has(command.abilityId) && characterId !== CHARACTER_IDS.YOHANI) return false;
      if (SANI_ABILITIES.has(command.abilityId) && characterId !== CHARACTER_IDS.SANI) return false;
      if (TARGETED_ABILITIES.has(command.abilityId)) return isNonNegInt(command.targetIdx);
      return true;
    }
    case COMMAND_TYPES.ITEM:
      return isNonNegInt(command.slotIdx);
    default:
      return false;
  }
}
