import test from 'node:test';
import assert from 'node:assert/strict';
import { CHARACTER_IDS, ITEM_IDS } from '../src/content/ids.js';
import { maxHpAtLevel, maxMpAtLevel, attackAtLevel, defenseAtLevel, speedOf } from '../src/rpg/stats.js';
import { expThreshold, applyExp } from '../src/rpg/progression.js';
import { calcDefeatMoneyLoss } from '../src/rpg/economy.js';
import { addToSharedInventory, removeFromSharedInventory, consumeBattleCarrySlot, prepareBattleCarry, unprepareBattleCarry } from '../src/rpg/inventory.js';
import { getAttackBonus, getDefenseBonus, equipItem, unequipItem } from '../src/rpg/equipment.js';
import { createInitialGameState, validateGameState, SAVE_VERSION } from '../src/state/game-state.js';
import { SaveStore } from '../src/save/storage.js';

class MemoryStorage {
  constructor() { this.map = new Map(); }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
}

test('maxHpAtLevel returns correct values for both characters', () => {
  assert.equal(maxHpAtLevel(CHARACTER_IDS.YOHANI, 1), 24);
  assert.equal(maxHpAtLevel(CHARACTER_IDS.YOHANI, 2), 30);
  assert.equal(maxHpAtLevel(CHARACTER_IDS.SANI, 1), 18);
  assert.equal(maxHpAtLevel(CHARACTER_IDS.SANI, 2), 22);
});

test('maxMpAtLevel returns correct values for both characters', () => {
  assert.equal(maxMpAtLevel(CHARACTER_IDS.YOHANI, 1), 4);
  assert.equal(maxMpAtLevel(CHARACTER_IDS.YOHANI, 2), 6);
  assert.equal(maxMpAtLevel(CHARACTER_IDS.SANI, 1), 12);
  assert.equal(maxMpAtLevel(CHARACTER_IDS.SANI, 2), 15);
});

test('attackAtLevel and defenseAtLevel scale with level', () => {
  assert.ok(attackAtLevel(CHARACTER_IDS.YOHANI, 2) > attackAtLevel(CHARACTER_IDS.YOHANI, 1));
  assert.ok(defenseAtLevel(CHARACTER_IDS.SANI, 3) > defenseAtLevel(CHARACTER_IDS.SANI, 1));
});

test('speedOf returns character base speed (no level scaling)', () => {
  assert.ok(speedOf(CHARACTER_IDS.SANI) > speedOf(CHARACTER_IDS.YOHANI));  // Sani faster
  assert.equal(speedOf('unknown-id'), 0);
});

test('expThreshold gives EXP needed per level', () => {
  assert.equal(expThreshold(1), 20);  // 20 EXP to go from level 1 to 2
  assert.equal(expThreshold(2), 40);  // 40 EXP to go from level 2 to 3
  assert.ok(expThreshold(2) > expThreshold(1));
});

test('applyExp accumulates without level-up when under threshold', () => {
  const member = { level: 1, exp: 0, hp: 24, mp: 4 };
  const { member: out, leveled } = applyExp(member, 12);
  assert.equal(out.exp, 12);
  assert.equal(out.level, 1);
  assert.equal(leveled, false);
});

test('applyExp triggers level-up when exp meets threshold', () => {
  const member = { level: 1, exp: 15, hp: 24, mp: 4 };
  const { member: out, leveled, levelsGained } = applyExp(member, 10);
  assert.equal(out.level, 2);
  assert.equal(out.exp, 5);   // 25 - threshold(1)=20 = 5 carried over
  assert.equal(leveled, true);
  assert.equal(levelsGained, 1);
});

test('calcDefeatMoneyLoss is floor of 25%', () => {
  assert.equal(calcDefeatMoneyLoss(100), 25);
  assert.equal(calcDefeatMoneyLoss(1), 0);
  assert.equal(calcDefeatMoneyLoss(7), 1);
  assert.equal(calcDefeatMoneyLoss(0), 0);
});

test('SAVE_VERSION is 2', () => {
  assert.equal(SAVE_VERSION, 2);
});

test('v1 save migrates to v2 on read', () => {
  const storage = new MemoryStorage();
  const store = new SaveStore(storage);

  // Construct a minimal v1 save (version=1, no equipment/revivalPoint/pause fields)
  const v1 = {
    version: 1,
    mode: 'field',
    sceneId: 'opening',
    field: { mapId: 'xishi-village', x: 148, y: 356, controlledId: 'yohani', leaderId: 'yohani' },
    party: {
      activeIds: ['yohani'],
      reserveIds: [],
      members: {
        yohani: { level: 1, exp: 0, hp: 24, mp: 4 },
        sani: { level: 1, exp: 0, hp: 18, mp: 12 },
      },
    },
    economy: { money: 42 },
    inventory: { shared: {}, battleCarry: { yohani: [], sani: [] } },
    progression: { openingPhase: 'delivery', leaderUnlocked: false, flags: {} },
    battle: null,
  };
  storage.setItem('ibisgame-jrpg-v1:autosave', JSON.stringify(v1));

  const read = store.readAutosave();
  assert.ok(read);
  assert.equal(read.version, 2);
  assert.equal(read.economy.money, 42);
  assert.ok(read.equipment);
  assert.ok(read.progression.revivalPoint);
});

// ── M3-B: Inventory ──────────────────────────────────────────────────────────

test('addToSharedInventory: creates entry for new item', () => {
  const inv = { shared: {}, battleCarry: {} };
  addToSharedInventory(inv, ITEM_IDS.HEALING_HERB, 2);
  assert.equal(inv.shared[ITEM_IDS.HEALING_HERB], 2);
});

test('addToSharedInventory: accumulates on existing entry', () => {
  const inv = { shared: { [ITEM_IDS.HEALING_HERB]: 3 }, battleCarry: {} };
  addToSharedInventory(inv, ITEM_IDS.HEALING_HERB, 2);
  assert.equal(inv.shared[ITEM_IDS.HEALING_HERB], 5);
});

test('addToSharedInventory: rejects unknown itemId', () => {
  const inv = { shared: {}, battleCarry: {} };
  const ok = addToSharedInventory(inv, 'no-such-item', 1);
  assert.equal(ok, false);
  assert.equal('no-such-item' in inv.shared, false);
});

test('addToSharedInventory: rejects non-positive qty', () => {
  const inv = { shared: {}, battleCarry: {} };
  assert.equal(addToSharedInventory(inv, ITEM_IDS.HEALING_HERB, 0), false);
  assert.equal(addToSharedInventory(inv, ITEM_IDS.HEALING_HERB, -1), false);
  assert.equal(addToSharedInventory(inv, ITEM_IDS.HEALING_HERB, 1.5), false);
});

test('removeFromSharedInventory: decrements count correctly', () => {
  const inv = { shared: { [ITEM_IDS.HEALING_HERB]: 5 }, battleCarry: {} };
  const ok = removeFromSharedInventory(inv, ITEM_IDS.HEALING_HERB, 3);
  assert.equal(ok, true);
  assert.equal(inv.shared[ITEM_IDS.HEALING_HERB], 2);
});

test('removeFromSharedInventory: deletes key when count reaches 0', () => {
  const inv = { shared: { [ITEM_IDS.HEALING_HERB]: 2 }, battleCarry: {} };
  const ok = removeFromSharedInventory(inv, ITEM_IDS.HEALING_HERB, 2);
  assert.equal(ok, true);
  assert.equal(ITEM_IDS.HEALING_HERB in inv.shared, false);
});

test('removeFromSharedInventory: returns false if insufficient quantity', () => {
  const inv = { shared: { [ITEM_IDS.HEALING_HERB]: 1 }, battleCarry: {} };
  const ok = removeFromSharedInventory(inv, ITEM_IDS.HEALING_HERB, 2);
  assert.equal(ok, false);
  assert.equal(inv.shared[ITEM_IDS.HEALING_HERB], 1); // unchanged
});

test('consumeBattleCarrySlot: decrements uses and preserves slot', () => {
  const inv = { shared: {}, battleCarry: { yohani: [{ itemId: ITEM_IDS.HEALING_HERB, uses: 2 }] } };
  const consumed = consumeBattleCarrySlot(inv, 'yohani', 0);
  assert.equal(consumed, ITEM_IDS.HEALING_HERB);
  assert.equal(inv.battleCarry.yohani.length, 1);
  assert.equal(inv.battleCarry.yohani[0].uses, 1);
});

test('consumeBattleCarrySlot: removes slot when uses reach 0', () => {
  const inv = { shared: {}, battleCarry: { yohani: [{ itemId: ITEM_IDS.HEALING_HERB, uses: 1 }] } };
  const consumed = consumeBattleCarrySlot(inv, 'yohani', 0);
  assert.equal(consumed, ITEM_IDS.HEALING_HERB);
  assert.equal(inv.battleCarry.yohani.length, 0);
});

test('consumeBattleCarrySlot: returns null for out-of-range slotIdx', () => {
  const inv = { shared: {}, battleCarry: { yohani: [{ itemId: ITEM_IDS.HEALING_HERB, uses: 1 }] } };
  const consumed = consumeBattleCarrySlot(inv, 'yohani', 5);
  assert.equal(consumed, null);
  assert.equal(inv.battleCarry.yohani.length, 1); // unchanged
});

// ── M3-B: Equipment ───────────────────────────────────────────────────────────

const FULL_EQUIPMENT = {
  yohani: { weapon: null, armor: null, shield: null, accessory: null },
  sani:   { weapon: null, armor: null, focus:  null, accessory: null },
};

test('getAttackBonus: returns 0 for all-null equipment', () => {
  assert.equal(getAttackBonus(FULL_EQUIPMENT, CHARACTER_IDS.YOHANI), 0);
});

test('getDefenseBonus: returns 0 for all-null equipment', () => {
  assert.equal(getDefenseBonus(FULL_EQUIPMENT, CHARACTER_IDS.SANI), 0);
});

test('getAttackBonus: returns weapon attackBonus when weapon equipped', () => {
  const equipment = { yohani: { weapon: 'crude-blade', armor: null, shield: null, accessory: null } };
  assert.equal(getAttackBonus(equipment, CHARACTER_IDS.YOHANI), 2);
});

test('getDefenseBonus: sums bonuses from multiple slots', () => {
  const equipment = { yohani: { weapon: null, armor: null, shield: 'iron-shield', accessory: null } };
  assert.equal(getDefenseBonus(equipment, CHARACTER_IDS.YOHANI), 3);
});

test('getDefenseBonus: returns 0 for unknown item ID in slot', () => {
  const equipment = { yohani: { weapon: 'no-such-item', armor: null, shield: null, accessory: null } };
  assert.equal(getDefenseBonus(equipment, CHARACTER_IDS.YOHANI), 0);
});

test('equipItem: equips item to correct slot and returns new equipment', () => {
  const { ok, equipment: updated } = equipItem(FULL_EQUIPMENT, CHARACTER_IDS.YOHANI, 'crude-blade');
  assert.equal(ok, true);
  assert.equal(updated.yohani.weapon, 'crude-blade');
  assert.equal(FULL_EQUIPMENT.yohani.weapon, null); // original unchanged
});

test('equipItem: Sani can equip focus-crystal to focus slot', () => {
  const { ok, equipment: updated } = equipItem(FULL_EQUIPMENT, CHARACTER_IDS.SANI, 'focus-crystal');
  assert.equal(ok, true);
  assert.equal(updated.sani.focus, 'focus-crystal');
});

test('equipItem: rejects unknown item', () => {
  const { ok, reason } = equipItem(FULL_EQUIPMENT, CHARACTER_IDS.YOHANI, 'no-such-item');
  assert.equal(ok, false);
  assert.equal(reason, 'unknown-item');
});

test('equipItem: rejects unknown character', () => {
  const { ok, reason } = equipItem(FULL_EQUIPMENT, 'unknown-char', 'crude-blade');
  assert.equal(ok, false);
  assert.equal(reason, 'unknown-character');
});

test('equipItem: rejects focus-crystal on Yohani (incompatible-slot: Yohani has no focus slot)', () => {
  const { ok, reason } = equipItem(FULL_EQUIPMENT, CHARACTER_IDS.YOHANI, 'focus-crystal');
  assert.equal(ok, false);
  assert.equal(reason, 'incompatible-slot');
});

test('equipItem: rejects iron-shield on Sani (incompatible slot — Sani has focus not shield)', () => {
  const { ok, reason } = equipItem(FULL_EQUIPMENT, CHARACTER_IDS.SANI, 'iron-shield');
  assert.equal(ok, false);
  assert.equal(reason, 'incompatible-slot');
});

test('unequipItem: clears slot and returns new equipment', () => {
  const equipped = { yohani: { weapon: 'crude-blade', armor: null, shield: null, accessory: null }, sani: { weapon: null, armor: null, focus: null, accessory: null } };
  const { ok, equipment: updated } = unequipItem(equipped, CHARACTER_IDS.YOHANI, 'weapon');
  assert.equal(ok, true);
  assert.equal(updated.yohani.weapon, null);
  assert.equal(equipped.yohani.weapon, 'crude-blade'); // original unchanged
});

test('unequipItem: rejects invalid slot for character', () => {
  const { ok, reason } = unequipItem(FULL_EQUIPMENT, CHARACTER_IDS.YOHANI, 'focus');
  assert.equal(ok, false);
  assert.equal(reason, 'invalid-slot');
});

test('unequipItem: rejects unknown character', () => {
  const { ok, reason } = unequipItem(FULL_EQUIPMENT, 'unknown-char', 'weapon');
  assert.equal(ok, false);
  assert.equal(reason, 'unknown-character');
});

// ── M3-B: prepareBattleCarry / unprepareBattleCarry ──────────────────────────

test('prepareBattleCarry: transfers uses from shared to carry', () => {
  const inv = {
    shared: { [ITEM_IDS.HEALING_HERB]: 3 },
    battleCarry: { [CHARACTER_IDS.YOHANI]: [], [CHARACTER_IDS.SANI]: [] },
  };
  const ok = prepareBattleCarry(inv, CHARACTER_IDS.YOHANI, ITEM_IDS.HEALING_HERB, 2);
  assert.equal(ok, true);
  assert.equal(inv.shared[ITEM_IDS.HEALING_HERB], 1); // 3 - 2 = 1 remaining in shared
  assert.equal(inv.battleCarry[CHARACTER_IDS.YOHANI].length, 1);
  assert.equal(inv.battleCarry[CHARACTER_IDS.YOHANI][0].itemId, ITEM_IDS.HEALING_HERB);
  assert.equal(inv.battleCarry[CHARACTER_IDS.YOHANI][0].uses, 2);
});

test('prepareBattleCarry: deletes shared key when all transferred', () => {
  const inv = {
    shared: { [ITEM_IDS.HEALING_HERB]: 1 },
    battleCarry: { [CHARACTER_IDS.YOHANI]: [], [CHARACTER_IDS.SANI]: [] },
  };
  prepareBattleCarry(inv, CHARACTER_IDS.YOHANI, ITEM_IDS.HEALING_HERB, 1);
  assert.equal(ITEM_IDS.HEALING_HERB in inv.shared, false);
});

test('prepareBattleCarry: returns false if insufficient shared quantity', () => {
  const inv = {
    shared: { [ITEM_IDS.HEALING_HERB]: 1 },
    battleCarry: { [CHARACTER_IDS.YOHANI]: [], [CHARACTER_IDS.SANI]: [] },
  };
  const ok = prepareBattleCarry(inv, CHARACTER_IDS.YOHANI, ITEM_IDS.HEALING_HERB, 2);
  assert.equal(ok, false);
  assert.equal(inv.shared[ITEM_IDS.HEALING_HERB], 1); // unchanged
  assert.equal(inv.battleCarry[CHARACTER_IDS.YOHANI].length, 0);
});

test('prepareBattleCarry: returns false if carry is full (3 slots)', () => {
  const inv = {
    shared: { [ITEM_IDS.HEALING_HERB]: 5 },
    battleCarry: {
      [CHARACTER_IDS.YOHANI]: [
        { itemId: ITEM_IDS.HEALING_HERB, uses: 1 },
        { itemId: ITEM_IDS.HEALING_HERB, uses: 1 },
        { itemId: ITEM_IDS.HEALING_HERB, uses: 1 },
      ],
      [CHARACTER_IDS.SANI]: [],
    },
  };
  const ok = prepareBattleCarry(inv, CHARACTER_IDS.YOHANI, ITEM_IDS.HEALING_HERB, 1);
  assert.equal(ok, false);
});

test('prepareBattleCarry: rejects non-battle item (LUNCH_PARCEL)', () => {
  const inv = {
    shared: { [ITEM_IDS.LUNCH_PARCEL]: 1 },
    battleCarry: { [CHARACTER_IDS.YOHANI]: [], [CHARACTER_IDS.SANI]: [] },
  };
  const ok = prepareBattleCarry(inv, CHARACTER_IDS.YOHANI, ITEM_IDS.LUNCH_PARCEL, 1);
  assert.equal(ok, false);
  assert.equal(inv.shared[ITEM_IDS.LUNCH_PARCEL], 1); // unchanged
});

test('prepareBattleCarry: rejects uses out of range (0, 3)', () => {
  const inv = {
    shared: { [ITEM_IDS.HEALING_HERB]: 5 },
    battleCarry: { [CHARACTER_IDS.YOHANI]: [], [CHARACTER_IDS.SANI]: [] },
  };
  assert.equal(prepareBattleCarry(inv, CHARACTER_IDS.YOHANI, ITEM_IDS.HEALING_HERB, 0), false);
  assert.equal(prepareBattleCarry(inv, CHARACTER_IDS.YOHANI, ITEM_IDS.HEALING_HERB, 3), false);
});

test('unprepareBattleCarry: returns slot uses to shared inventory', () => {
  const inv = {
    shared: {},
    battleCarry: {
      [CHARACTER_IDS.YOHANI]: [{ itemId: ITEM_IDS.HEALING_HERB, uses: 2 }],
      [CHARACTER_IDS.SANI]: [],
    },
  };
  const ok = unprepareBattleCarry(inv, CHARACTER_IDS.YOHANI, 0);
  assert.equal(ok, true);
  assert.equal(inv.shared[ITEM_IDS.HEALING_HERB], 2); // 2 uses returned to shared
  assert.equal(inv.battleCarry[CHARACTER_IDS.YOHANI].length, 0); // slot removed
});

test('unprepareBattleCarry: returns false for out-of-range slotIdx', () => {
  const inv = {
    shared: {},
    battleCarry: { [CHARACTER_IDS.YOHANI]: [{ itemId: ITEM_IDS.HEALING_HERB, uses: 1 }], [CHARACTER_IDS.SANI]: [] },
  };
  assert.equal(unprepareBattleCarry(inv, CHARACTER_IDS.YOHANI, 5), false);
  assert.equal(inv.battleCarry[CHARACTER_IDS.YOHANI].length, 1); // unchanged
});

// ── M3-B: unknown-character boundary (Patch 2 closure) ───────────────────────

test('prepareBattleCarry: returns false for unknown charId', () => {
  const inv = {
    shared: { [ITEM_IDS.HEALING_HERB]: 3 },
    battleCarry: { [CHARACTER_IDS.YOHANI]: [], [CHARACTER_IDS.SANI]: [] },
  };
  const ok = prepareBattleCarry(inv, 'unknown-char', ITEM_IDS.HEALING_HERB, 1);
  assert.equal(ok, false);
  assert.equal(inv.shared[ITEM_IDS.HEALING_HERB], 3); // shared inventory unchanged
});

test('unprepareBattleCarry: returns false for unknown charId', () => {
  const inv = {
    shared: {},
    battleCarry: {
      [CHARACTER_IDS.YOHANI]: [{ itemId: ITEM_IDS.HEALING_HERB, uses: 1 }],
      [CHARACTER_IDS.SANI]: [],
    },
  };
  const ok = unprepareBattleCarry(inv, 'unknown-char', 0);
  assert.equal(ok, false);
  assert.equal(inv.battleCarry[CHARACTER_IDS.YOHANI].length, 1); // unchanged
});

// ── M3-B: equipment malformed-source precondition (Patch 2 closure) ──────────

test('equipItem: returns malformed-source for null equipment', () => {
  const { ok, reason } = equipItem(null, CHARACTER_IDS.YOHANI, 'crude-blade');
  assert.equal(ok, false);
  assert.equal(reason, 'malformed-source');
});

test('unequipItem: returns malformed-source for null equipment', () => {
  const { ok, reason } = unequipItem(null, CHARACTER_IDS.YOHANI, 'weapon');
  assert.equal(ok, false);
  assert.equal(reason, 'malformed-source');
});
