import { EQUIPMENT_DEFS, EQUIPMENT_SLOTS } from '../content/equipment-defs.js';

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

// Sum all attackBonus values across a character's equipped items.
export function getAttackBonus(equipment, charId) {
  const slots = equipment?.[charId];
  if (!slots) return 0;
  let bonus = 0;
  for (const itemId of Object.values(slots)) {
    if (itemId) bonus += EQUIPMENT_DEFS[itemId]?.attackBonus ?? 0;
  }
  return bonus;
}

// Sum all defenseBonus values across a character's equipped items.
export function getDefenseBonus(equipment, charId) {
  const slots = equipment?.[charId];
  if (!slots) return 0;
  let bonus = 0;
  for (const itemId of Object.values(slots)) {
    if (itemId) bonus += EQUIPMENT_DEFS[itemId]?.defenseBonus ?? 0;
  }
  return bonus;
}

// Equip itemId on charId. Validates: character known, item known, item slot valid for character,
// item compatible with character. Returns { ok: true, equipment } or { ok: false, reason }.
export function equipItem(equipment, charId, itemId) {
  if (!isPlainObject(equipment)) return { ok: false, reason: 'malformed-source' };
  const charSlots = EQUIPMENT_SLOTS[charId];
  if (!charSlots) return { ok: false, reason: 'unknown-character' };
  const def = EQUIPMENT_DEFS[itemId];
  if (!def) return { ok: false, reason: 'unknown-item' };
  if (!charSlots.includes(def.slot)) return { ok: false, reason: 'incompatible-slot' };
  if (!def.compatibleCharacterIds.includes(charId)) return { ok: false, reason: 'incompatible-character' };
  return {
    ok: true,
    equipment: { ...equipment, [charId]: { ...equipment[charId], [def.slot]: itemId } },
  };
}

// Unequip the item in slot on charId. Validates: character known, slot valid for character.
// Returns { ok: true, equipment } or { ok: false, reason }.
export function unequipItem(equipment, charId, slot) {
  if (!isPlainObject(equipment)) return { ok: false, reason: 'malformed-source' };
  const charSlots = EQUIPMENT_SLOTS[charId];
  if (!charSlots) return { ok: false, reason: 'unknown-character' };
  if (!charSlots.includes(slot)) return { ok: false, reason: 'invalid-slot' };
  return {
    ok: true,
    equipment: { ...equipment, [charId]: { ...equipment[charId], [slot]: null } },
  };
}
