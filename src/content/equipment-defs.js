import { CHARACTER_IDS } from './ids.js';

// Equipment item definitions. Each entry includes:
//   id: string matching its key
//   slot: which equipment slot type this item occupies
//   compatibleCharacterIds: characters that can equip this item
//   attackBonus / defenseBonus: flat additions to base stats
//
// Vertical-slice entries for system verification; acquirable content from M4+.
export const EQUIPMENT_DEFS = Object.freeze({
  'crude-blade': Object.freeze({
    id: 'crude-blade',
    slot: 'weapon',
    compatibleCharacterIds: Object.freeze([CHARACTER_IDS.YOHANI, CHARACTER_IDS.SANI]),
    attackBonus: 2,
    defenseBonus: 0,
  }),
  'iron-shield': Object.freeze({
    id: 'iron-shield',
    slot: 'shield',
    compatibleCharacterIds: Object.freeze([CHARACTER_IDS.YOHANI]),
    attackBonus: 0,
    defenseBonus: 3,
  }),
  'focus-crystal': Object.freeze({
    id: 'focus-crystal',
    slot: 'focus',
    compatibleCharacterIds: Object.freeze([CHARACTER_IDS.SANI]),
    attackBonus: 0,
    defenseBonus: 1,
  }),
});

// Canonical set of all known equipment item IDs.
export const EQUIPMENT_IDS = Object.freeze(Object.keys(EQUIPMENT_DEFS));

// Valid equipment slot names per character. Used by equipment.js for slot iteration and validation.
export const EQUIPMENT_SLOTS = Object.freeze({
  [CHARACTER_IDS.YOHANI]: Object.freeze(['weapon', 'armor', 'shield', 'accessory']),
  [CHARACTER_IDS.SANI]:   Object.freeze(['weapon', 'armor', 'focus',  'accessory']),
});
