import test from 'node:test';
import assert from 'node:assert/strict';
import { ABILITY_IDS, CHARACTER_IDS } from '../src/content/ids.js';
import { OPENING_ENCOUNTERS } from '../src/content/opening.js';
import { createBattleEntry } from '../src/battle/battle-state.js';
import { COMMAND_TYPES, validateCommand } from '../src/battle/commands.js';
import { resolveRound } from '../src/battle/resolver.js';
import { createInitialGameState, validateGameState } from '../src/state/game-state.js';

const SOLO_ENC = OPENING_ENCOUNTERS.SOLO.id;
const SHARED_ENC = OPENING_ENCOUNTERS.SHARED.id;
const ATK0 = { type: COMMAND_TYPES.ATTACK, targetIdx: 0 };
const DEFEND = { type: COMMAND_TYPES.DEFEND };

function makeSoloState(seed = 42) {
  const state = createInitialGameState();
  state.mode = 'battle';
  state.battle = createBattleEntry(SOLO_ENC, seed);
  return state;
}

function makeSharedState(seed = 42) {
  const state = createInitialGameState();
  state.mode = 'battle';
  state.party.activeIds = [CHARACTER_IDS.YOHANI, CHARACTER_IDS.SANI];
  state.battle = createBattleEntry(SHARED_ENC, seed);
  return state;
}

// ── createBattleEntry ────────────────────────────────────────────────────────

test('createBattleEntry solo: creates command-selection phase with correct shape', () => {
  const b = createBattleEntry(SOLO_ENC, 1);
  assert.equal(b.phase, 'command-selection');
  assert.equal(b.context, 'authored-solo');
  assert.deepEqual(b.partyIds, [CHARACTER_IDS.YOHANI]);
  assert.equal(b.round, 1);
  assert.equal(b.pendingCommands[CHARACTER_IDS.YOHANI], null);
  assert.equal(b.enemies.length, 1);
  assert.equal(b.enemies[0].hp, b.enemies[0].maxHp);
});

test('createBattleEntry shared: partyIds includes both characters', () => {
  const b = createBattleEntry(SHARED_ENC, 1);
  assert.deepEqual(b.partyIds, [CHARACTER_IDS.YOHANI, CHARACTER_IDS.SANI]);
  assert.equal(b.context, 'authored-shared');
  assert.equal(b.pendingCommands[CHARACTER_IDS.YOHANI], null);
  assert.equal(b.pendingCommands[CHARACTER_IDS.SANI], null);
});

test('createBattleEntry throws RangeError for unknown encounterId', () => {
  assert.throws(() => createBattleEntry('nonexistent-encounter'), RangeError);
});

// ── validateGameState — battle schema ────────────────────────────────────────

test('validateGameState accepts valid solo battle state', () => {
  const state = makeSoloState();
  assert.ok(validateGameState(state));
});

test('validateGameState accepts valid shared battle state', () => {
  const state = makeSharedState();
  assert.ok(validateGameState(state));
});

test('validateGameState rejects battle.phase = resolving', () => {
  const state = makeSoloState();
  state.battle.phase = 'resolving';
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects pendingCommands keys differing from partyIds', () => {
  const state = makeSoloState();
  state.battle.pendingCommands[CHARACTER_IDS.SANI] = null;  // extra key
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects authored-solo with two-member partyIds', () => {
  const state = makeSoloState();
  state.battle.partyIds = [CHARACTER_IDS.YOHANI, CHARACTER_IDS.SANI];
  state.battle.pendingCommands[CHARACTER_IDS.SANI] = null;
  assert.equal(validateGameState(state), null);
});

// ── validateCommand ──────────────────────────────────────────────────────────

test('validateCommand accepts attack with targetIdx', () => {
  assert.ok(validateCommand({ type: COMMAND_TYPES.ATTACK, targetIdx: 0 }, CHARACTER_IDS.YOHANI));
});

test('validateCommand rejects attack missing targetIdx', () => {
  assert.equal(validateCommand({ type: COMMAND_TYPES.ATTACK }, CHARACTER_IDS.YOHANI), false);
});

test('validateCommand accepts defend for any character', () => {
  assert.ok(validateCommand(DEFEND, CHARACTER_IDS.YOHANI));
  assert.ok(validateCommand(DEFEND, CHARACTER_IDS.SANI));
});

test('validateCommand accepts guard-aid for Yohani with targetIdx', () => {
  const cmd = { type: COMMAND_TYPES.ABILITY, abilityId: ABILITY_IDS.GUARD_AID, targetIdx: 1 };
  assert.ok(validateCommand(cmd, CHARACTER_IDS.YOHANI));
});

test('validateCommand rejects guard-aid for Sani', () => {
  const cmd = { type: COMMAND_TYPES.ABILITY, abilityId: ABILITY_IDS.GUARD_AID, targetIdx: 0 };
  assert.equal(validateCommand(cmd, CHARACTER_IDS.SANI), false);
});

test('validateCommand accepts minor-heal for Sani with targetIdx', () => {
  const cmd = { type: COMMAND_TYPES.ABILITY, abilityId: ABILITY_IDS.MINOR_HEAL, targetIdx: 0 };
  assert.ok(validateCommand(cmd, CHARACTER_IDS.SANI));
});

// ── resolveRound — phase/precondition guards ─────────────────────────────────

test('resolveRound returns invalid-phase when phase is complete', () => {
  const state = makeSoloState();
  state.battle.phase = 'complete';
  const r = resolveRound(state);
  assert.equal(r.ok, false);
  assert.equal(r.result, 'invalid-phase');
});

test('resolveRound returns precondition-failed when commands not all filled', () => {
  const state = makeSoloState();
  // pendingCommands.yohani is null — not filled
  const r = resolveRound(state);
  assert.equal(r.ok, false);
  assert.equal(r.result, 'precondition-failed');
});

// ── resolveRound — round outcomes ────────────────────────────────────────────

test('resolveRound outcome=ongoing when enemy survives and advances to round 2', () => {
  const state = makeSoloState(42);
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.equal(r.roundResult.outcome, 'ongoing');
  assert.equal(r.nextGameState.battle.round, 2);
  assert.equal(r.nextGameState.battle.phase, 'command-selection');
  assert.equal(r.nextGameState.battle.pendingCommands[CHARACTER_IDS.YOHANI], null);
});

test('resolveRound outcome=victory when enemy HP reaches zero', () => {
  const state = makeSoloState(42);
  state.battle.enemies[0].hp = 1;  // one hit kills it
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.equal(r.roundResult.outcome, 'victory');
  assert.equal(r.nextGameState.battle.phase, 'complete');
});

test('victory applies EXP reward to party members in partyIds', () => {
  const state = makeSoloState(42);
  state.battle.enemies[0].hp = 1;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.equal(r.roundResult.outcome, 'victory');
  // Crown-ear-beast gives 12 EXP; Yohani starts at 0 EXP
  assert.equal(r.nextGameState.party.members[CHARACTER_IDS.YOHANI].exp, 12);
});

test('resolveRound outcome=defeat when all party members reach 0 HP', () => {
  const state = makeSoloState(42);
  // Yohani at 1 HP; enemy attack always deals ≥1 damage → lethal
  state.party.members[CHARACTER_IDS.YOHANI].hp = 1;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0;  // Yohani attacks first but cannot one-shot 18 HP beast
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.equal(r.roundResult.outcome, 'defeat');
  assert.equal(r.nextGameState.battle.phase, 'complete');
});

test('defeat applies 25% money loss and restores HP/MP to full', () => {
  const state = makeSoloState(42);
  state.economy.money = 100;
  state.party.members[CHARACTER_IDS.YOHANI].hp = 1;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.equal(r.roundResult.outcome, 'defeat');
  assert.equal(r.nextGameState.economy.money, 75);         // 100 - floor(100*0.25) = 75
  assert.equal(r.nextGameState.party.members[CHARACTER_IDS.YOHANI].hp, 24);  // maxHp at level 1
  assert.equal(r.nextGameState.party.members[CHARACTER_IDS.YOHANI].mp, 4);   // maxMp at level 1
});

// ── resolveRound — guard-aid interception ────────────────────────────────────

test('guard-aid redirects enemy attack away from guarded ally', () => {
  // With seed=1 the crown-ear-beast targets Sani (index 1); Yohani guards Sani
  const state = makeSharedState(1);
  const saniHpBefore = state.party.members[CHARACTER_IDS.SANI].hp;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = {
    type: COMMAND_TYPES.ABILITY, abilityId: ABILITY_IDS.GUARD_AID, targetIdx: 1,
  };
  state.battle.pendingCommands[CHARACTER_IDS.SANI] = DEFEND;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  const events = r.roundResult.events;
  assert.ok(events.some((e) => e.kind === 'guard-intercept' && e.originalTargetId === CHARACTER_IDS.SANI));
  // Sani took no direct damage — her HP is unchanged
  assert.equal(r.nextGameState.party.members[CHARACTER_IDS.SANI].hp, saniHpBefore);
  // Yohani absorbed the hit — HP decreased
  assert.ok(r.nextGameState.party.members[CHARACTER_IDS.YOHANI].hp < 24);
});
