import { CHARACTER_IDS } from '../content/ids.js';
import { ITEM_DEFS } from '../content/items.js';

const KNOWN_CHARACTERS = new Set(Object.values(CHARACTER_IDS));

// Inventory management for shared inventory and battle carry.
// All functions operate on a mutable inventory object (caller's structuredClone).
// Input validation: unknown itemId or invalid qty returns false without mutating state.

const isPositiveInt = (v) => Number.isInteger(v) && v > 0;

// Add qty of itemId to shared inventory.
// Returns true on success, false if itemId is unknown or qty is invalid.
export function addToSharedInventory(inventory, itemId, qty = 1) {
  if (!isPositiveInt(qty)) return false;
  if (typeof itemId !== 'string' || !ITEM_DEFS[itemId]) return false;
  inventory.shared[itemId] = (inventory.shared[itemId] ?? 0) + qty;
  return true;
}

// Remove qty of itemId from shared inventory.
// Returns true if successful, false if insufficient quantity or inputs invalid.
export function removeFromSharedInventory(inventory, itemId, qty = 1) {
  if (!isPositiveInt(qty)) return false;
  if (typeof itemId !== 'string' || !ITEM_DEFS[itemId]) return false;
  const current = inventory.shared[itemId] ?? 0;
  if (current < qty) return false;
  if (current === qty) {
    delete inventory.shared[itemId];
  } else {
    inventory.shared[itemId] = current - qty;
  }
  return true;
}

// Consume one use of the item at slotIdx in charId's battle carry.
// Removes the slot from the array when uses reach 0.
// Returns the itemId consumed, or null if the slot is invalid or empty.
export function consumeBattleCarrySlot(inventory, charId, slotIdx) {
  if (!KNOWN_CHARACTERS.has(charId)) return null;
  const carry = inventory.battleCarry[charId];
  if (!carry) return null;
  const slot = carry[slotIdx];
  if (!slot || slot.uses <= 0) return null;
  const itemId = slot.itemId;
  slot.uses -= 1;
  if (slot.uses === 0) carry.splice(slotIdx, 1);
  return itemId;
}

// Transfer `uses` prepared uses of a battle-eligible item from shared to charId's carry.
// uses must be 1 or 2. Carry must have room (< 3 slots). Shared must have enough.
// Returns true on success, false on any validation failure.
export function prepareBattleCarry(inventory, charId, itemId, uses) {
  if (!KNOWN_CHARACTERS.has(charId)) return false;
  if (!Number.isInteger(uses) || uses < 1 || uses > 2) return false;
  if (typeof itemId !== 'string') return false;
  const def = ITEM_DEFS[itemId];
  if (!def || def.battleTarget === null) return false;
  const carry = inventory.battleCarry?.[charId];
  if (!Array.isArray(carry)) return false;
  if (carry.length >= 3) return false;
  const available = inventory.shared[itemId] ?? 0;
  if (available < uses) return false;
  if (available === uses) {
    delete inventory.shared[itemId];
  } else {
    inventory.shared[itemId] = available - uses;
  }
  carry.push({ itemId, uses });
  return true;
}

// Return remaining uses from slotIdx in charId's carry back to shared inventory.
// Returns true on success, false if slot index is invalid.
export function unprepareBattleCarry(inventory, charId, slotIdx) {
  if (!KNOWN_CHARACTERS.has(charId)) return false;
  const carry = inventory.battleCarry?.[charId];
  if (!Array.isArray(carry)) return false;
  if (!Number.isInteger(slotIdx) || slotIdx < 0 || slotIdx >= carry.length) return false;
  const slot = carry[slotIdx];
  if (!slot) return false;
  inventory.shared[slot.itemId] = (inventory.shared[slot.itemId] ?? 0) + slot.uses;
  carry.splice(slotIdx, 1);
  return true;
}
