import { ITEM_IDS } from './ids.js';

// Item definitions for battle use.
// battleTarget: 'ally' → can target any party member in battle
//               null   → not usable in battle (key item / field-only)
// healHp: flat HP restore applied to target when used
export const ITEM_DEFS = Object.freeze({
  [ITEM_IDS.LUNCH_PARCEL]: Object.freeze({
    id: ITEM_IDS.LUNCH_PARCEL,
    battleTarget: 'ally',
    healHp: 12,
  }),
  [ITEM_IDS.INSCRIBED_STONE_FRAGMENT]: Object.freeze({
    id: ITEM_IDS.INSCRIBED_STONE_FRAGMENT,
    battleTarget: null,
  }),
});
