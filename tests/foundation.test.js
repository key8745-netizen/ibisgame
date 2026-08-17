import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialGameState, validateGameState } from '../src/state/game-state.js';
import { MANUAL_SLOT_COUNT, SaveStore } from '../src/save/storage.js';

class MemoryStorage {
  constructor() { this.map = new Map(); }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
}

test('initial state is valid and starts with Yohani as sole active member', () => {
  const state = createInitialGameState();
  const valid = validateGameState(state);
  assert.ok(valid);
  assert.deepEqual(valid.party.activeIds, ['yohani']);
  assert.equal(valid.field.leaderId, 'yohani');
});

test('validator rejects invalid mode and invalid active leader', () => {
  const badMode = createInitialGameState();
  badMode.mode = 'hidden-dom-mode';
  assert.equal(validateGameState(badMode), null);

  const badLeader = createInitialGameState();
  badLeader.field.leaderId = 'sani';
  assert.equal(validateGameState(badLeader), null);
});

test('validator rejects non-finite coordinates and negative money', () => {
  const badPosition = createInitialGameState();
  badPosition.field.x = Infinity;
  assert.equal(validateGameState(badPosition), null);

  const badMoney = createInitialGameState();
  badMoney.economy.money = -1;
  assert.equal(validateGameState(badMoney), null);
});

test('manual save slots round-trip validated state', () => {
  const storage = new MemoryStorage();
  const store = new SaveStore(storage);
  const state = createInitialGameState();
  state.economy.money = 12;

  for (let slot = 0; slot < MANUAL_SLOT_COUNT; slot += 1) {
    assert.equal(store.writeManual(slot, state), true);
    assert.equal(store.readManual(slot).economy.money, 12);
  }
  assert.throws(() => store.writeManual(3, state), RangeError);
});

test('malformed or wrong-version save data is rejected', () => {
  const storage = new MemoryStorage();
  const store = new SaveStore(storage);
  storage.setItem('ibisgame-jrpg-v1:autosave', '{broken');
  assert.equal(store.readAutosave(), null);

  const wrong = createInitialGameState();
  wrong.version = 999;
  storage.setItem('ibisgame-jrpg-v1:suspend', JSON.stringify(wrong));
  assert.equal(store.readSuspend(), null);
});
