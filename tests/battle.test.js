import test from 'node:test';
import assert from 'node:assert/strict';
import { ABILITY_IDS, CHARACTER_IDS, MAP_IDS } from '../src/content/ids.js';
import { OPENING_PHASE } from '../src/content/opening.js';
import { OPENING_ENCOUNTERS } from '../src/content/opening.js';
import { RANDOM_ENCOUNTER_DEFS } from '../src/content/encounters.js';
import { createBattleEntry } from '../src/battle/battle-state.js';
import { COMMAND_TYPES, validateCommand } from '../src/battle/commands.js';
import { resolveRound } from '../src/battle/resolver.js';
import { createInitialGameState, validateGameState } from '../src/state/game-state.js';
import { getSaniConditionBand } from '../src/rpg/insight.js';

const SOLO_ENC = OPENING_ENCOUNTERS.SOLO.id;
const SHARED_ENC = OPENING_ENCOUNTERS.SHARED.id;
const RANDOM_SOLO_ENC = RANDOM_ENCOUNTER_DEFS.SOLO_CROWN_EAR.id;
const RANDOM_SHARED_ENC = RANDOM_ENCOUNTER_DEFS.SHARED_CROWN_EAR.id;

const ATK0 = { type: COMMAND_TYPES.ATTACK, targetIdx: 0 };
const DEFEND = { type: COMMAND_TYPES.DEFEND };

const REVIVAL_POINT = { mapId: MAP_IDS.XISHI_VILLAGE, x: 148, y: 356 };

function makeSoloState(seed = 42) {
  const state = createInitialGameState();
  state.mode = 'battle';
  state.progression.openingPhase = OPENING_PHASE.SOLO_APPROACH;
  state.battle = createBattleEntry(SOLO_ENC, seed, {
    partyIds: [CHARACTER_IDS.YOHANI],
    leaderId: CHARACTER_IDS.YOHANI,
    revivalPoint: REVIVAL_POINT,
  });
  return state;
}

function makeSharedState(seed = 42) {
  const state = createInitialGameState();
  state.mode = 'battle';
  state.party.activeIds = [CHARACTER_IDS.YOHANI, CHARACTER_IDS.SANI];
  state.progression.openingPhase = OPENING_PHASE.SHARED_PANIC;
  state.battle = createBattleEntry(SHARED_ENC, seed, {
    partyIds: [CHARACTER_IDS.YOHANI, CHARACTER_IDS.SANI],
    leaderId: CHARACTER_IDS.YOHANI,
    revivalPoint: REVIVAL_POINT,
  });
  return state;
}

function makeRandomSoloState(seed = 42) {
  const state = createInitialGameState();
  state.mode = 'battle';
  state.battle = createBattleEntry(RANDOM_SOLO_ENC, seed, {
    partyIds: [CHARACTER_IDS.YOHANI],
    leaderId: CHARACTER_IDS.YOHANI,
    revivalPoint: REVIVAL_POINT,
  });
  return state;
}

function makeRandomSharedState(seed = 42) {
  const state = createInitialGameState();
  state.mode = 'battle';
  state.party.activeIds = [CHARACTER_IDS.YOHANI, CHARACTER_IDS.SANI];
  state.battle = createBattleEntry(RANDOM_SHARED_ENC, seed, {
    partyIds: [CHARACTER_IDS.YOHANI, CHARACTER_IDS.SANI],
    leaderId: CHARACTER_IDS.YOHANI,
    revivalPoint: REVIVAL_POINT,
  });
  return state;
}

// ── createBattleEntry ────────────────────────────────────────────────────────

test('createBattleEntry solo: creates command-selection phase with correct shape', () => {
  const snaps = { partyIds: [CHARACTER_IDS.YOHANI], leaderId: CHARACTER_IDS.YOHANI, revivalPoint: REVIVAL_POINT };
  const b = createBattleEntry(SOLO_ENC, 1, snaps);
  assert.equal(b.phase, 'command-selection');
  assert.equal(b.context, 'authored-solo');
  assert.deepEqual(b.partyIds, [CHARACTER_IDS.YOHANI]);
  assert.equal(b.round, 1);
  assert.equal(b.pendingCommands[CHARACTER_IDS.YOHANI], null);
  assert.equal(b.enemies.length, 1);
  assert.equal(b.enemies[0].hp, b.enemies[0].maxHp);
});

test('createBattleEntry: each enemy has a non-empty instanceId string', () => {
  const snaps = { partyIds: [CHARACTER_IDS.YOHANI], leaderId: CHARACTER_IDS.YOHANI, revivalPoint: REVIVAL_POINT };
  const b = createBattleEntry(SOLO_ENC, 1, snaps);
  for (const enemy of b.enemies) {
    assert.equal(typeof enemy.instanceId, 'string');
    assert.ok(enemy.instanceId.length > 0);
  }
});

test('createBattleEntry: partyCombatState keys exactly match partyIds', () => {
  const snaps = { partyIds: [CHARACTER_IDS.YOHANI, CHARACTER_IDS.SANI], leaderId: CHARACTER_IDS.YOHANI, revivalPoint: REVIVAL_POINT };
  const b = createBattleEntry(SHARED_ENC, 1, snaps);
  const keys = new Set(Object.keys(b.partyCombatState));
  assert.equal(keys.size, 2);
  assert.ok(keys.has(CHARACTER_IDS.YOHANI));
  assert.ok(keys.has(CHARACTER_IDS.SANI));
});

test('createBattleEntry shared: partyIds includes both characters', () => {
  const snaps = { partyIds: [CHARACTER_IDS.YOHANI, CHARACTER_IDS.SANI], leaderId: CHARACTER_IDS.YOHANI, revivalPoint: REVIVAL_POINT };
  const b = createBattleEntry(SHARED_ENC, 1, snaps);
  assert.deepEqual(b.partyIds, [CHARACTER_IDS.YOHANI, CHARACTER_IDS.SANI]);
  assert.equal(b.context, 'authored-shared');
  assert.equal(b.pendingCommands[CHARACTER_IDS.YOHANI], null);
  assert.equal(b.pendingCommands[CHARACTER_IDS.SANI], null);
});

test('createBattleEntry records snapshotLeaderId from snapshot', () => {
  const snaps = { partyIds: [CHARACTER_IDS.YOHANI], leaderId: CHARACTER_IDS.YOHANI, revivalPoint: REVIVAL_POINT };
  const b = createBattleEntry(SOLO_ENC, 1, snaps);
  assert.equal(b.snapshotLeaderId, CHARACTER_IDS.YOHANI);
});

test('createBattleEntry records snapshotRevivalPoint from snapshot', () => {
  const snaps = { partyIds: [CHARACTER_IDS.YOHANI], leaderId: CHARACTER_IDS.YOHANI, revivalPoint: REVIVAL_POINT };
  const b = createBattleEntry(SOLO_ENC, 1, snaps);
  assert.equal(b.snapshotRevivalPoint.mapId, REVIVAL_POINT.mapId);
  assert.equal(b.snapshotRevivalPoint.x, REVIVAL_POINT.x);
  assert.equal(b.snapshotRevivalPoint.y, REVIVAL_POINT.y);
});

test('createBattleEntry throws RangeError for unknown encounterId', () => {
  const snaps = { partyIds: [CHARACTER_IDS.YOHANI], leaderId: CHARACTER_IDS.YOHANI, revivalPoint: REVIVAL_POINT };
  assert.throws(() => createBattleEntry('nonexistent-encounter', 1, snaps), RangeError);
});

test('createBattleEntry throws RangeError when partyIds missing', () => {
  assert.throws(
    () => createBattleEntry(SOLO_ENC, 1, { leaderId: CHARACTER_IDS.YOHANI, revivalPoint: REVIVAL_POINT }),
    RangeError,
  );
});

test('createBattleEntry throws RangeError when leaderId missing', () => {
  assert.throws(
    () => createBattleEntry(SOLO_ENC, 1, { partyIds: [CHARACTER_IDS.YOHANI], revivalPoint: REVIVAL_POINT }),
    RangeError,
  );
});

test('createBattleEntry throws RangeError when revivalPoint missing', () => {
  assert.throws(
    () => createBattleEntry(SOLO_ENC, 1, { partyIds: [CHARACTER_IDS.YOHANI], leaderId: CHARACTER_IDS.YOHANI }),
    RangeError,
  );
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

test('validateGameState accepts valid random solo battle state', () => {
  const state = makeRandomSoloState();
  assert.ok(validateGameState(state));
});

test('validateGameState rejects battle.phase = resolving', () => {
  const state = makeSoloState();
  state.battle.phase = 'resolving';
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects battle.phase = complete', () => {
  const state = makeSoloState();
  state.battle.phase = 'complete';
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects battle without instanceId on enemy', () => {
  const state = makeSoloState();
  delete state.battle.enemies[0].instanceId;
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects battle without partyCombatState', () => {
  const state = makeSoloState();
  delete state.battle.partyCombatState;
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects partyCombatState with wrong keys', () => {
  const state = makeSoloState();
  state.battle.partyCombatState[CHARACTER_IDS.SANI] = { statusFlags: {} };
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects battle without snapshotRevivalPoint', () => {
  const state = makeSoloState();
  delete state.battle.snapshotRevivalPoint;
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects snapshotRevivalPoint with unknown mapId', () => {
  const state = makeSoloState();
  state.battle.snapshotRevivalPoint = { mapId: 'unknown-map', x: 0, y: 0 };
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects snapshotLeaderId not a known character', () => {
  const state = makeSoloState();
  state.battle.snapshotLeaderId = 'unknown-character';
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects activeGuard with unknown guarderId', () => {
  const state = makeSoloState();
  state.battle.activeGuard = { guarderId: 'unknown', targetId: CHARACTER_IDS.YOHANI };
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects pendingCommands keys differing from partyIds', () => {
  const state = makeSoloState();
  state.battle.pendingCommands[CHARACTER_IDS.SANI] = null;
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects authored-solo with two-member partyIds', () => {
  const state = makeSoloState();
  state.battle.partyIds = [CHARACTER_IDS.YOHANI, CHARACTER_IDS.SANI];
  state.battle.pendingCommands[CHARACTER_IDS.SANI] = null;
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects authored-solo battle when openingPhase is not SOLO_APPROACH', () => {
  const state = makeSoloState();
  state.progression.openingPhase = OPENING_PHASE.DELIVERY;
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects authored-shared battle when openingPhase is not SHARED_PANIC', () => {
  const state = makeSharedState();
  state.progression.openingPhase = OPENING_PHASE.SOLO_APPROACH;
  assert.equal(validateGameState(state), null);
});

test('validateGameState accepts activeGuard = null', () => {
  const state = makeSoloState();
  state.battle.activeGuard = null;
  assert.ok(validateGameState(state));
});

test('validateGameState accepts valid activeGuard object', () => {
  const state = makeSharedState();
  state.battle.activeGuard = { guarderId: CHARACTER_IDS.YOHANI, targetId: CHARACTER_IDS.SANI };
  assert.ok(validateGameState(state));
});

test('validateGameState rejects mode=field with battle present', () => {
  const state = makeSoloState();
  state.mode = 'field';
  assert.equal(validateGameState(state), null);
});

// ── validateGameState — pause contract ───────────────────────────────────────

test('validateGameState accepts mode=pause with valid battle-pause', () => {
  const state = makeSoloState();
  state.mode = 'pause';
  state.pause = { resumeMode: 'battle' };
  assert.ok(validateGameState(state));
});

test('validateGameState rejects mode=pause when pause is null', () => {
  const state = createInitialGameState();
  state.mode = 'pause';
  state.pause = null;
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects mode=pause with resumeMode=pause', () => {
  const state = createInitialGameState();
  state.mode = 'field';
  // manually force pause state
  const clone = structuredClone(state);
  clone.mode = 'pause';
  clone.pause = { resumeMode: 'pause' };
  assert.equal(validateGameState(clone), null);
});

test('validateGameState rejects mode=pause with invalid resumeMode', () => {
  const state = createInitialGameState();
  const clone = structuredClone(state);
  clone.mode = 'pause';
  clone.pause = { resumeMode: 'invalid-mode' };
  assert.equal(validateGameState(clone), null);
});

test('validateGameState rejects mode=field with pause object present', () => {
  const state = createInitialGameState();
  state.mode = 'field';
  state.pause = { resumeMode: 'battle' };
  assert.equal(validateGameState(state), null);
});

test('validateGameState accepts mode=field with pause=null', () => {
  const state = createInitialGameState();
  state.mode = 'field';
  state.pause = null;
  assert.ok(validateGameState(state));
});

// ── validateCommand ──────────────────────────────────────────────────────────

test('validateCommand accepts attack with targetIdx', () => {
  assert.ok(validateCommand({ type: COMMAND_TYPES.ATTACK, targetIdx: 0 }, CHARACTER_IDS.YOHANI));
});

test('validateCommand rejects attack missing targetIdx', () => {
  assert.equal(validateCommand({ type: COMMAND_TYPES.ATTACK }, CHARACTER_IDS.YOHANI), false);
});

test('validateCommand rejects attack targeting dead enemy', () => {
  const enemies = [{ hp: 0 }];
  assert.equal(validateCommand({ type: COMMAND_TYPES.ATTACK, targetIdx: 0 }, CHARACTER_IDS.YOHANI, { context: 'authored-solo', enemies }), false);
});

test('validateCommand rejects attack with targetIdx >= enemies.length', () => {
  const enemies = [{ hp: 10 }];
  assert.equal(validateCommand({ type: COMMAND_TYPES.ATTACK, targetIdx: 1 }, CHARACTER_IDS.YOHANI, { context: 'authored-solo', enemies }), false);
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

test('validateCommand accepts star-flame for Sani with targetIdx', () => {
  const cmd = { type: COMMAND_TYPES.ABILITY, abilityId: ABILITY_IDS.STAR_FLAME, targetIdx: 0 };
  assert.ok(validateCommand(cmd, CHARACTER_IDS.SANI));
});

test('validateCommand rejects star-flame for Yohani', () => {
  const cmd = { type: COMMAND_TYPES.ABILITY, abilityId: ABILITY_IDS.STAR_FLAME, targetIdx: 0 };
  assert.equal(validateCommand(cmd, CHARACTER_IDS.YOHANI), false);
});

test('validateCommand rejects star-flame when MP insufficient', () => {
  const cmd = { type: COMMAND_TYPES.ABILITY, abilityId: ABILITY_IDS.STAR_FLAME, targetIdx: 0 };
  assert.equal(validateCommand(cmd, CHARACTER_IDS.SANI, { context: 'random', mp: 2 }), false);
});

test('validateCommand accepts minor-heal for Sani with targetIdx', () => {
  const cmd = { type: COMMAND_TYPES.ABILITY, abilityId: ABILITY_IDS.MINOR_HEAL, targetIdx: 0 };
  assert.ok(validateCommand(cmd, CHARACTER_IDS.SANI));
});

test('validateCommand rejects minor-heal when MP insufficient', () => {
  const cmd = { type: COMMAND_TYPES.ABILITY, abilityId: ABILITY_IDS.MINOR_HEAL, targetIdx: 0 };
  assert.equal(validateCommand(cmd, CHARACTER_IDS.SANI, { context: 'random', mp: 3 }), false);
});

test('validateCommand accepts run with random battleCtx', () => {
  assert.ok(validateCommand({ type: COMMAND_TYPES.RUN }, CHARACTER_IDS.YOHANI, { context: 'random' }));
});

test('validateCommand rejects run without battleCtx', () => {
  assert.equal(validateCommand({ type: COMMAND_TYPES.RUN }, CHARACTER_IDS.YOHANI), false);
});

test('validateCommand rejects run in authored-solo context', () => {
  assert.equal(validateCommand({ type: COMMAND_TYPES.RUN }, CHARACTER_IDS.YOHANI, { context: 'authored-solo' }), false);
});

test('validateCommand rejects run in authored-shared context', () => {
  assert.equal(validateCommand({ type: COMMAND_TYPES.RUN }, CHARACTER_IDS.SANI, { context: 'authored-shared' }), false);
});

// ── resolveRound — phase/precondition guards ─────────────────────────────────

test('resolveRound returns invalid-phase when phase is not command-selection', () => {
  const state = makeSoloState();
  state.battle.phase = 'resolving';
  const r = resolveRound(state);
  assert.equal(r.ok, false);
  assert.equal(r.result, 'invalid-phase');
});

test('resolveRound returns precondition-failed when commands not all filled', () => {
  const state = makeSoloState();
  const r = resolveRound(state);
  assert.equal(r.ok, false);
  assert.equal(r.result, 'precondition-failed');
});

// ── resolveRound — ongoing ───────────────────────────────────────────────────

test('resolveRound outcome=ongoing: advances to round 2, resets commands', () => {
  const state = makeSoloState(42);
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.equal(r.roundResult.outcome, 'ongoing');
  assert.equal(r.nextGameState.battle.round, 2);
  assert.equal(r.nextGameState.battle.phase, 'command-selection');
  assert.equal(r.nextGameState.battle.pendingCommands[CHARACTER_IDS.YOHANI], null);
});

// ── resolveRound — victory ───────────────────────────────────────────────────

test('resolveRound outcome=victory: battle=null and mode=field', () => {
  const state = makeSoloState(42);
  state.battle.enemies[0].hp = 1;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.equal(r.roundResult.outcome, 'victory');
  assert.equal(r.nextGameState.battle, null);
  assert.equal(r.nextGameState.mode, 'field');
});

test('victory applies EXP reward to party members in partyIds', () => {
  const state = makeSoloState(42);
  state.battle.enemies[0].hp = 1;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.equal(r.roundResult.outcome, 'victory');
  assert.equal(r.nextGameState.party.members[CHARACTER_IDS.YOHANI].exp, 12);
});

test('authored-solo victory advances openingPhase to SANI_STREAM', () => {
  const state = makeSoloState(42);
  state.battle.enemies[0].hp = 1;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.equal(r.nextGameState.progression.openingPhase, OPENING_PHASE.SANI_STREAM);
  assert.ok(r.nextGameState.progression.flags.soloBattleResolved);
});

test('authored-shared victory advances openingPhase to LEADER_TUTORIAL', () => {
  const state = makeSharedState(42);
  state.battle.enemies[0].hp = 1;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0;
  state.battle.pendingCommands[CHARACTER_IDS.SANI] = DEFEND;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.equal(r.roundResult.outcome, 'victory');
  assert.equal(r.nextGameState.progression.openingPhase, OPENING_PHASE.LEADER_TUTORIAL);
  assert.equal(r.nextGameState.battle, null);
  assert.equal(r.nextGameState.mode, 'field');
});

// ── resolveRound — defeat ────────────────────────────────────────────────────

test('resolveRound outcome=defeat: battle=null and mode=field', () => {
  const state = makeSoloState(42);
  state.party.members[CHARACTER_IDS.YOHANI].hp = 1;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = DEFEND;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.equal(r.roundResult.outcome, 'defeat');
  assert.equal(r.nextGameState.battle, null);
  assert.equal(r.nextGameState.mode, 'field');
});

test('defeat applies 25% money loss', () => {
  const state = makeSoloState(42);
  state.economy.money = 100;
  state.party.members[CHARACTER_IDS.YOHANI].hp = 1;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = DEFEND;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.equal(r.roundResult.outcome, 'defeat');
  assert.equal(r.nextGameState.economy.money, 75);
});

test('defeat restores HP/MP to full for partyIds members', () => {
  const state = makeSoloState(42);
  state.party.members[CHARACTER_IDS.YOHANI].hp = 1;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = DEFEND;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.equal(r.nextGameState.party.members[CHARACTER_IDS.YOHANI].hp, 24);
  assert.equal(r.nextGameState.party.members[CHARACTER_IDS.YOHANI].mp, 4);
});

test('defeat does NOT restore reserve members outside partyIds', () => {
  const state = makeSoloState(42);
  // Sani is NOT in partyIds (solo battle)
  state.party.members[CHARACTER_IDS.SANI].hp = 5;
  state.party.members[CHARACTER_IDS.YOHANI].hp = 1;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = DEFEND;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.equal(r.roundResult.outcome, 'defeat');
  assert.equal(r.nextGameState.party.members[CHARACTER_IDS.SANI].hp, 5);
});

// ── resolveRound — run/escape ────────────────────────────────────────────────

test('run blocked in authored context emits run-blocked event', () => {
  const state = makeSoloState(42);
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = { type: COMMAND_TYPES.RUN };
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.ok(r.roundResult.events.some((e) => e.kind === 'run-blocked'));
  assert.equal(r.roundResult.outcome, 'ongoing');
});

test('run in random context emits run-attempt event with escaped flag', () => {
  const state = makeRandomSoloState(42);
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = { type: COMMAND_TYPES.RUN };
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  const runEvent = r.roundResult.events.find((e) => e.kind === 'run-attempt');
  assert.ok(runEvent);
  assert.equal(typeof runEvent.escaped, 'boolean');
});

test('run escape clears battle and sets mode=field', () => {
  const state = makeRandomSoloState(42);
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = { type: COMMAND_TYPES.RUN };
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  const runEvent = r.roundResult.events.find((e) => e.kind === 'run-attempt');
  if (runEvent.escaped) {
    assert.equal(r.roundResult.outcome, 'escaped');
    assert.equal(r.nextGameState.battle, null);
    assert.equal(r.nextGameState.mode, 'field');
  } else {
    assert.equal(r.roundResult.outcome, 'ongoing');
    assert.ok(r.nextGameState.battle !== null);
  }
});

// ── resolveRound — guard-aid ─────────────────────────────────────────────────

test('guard-aid reduces damage on guarded ally (seed=1: beast targets Sani)', () => {
  // seed=1: crown-ear-beast targets Sani (index 1)
  const state = makeSharedState(1);
  const saniHpBefore = state.party.members[CHARACTER_IDS.SANI].hp;
  const yohaniHpBefore = state.party.members[CHARACTER_IDS.YOHANI].hp;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = {
    type: COMMAND_TYPES.ABILITY, abilityId: ABILITY_IDS.GUARD_AID, targetIdx: 1,
  };
  state.battle.pendingCommands[CHARACTER_IDS.SANI] = DEFEND;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.ok(r.roundResult.events.some((e) => e.kind === 'guard-intercept' && e.originalTargetId === CHARACTER_IDS.SANI));
  assert.ok(r.nextGameState.party.members[CHARACTER_IDS.SANI].hp < saniHpBefore);
  assert.equal(r.nextGameState.party.members[CHARACTER_IDS.YOHANI].hp, yohaniHpBefore);
});

test('guard-aid persists when enemy does not attack guarded ally (seed=2: beast targets Yohani)', () => {
  // seed=2: crown-ear-beast targets Yohani (index 0); Yohani guards Sani (index 1)
  const state = makeSharedState(2);
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = {
    type: COMMAND_TYPES.ABILITY, abilityId: ABILITY_IDS.GUARD_AID, targetIdx: 1,
  };
  state.battle.pendingCommands[CHARACTER_IDS.SANI] = DEFEND;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  // No guard-intercept because beast targeted Yohani, not Sani
  assert.ok(!r.roundResult.events.some((e) => e.kind === 'guard-intercept'));
  // Guard persists into round 2
  assert.ok(r.nextGameState.battle !== null);
  assert.ok(r.nextGameState.battle.activeGuard !== null);
  assert.equal(r.nextGameState.battle.activeGuard.targetId, CHARACTER_IDS.SANI);
});

test('guard is pre-initialized before initiative loop (guard-aid event emitted)', () => {
  const state = makeSharedState(1);
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = {
    type: COMMAND_TYPES.ABILITY, abilityId: ABILITY_IDS.GUARD_AID, targetIdx: 1,
  };
  state.battle.pendingCommands[CHARACTER_IDS.SANI] = DEFEND;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.ok(r.roundResult.events.some((e) => e.kind === 'guard-aid'));
});

// ── resolveRound — Yohani leader protection ──────────────────────────────────

test('leader protection: yohani-protection event emitted when Yohani leads round-1 random', () => {
  // seed=42 shared: beast targets Yohani (index 0)
  const state = makeRandomSharedState(42);
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = DEFEND;
  state.battle.pendingCommands[CHARACTER_IDS.SANI] = DEFEND;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.ok(r.roundResult.events.some((e) => e.kind === 'yohani-protection'));
});

test('leader protection: applies to Sani when she is targeted in round-1 random (seed=1)', () => {
  // seed=1 shared: beast targets Sani (index 1)
  const state = makeRandomSharedState(1);
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = DEFEND;
  state.battle.pendingCommands[CHARACTER_IDS.SANI] = DEFEND;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.ok(r.roundResult.events.some((e) => e.kind === 'yohani-protection' && e.targetId === CHARACTER_IDS.SANI));
});

test('leader protection: NOT applied in authored-solo context', () => {
  const state = makeSoloState(42);
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = DEFEND;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.ok(!r.roundResult.events.some((e) => e.kind === 'yohani-protection'));
});

test('leader protection: NOT applied in round 2', () => {
  const state = makeRandomSoloState(42);
  state.battle.round = 2;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = DEFEND;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.ok(!r.roundResult.events.some((e) => e.kind === 'yohani-protection'));
});

// ── resolveRound — ability MP cost ───────────────────────────────────────────

test('star-flame deducts 3 MP from Sani', () => {
  const state = makeSharedState(42);
  state.party.members[CHARACTER_IDS.SANI].mp = 12;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = DEFEND;
  state.battle.pendingCommands[CHARACTER_IDS.SANI] = {
    type: COMMAND_TYPES.ABILITY, abilityId: ABILITY_IDS.STAR_FLAME, targetIdx: 0,
  };
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.equal(r.nextGameState.party.members[CHARACTER_IDS.SANI].mp, 9);
});

test('star-flame is skipped when Sani has insufficient MP', () => {
  const state = makeSharedState(42);
  state.party.members[CHARACTER_IDS.SANI].mp = 2;
  const beastHpBefore = state.battle.enemies[0].hp;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = DEFEND;
  state.battle.pendingCommands[CHARACTER_IDS.SANI] = {
    type: COMMAND_TYPES.ABILITY, abilityId: ABILITY_IDS.STAR_FLAME, targetIdx: 0,
  };
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  // No ability event emitted for star-flame
  assert.ok(!r.roundResult.events.some((e) => e.kind === 'ability' && e.abilityId === ABILITY_IDS.STAR_FLAME));
  // Beast HP unchanged by Sani (Yohani only defended)
  assert.equal(r.nextGameState.battle.enemies[0].hp, beastHpBefore);
  // MP not deducted
  assert.equal(r.nextGameState.party.members[CHARACTER_IDS.SANI].mp, 2);
});

test('minor-heal deducts 4 MP from Sani and heals target', () => {
  const state = makeSharedState(42);
  state.party.members[CHARACTER_IDS.SANI].mp = 12;
  state.party.members[CHARACTER_IDS.YOHANI].hp = 10;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = DEFEND;
  state.battle.pendingCommands[CHARACTER_IDS.SANI] = {
    type: COMMAND_TYPES.ABILITY, abilityId: ABILITY_IDS.MINOR_HEAL, targetIdx: 0,
  };
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.equal(r.nextGameState.party.members[CHARACTER_IDS.SANI].mp, 8);
  assert.ok(r.nextGameState.party.members[CHARACTER_IDS.YOHANI].hp > 10);
});

test('minor-heal is skipped when Sani has insufficient MP', () => {
  const state = makeSharedState(42);
  state.party.members[CHARACTER_IDS.SANI].mp = 3;
  const yohaniHpBefore = state.party.members[CHARACTER_IDS.YOHANI].hp;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = DEFEND;
  state.battle.pendingCommands[CHARACTER_IDS.SANI] = {
    type: COMMAND_TYPES.ABILITY, abilityId: ABILITY_IDS.MINOR_HEAL, targetIdx: 0,
  };
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.ok(!r.roundResult.events.some((e) => e.kind === 'ability' && e.abilityId === ABILITY_IDS.MINOR_HEAL));
  // MP unchanged
  assert.equal(r.nextGameState.party.members[CHARACTER_IDS.SANI].mp, 3);
});

// ── getSaniConditionBand ─────────────────────────────────────────────────────

test('getSaniConditionBand returns 穩定 above 50% HP', () => {
  assert.equal(getSaniConditionBand(18, 18), '穩定');
  assert.equal(getSaniConditionBand(10, 18), '穩定');
});

test('getSaniConditionBand returns 受傷 at or below 50% and above 20%', () => {
  assert.equal(getSaniConditionBand(9, 18), '受傷');
  assert.equal(getSaniConditionBand(4, 18), '受傷');
});

test('getSaniConditionBand returns 危急 at or below 20%', () => {
  assert.equal(getSaniConditionBand(3, 18), '危急');
  assert.equal(getSaniConditionBand(0, 18), '危急');
});

test('getSaniConditionBand returns 危急 on invalid input', () => {
  assert.equal(getSaniConditionBand(NaN, 18), '危急');
  assert.equal(getSaniConditionBand(10, 0), '危急');
  assert.equal(getSaniConditionBand(10, -1), '危急');
  assert.equal(getSaniConditionBand(Infinity, 18), '危急');
});
