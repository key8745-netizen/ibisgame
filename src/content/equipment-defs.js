import { CHARACTER_IDS } from './ids.js';

// Equipment item stat bonuses. Keys are equipment item ID strings stored in
// equipment slots. attackBonus / defenseBonus: flat additions to base stats.
//
// Items listed here are vertical-slice entries for system verification.
// Content-canon equipment becomes acquirable in M4+; new items are added here
// as they enter the acquisition pool.
export const EQUIPMENT_DEFS = Object.freeze({
  'crude-blade':   Object.freeze({ attackBonus: 2, defenseBonus: 0 }),
  'iron-shield':   Object.freeze({ attackBonus: 0, defenseBonus: 3 }),
  'focus-crystal': Object.freeze({ attackBonus: 0, defenseBonus: 1 }),
});

// Valid equipment slot names per character. Used by equipment.js for slot iteration.
export const EQUIPMENT_SLOTS = Object.freeze({
  [CHARACTER_IDS.YOHANI]: Object.freeze(['weapon', 'armor', 'shield', 'accessory']),
  [CHARACTER_IDS.SANI]:   Object.freeze(['weapon', 'armor', 'focus',  'accessory']),
});
