// Inventory management for shared inventory and battle carry.
// All functions operate on a mutable inventory object (caller's structuredClone).

// Add qty of itemId to shared inventory.
export function addToSharedInventory(inventory, itemId, qty = 1) {
  inventory.shared[itemId] = (inventory.shared[itemId] ?? 0) + qty;
}

// Remove qty of itemId from shared inventory.
// Returns true if successful, false if insufficient quantity.
export function removeFromSharedInventory(inventory, itemId, qty = 1) {
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
  const carry = inventory.battleCarry[charId];
  if (!carry) return null;
  const slot = carry[slotIdx];
  if (!slot || slot.uses <= 0) return null;
  const itemId = slot.itemId;
  slot.uses -= 1;
  if (slot.uses === 0) carry.splice(slotIdx, 1);
  return itemId;
}
