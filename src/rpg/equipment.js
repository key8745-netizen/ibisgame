import { EQUIPMENT_DEFS } from '../content/equipment-defs.js';

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

// Return a new equipment object with slot updated to itemId (pass null to unequip).
// Does not validate slot name or item ID — caller responsibility.
export function setEquipmentSlot(equipment, charId, slot, itemId) {
  return {
    ...equipment,
    [charId]: { ...equipment[charId], [slot]: itemId },
  };
}
