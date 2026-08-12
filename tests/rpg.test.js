import test from 'node:test';
import assert from 'node:assert/strict';
import { CHARACTER_IDS } from '../src/content/ids.js';
import { maxHpAtLevel, maxMpAtLevel, attackAtLevel, defenseAtLevel, speedOf } from '../src/rpg/stats.js';
import { expThreshold, applyExp } from '../src/rpg/progression.js';
import { calcDefeatMoneyLoss } from '../src/rpg/economy.js';
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
