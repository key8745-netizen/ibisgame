import test from 'node:test';
import assert from 'node:assert/strict';
import { CHARACTER_IDS, ITEM_IDS } from '../src/content/ids.js';
import { OPENING_PHASE } from '../src/content/opening.js';
import { applyOpeningEvent, OPENING_EVENT, resolveM2BattleStub, switchLeader } from '../src/events/opening-director.js';
import { createInitialGameState, validateGameState } from '../src/state/game-state.js';
import { canOccupyVillage, isReverseFlowActive, moveVillagePosition } from '../src/world/village-map.js';

test('opening starts with Yohani delivery and wrapped lunch parcel', () => {
  const state = createInitialGameState();
  assert.equal(state.progression.openingPhase, OPENING_PHASE.DELIVERY);
  assert.equal(state.field.controlledId, CHARACTER_IDS.YOHANI);
  assert.equal(state.inventory.shared[ITEM_IDS.LUNCH_PARCEL], 1);
  assert.equal(isReverseFlowActive(state), false);
});

test('delivery and channel confirmation advance without claiming a cause', () => {
  const state = createInitialGameState();
  assert.equal(applyOpeningEvent(state, OPENING_EVENT.DELIVERED), true);
  assert.equal(state.progression.openingPhase, OPENING_PHASE.CHANNEL);
  assert.equal(state.inventory.shared[ITEM_IDS.LUNCH_PARCEL], undefined);
  assert.equal(applyOpeningEvent(state, OPENING_EVENT.CHANNEL_CONFIRMED), true);
  assert.equal(state.progression.openingPhase, OPENING_PHASE.SOLO_APPROACH);
  assert.equal(state.progression.flags.channelReverseFlowConfirmed, true);
  assert.equal('starRoadCauseKnown' in state.progression.flags, false);
});

test('M2 battle boundary hands solo result to Sani segment without joining her yet', () => {
  const state = createInitialGameState();
  applyOpeningEvent(state, OPENING_EVENT.DELIVERED);
  applyOpeningEvent(state, OPENING_EVENT.CHANNEL_CONFIRMED);
  applyOpeningEvent(state, OPENING_EVENT.SOLO_BATTLE_STARTED);
  assert.equal(state.mode, 'battle');
  assert.equal(resolveM2BattleStub(state), true);
  assert.equal(state.progression.openingPhase, OPENING_PHASE.SANI_STREAM);
  assert.equal(state.field.controlledId, CHARACTER_IDS.SANI);
  assert.deepEqual(state.party.activeIds, [CHARACTER_IDS.YOHANI]);
});

test('convergence joins siblings, then shared battle unlocks leader tutorial', () => {
  const state = createInitialGameState();
  applyOpeningEvent(state, OPENING_EVENT.DELIVERED);
  applyOpeningEvent(state, OPENING_EVENT.CHANNEL_CONFIRMED);
  applyOpeningEvent(state, OPENING_EVENT.SOLO_BATTLE_STARTED);
  resolveM2BattleStub(state);
  applyOpeningEvent(state, OPENING_EVENT.STREAM_CONFIRMED);
  applyOpeningEvent(state, OPENING_EVENT.CLUES_COMPARED);
  assert.deepEqual(state.party.activeIds, [CHARACTER_IDS.YOHANI, CHARACTER_IDS.SANI]);
  assert.equal(state.progression.flags.cluesComparedWithoutCauseClaim, true);
  applyOpeningEvent(state, OPENING_EVENT.SHARED_BATTLE_STARTED);
  resolveM2BattleStub(state);
  assert.equal(state.progression.openingPhase, OPENING_PHASE.LEADER_TUTORIAL);
  assert.equal(state.progression.leaderUnlocked, true);
  assert.equal(state.progression.flags.panickedBeastSubduedAndFled, true);
});

test('required Sani leader switch finishes tutorial and report closes opening without ending reverse flow', () => {
  const state = createInitialGameState();
  applyOpeningEvent(state, OPENING_EVENT.DELIVERED);
  applyOpeningEvent(state, OPENING_EVENT.CHANNEL_CONFIRMED);
  applyOpeningEvent(state, OPENING_EVENT.SOLO_BATTLE_STARTED);
  resolveM2BattleStub(state);
  applyOpeningEvent(state, OPENING_EVENT.STREAM_CONFIRMED);
  applyOpeningEvent(state, OPENING_EVENT.CLUES_COMPARED);
  applyOpeningEvent(state, OPENING_EVENT.SHARED_BATTLE_STARTED);
  resolveM2BattleStub(state);
  assert.equal(switchLeader(state), true);
  assert.equal(state.field.leaderId, CHARACTER_IDS.SANI);
  assert.equal(state.progression.openingPhase, OPENING_PHASE.RETURN);
  applyOpeningEvent(state, OPENING_EVENT.REPORTED_TO_VILLAGE);
  assert.equal(state.progression.openingPhase, OPENING_PHASE.COMPLETE);
  assert.equal(isReverseFlowActive(state), true);
  state.progression.flags.localStarMarkerStabilized = true;
  assert.equal(isReverseFlowActive(state), false);
  assert.ok(validateGameState(state));
});

test('leader switching cannot be used before the shared battle unlock', () => {
  const state = createInitialGameState();
  assert.equal(switchLeader(state), false);
  assert.equal(state.field.leaderId, CHARACTER_IDS.YOHANI);
});

test('village collision blocks water outside bridge and permits bridge crossing', () => {
  assert.equal(canOccupyVillage(420, 280), false);
  assert.equal(canOccupyVillage(420, 220), true);
  const west = { x: 395, y: 220 };
  const crossed = moveVillagePosition(west, 40, 0);
  assert.ok(crossed.x > 405);
});
