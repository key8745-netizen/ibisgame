import { ITEM_IDS } from './ids.js';

// Item definitions.
// battleTarget: 'ally' → usable in battle, targets a party member
//               null   → not usable in battle (key item / field-only)
// healHp: flat HP restore applied to target when used in battle
export const ITEM_DEFS = Object.freeze({
  [ITEM_IDS.LUNCH_PARCEL]: Object.freeze({
    id: ITEM_IDS.LUNCH_PARCEL,
    battleTarget: null, // quest item — NOT battle-eligible (LOCKED)
  }),
  [ITEM_IDS.INSCRIBED_STONE_FRAGMENT]: Object.freeze({
    id: ITEM_IDS.INSCRIBED_STONE_FRAGMENT,
    battleTarget: null,
  }),
  [ITEM_IDS.HEALING_HERB]: Object.freeze({
    id: ITEM_IDS.HEALING_HERB,
    battleTarget: 'ally',
    healHp: 12,
  }),
});
