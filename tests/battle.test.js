import test from 'node:test';
import assert from 'node:assert/strict';
import { ABILITY_IDS, CHARACTER_IDS, ENEMY_IDS, ITEM_IDS, MAP_IDS } from '../src/content/ids.js';
import { OPENING_PHASE, OPENING_ENCOUNTERS } from '../src/content/opening.js';
import { createBattleEntry } from '../src/battle/battle-state.js';
import { COMMAND_TYPES, validateCommand } from '../src/battle/commands.js';
import { resolveRound, submitCommand, resolveEnemyAction, resolveEnemyActionWindow, applyPartyItemAction, resolveActorSequence } from '../src/battle/resolver.js';
import { SaveStore } from '../src/save/storage.js';
import { makeRng, lcgNext } from '../src/battle/rng.js';
import { createInitialGameState, validateGameState } from '../src/state/game-state.js';
import { getSaniConditionBand } from '../src/rpg/insight.js';
import { tryMigrate } from '../src/save/migration.js';

const SOLO_ENC = OPENING_ENCOUNTERS.SOLO.id;
const SHARED_ENC = OPENING_ENCOUNTERS.SHARED.id;
const RANDOM_ENCOUNTER_ID = 'random-crown-ear'; // test fixture; not in KNOWN_ENCOUNTER_IDS

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

// Constructs a random-context battle state directly (bypassing createBattleEntry/ENCOUNTERS).
// Accepts any encounterId that is not in KNOWN_ENCOUNTER_IDS; validator only requires non-empty string.
function makeTestRandomBattleState(seed = 42, { shared = false } = {}) {
  const state = createInitialGameState();
  state.mode = 'battle';
  const partyIds = shared
    ? [CHARACTER_IDS.YOHANI, CHARACTER_IDS.SANI]
    : [CHARACTER_IDS.YOHANI];
  if (shared) state.party.activeIds = [CHARACTER_IDS.YOHANI, CHARACTER_IDS.SANI];
  state.battle = {
    encounterId: RANDOM_ENCOUNTER_ID,
    context: 'random',
    partyIds,
    enemyIds: [ENEMY_IDS.CROWN_EAR_BEAST],
    phase: 'command-selection',
    round: 1,
    pendingCommands: Object.fromEntries(partyIds.map((id) => [id, null])),
    enemies: [{ instanceId: 'crown-ear-beast-0', hp: 18, maxHp: 18 }],
    partyCombatState: Object.fromEntries(partyIds.map((id) => [id, { statusFlags: {} }])),
    rngState: makeRng(seed),
    activeGuard: null,
    snapshotLeaderId: CHARACTER_IDS.YOHANI,
    snapshotRevivalPoint: { ...REVIVAL_POINT },
  };
  return state;
}

// Finds the first seed (1..500) where a solo random RUN attempt escapes deterministically.
// Simulates: 1 AI rng step + 1 run rng step; escape when result % 4 !== 0.
function findEscapingSoloRandomState() {
  for (let seed = 1; seed <= 500; seed++) {
    let rng = makeRng(seed);
    rng = lcgNext(rng); // AI command selection for 1 enemy
    rng = lcgNext(rng); // run attempt
    if ((rng % 4) !== 0) {
      const s = makeTestRandomBattleState(seed);
      s.battle.pendingCommands[CHARACTER_IDS.YOHANI] = { type: COMMAND_TYPES.RUN };
      return s;
    }
  }
  throw new Error('findEscapingSoloRandomState: no escaping seed in 1..500');
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
  const state = makeTestRandomBattleState(42);
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

test('validateGameState rejects duplicate instanceId across enemies', () => {
  const state = makeTestRandomBattleState(42);
  // inject a second enemy with the same instanceId
  state.battle.enemyIds = [ENEMY_IDS.CROWN_EAR_BEAST, ENEMY_IDS.CROWN_EAR_BEAST];
  state.battle.enemies = [
    { instanceId: 'crown-ear-beast-0', hp: 18, maxHp: 18 },
    { instanceId: 'crown-ear-beast-0', hp: 18, maxHp: 18 }, // duplicate
  ];
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

test('validateGameState rejects rngState = 0', () => {
  const state = makeTestRandomBattleState(42);
  state.battle.rngState = 0;
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects rngState > 0xFFFFFFFF', () => {
  const state = makeTestRandomBattleState(42);
  state.battle.rngState = 0x100000000; // 2^32 — one above max uint32
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects activeGuard with unknown guarderId', () => {
  const state = makeSoloState();
  state.battle.activeGuard = { guarderId: 'unknown', targetId: CHARACTER_IDS.YOHANI };
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects activeGuard with member outside battle.partyIds', () => {
  // Solo battle: partyIds=[YOHANI]. SANI is a known character but not in partyIds.
  const state = makeSoloState();
  state.battle.activeGuard = { guarderId: CHARACTER_IDS.YOHANI, targetId: CHARACTER_IDS.SANI };
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects pendingCommands keys differing from partyIds', () => {
  const state = makeSoloState();
  state.battle.pendingCommands[CHARACTER_IDS.SANI] = null;
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects non-null pending command that fails validation', () => {
  const state = makeSoloState();
  state.battle.enemies[0].hp = 0; // dead enemy
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0; // targeting dead enemy
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects non-null pendingCommand for a fallen (hp=0) party member', () => {
  const state = makeSoloState();
  state.party.members[CHARACTER_IDS.YOHANI].hp = 0;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0;
  assert.equal(validateGameState(state), null);
});

test('validateGameState accepts partial pendingCommands (one filled, one null)', () => {
  const state = makeSharedState();
  // Only Yohani's command is filled; Sani's remains null
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0;
  assert.ok(validateGameState(state));
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

test('validateGameState rejects authored encounterId whose registered context does not match battle.context', () => {
  // SHARED_ENC is registered as 'authored-shared'; forcing context='authored-solo' mismatches
  const state = makeSoloState();
  state.battle.encounterId = SHARED_ENC; // registered context is 'authored-shared', not 'authored-solo'
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

test('validateGameState rejects pause.resumeMode=battle when battle is null (bidirectional invariant)', () => {
  const state = createInitialGameState();
  state.mode = 'pause';
  state.pause = { resumeMode: 'battle' };
  // battle is already null in initial state — inverse invariant must reject this
  assert.equal(validateGameState(state), null);
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

// ── submitCommand ────────────────────────────────────────────────────────────

test('submitCommand: accepts valid attack, returns nextGameState with command set', () => {
  const state = makeSoloState();
  const r = submitCommand(state, CHARACTER_IDS.YOHANI, ATK0);
  assert.equal(r.ok, true);
  assert.equal(r.result, 'submitted');
  assert.ok(r.nextGameState);
  assert.deepEqual(r.nextGameState.battle.pendingCommands[CHARACTER_IDS.YOHANI], ATK0);
});

test('submitCommand: rejects command for actor not in partyIds', () => {
  const state = makeSoloState(); // SANI is not in partyIds for solo
  const r = submitCommand(state, CHARACTER_IDS.SANI, DEFEND);
  assert.equal(r.ok, false);
  assert.equal(r.result, 'invalid-actor');
});

test('submitCommand: rejects star-flame when Sani has insufficient MP', () => {
  const state = makeSharedState();
  state.party.members[CHARACTER_IDS.SANI].mp = 2;
  const cmd = { type: COMMAND_TYPES.ABILITY, abilityId: ABILITY_IDS.STAR_FLAME, targetIdx: 0 };
  const r = submitCommand(state, CHARACTER_IDS.SANI, cmd);
  assert.equal(r.ok, false);
  assert.equal(r.result, 'invalid-command');
});

test('submitCommand: rejects minor-heal when Sani has insufficient MP', () => {
  const state = makeSharedState();
  state.party.members[CHARACTER_IDS.SANI].mp = 3;
  const cmd = { type: COMMAND_TYPES.ABILITY, abilityId: ABILITY_IDS.MINOR_HEAL, targetIdx: 0 };
  const r = submitCommand(state, CHARACTER_IDS.SANI, cmd);
  assert.equal(r.ok, false);
  assert.equal(r.result, 'invalid-command');
});

test('submitCommand: rejects attack targeting dead enemy', () => {
  const state = makeSoloState();
  state.battle.enemies[0].hp = 0;
  const r = submitCommand(state, CHARACTER_IDS.YOHANI, ATK0);
  assert.equal(r.ok, false);
  assert.equal(r.result, 'invalid-command');
});

test('submitCommand: rejects when battle phase is not command-selection', () => {
  const state = makeSoloState();
  state.battle.phase = 'resolving';
  const r = submitCommand(state, CHARACTER_IDS.YOHANI, ATK0);
  assert.equal(r.ok, false);
  assert.equal(r.result, 'invalid-phase');
});

test('submitCommand: rejects when no battle in state', () => {
  const state = createInitialGameState();
  const r = submitCommand(state, CHARACTER_IDS.YOHANI, ATK0);
  assert.equal(r.ok, false);
  assert.equal(r.result, 'invalid-context');
});

test('submitCommand: rejects fallen actor (hp=0)', () => {
  const state = makeSoloState();
  state.party.members[CHARACTER_IDS.YOHANI].hp = 0;
  const r = submitCommand(state, CHARACTER_IDS.YOHANI, ATK0);
  assert.equal(r.ok, false);
  assert.equal(r.result, 'fallen-actor');
});

// ── resolveRound — phase/precondition guards ─────────────────────────────────

test('resolveRound rejects state with invalid phase', () => {
  // Pre-check fires before validateGameState, so phase mismatch surfaces as 'invalid-phase'
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

test('resolveRound: fallen party member skipped for readiness; living member satisfies', () => {
  const state = makeSharedState(42);
  state.party.members[CHARACTER_IDS.YOHANI].hp = 0; // Yohani fallen — command stays null
  state.battle.pendingCommands[CHARACTER_IDS.SANI] = DEFEND;
  const r = resolveRound(state);
  // Sani is the sole living member and has a command — round should proceed
  assert.equal(r.ok, true);
  assert.ok(r.roundResult.outcome !== undefined);
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

test('victory prevalidation: already-completed flag prevents re-entry, no rewards applied', () => {
  const state = makeSoloState(42);
  state.battle.enemies[0].hp = 1;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0;
  // Manually mark as already resolved — flags are not validated by validateGameState
  state.progression.flags.soloBattleResolved = true;
  const r = resolveRound(state);
  assert.equal(r.ok, false);
  assert.equal(r.result, 'already-completed');
  assert.equal(r.nextGameState, undefined);
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

test('defeat: roundResult.defeatRecord contains moneyLost, retainedEXP, retainedItems', () => {
  const state = makeSoloState(42);
  state.economy.money = 100;
  state.party.members[CHARACTER_IDS.YOHANI].hp = 1;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = DEFEND;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.equal(r.roundResult.outcome, 'defeat');
  assert.ok(r.roundResult.defeatRecord);
  assert.equal(r.roundResult.defeatRecord.moneyLost, 25); // 25% of 100
  assert.equal(r.roundResult.defeatRecord.retainedEXP, true);
  assert.equal(r.roundResult.defeatRecord.retainedItems, true);
});

test('defeat: field.controlledId restored to field.leaderId', () => {
  const state = makeSoloState(42);
  state.field.leaderId = CHARACTER_IDS.YOHANI;
  state.field.controlledId = CHARACTER_IDS.SANI; // controlled differs from leader before defeat
  state.party.members[CHARACTER_IDS.YOHANI].hp = 1;
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = DEFEND;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.equal(r.roundResult.outcome, 'defeat');
  assert.equal(r.nextGameState.field.controlledId, CHARACTER_IDS.YOHANI);
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

test('run in authored context rejected by submitCommand before round can start', () => {
  // validateCommand rejects RUN in authored-solo; submitCommand surfaces this as invalid-command.
  // A RUN command can never reach the actor loop in a non-random encounter.
  const state = makeSoloState(42);
  const r = submitCommand(state, CHARACTER_IDS.YOHANI, { type: COMMAND_TYPES.RUN });
  assert.equal(r.ok, false);
  assert.equal(r.result, 'invalid-command');
});

test('run in random context emits run-attempt event with escaped flag', () => {
  const state = makeTestRandomBattleState(42);
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = { type: COMMAND_TYPES.RUN };
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  const runEvent = r.roundResult.events.find((e) => e.kind === 'run-attempt');
  assert.ok(runEvent);
  assert.equal(typeof runEvent.escaped, 'boolean');
});

test('run escape clears battle and sets mode=field', () => {
  const state = makeTestRandomBattleState(42);
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

test('successful run terminates actor loop: no enemy-attack events after escape', () => {
  // findEscapingSoloRandomState guarantees escape so assertion always runs
  const state = findEscapingSoloRandomState();
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  const runEvt = r.roundResult.events.find((e) => e.kind === 'run-attempt');
  assert.ok(runEvt, 'run-attempt event must appear');
  assert.equal(runEvt.escaped, true, 'this seed should escape');
  assert.equal(r.roundResult.outcome, 'escaped');
  const runIdx = r.roundResult.events.indexOf(runEvt);
  const afterRun = r.roundResult.events.slice(runIdx + 1);
  assert.ok(!afterRun.some((e) => e.kind === 'enemy-attack'), 'no enemy-attack after successful escape');
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

test('guard-aid (Policy B): unconsumed guard persists into next round and intercepts first qualifying attack', () => {
  // Round 1: Yohani guards Sani; beast targets Yohani (seed=2) → guard NOT consumed, persists.
  // Round 2: carried guard fires and is consumed when enemy attacks Sani.
  const state = makeSharedState(2);
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = {
    type: COMMAND_TYPES.ABILITY, abilityId: ABILITY_IDS.GUARD_AID, targetIdx: 1,
  };
  state.battle.pendingCommands[CHARACTER_IDS.SANI] = DEFEND;

  const r1 = resolveRound(state);
  assert.equal(r1.ok, true);
  assert.ok(!r1.roundResult.events.some((e) => e.kind === 'guard-intercept'),
    'Round 1: no interception — beast targeted Yohani, not Sani');

  const r2State = r1.nextGameState;
  assert.ok(r2State.battle.activeGuard !== null,
    'Policy B: unconsumed guard carries into Round 2');
  assert.equal(r2State.battle.activeGuard.targetId, CHARACTER_IDS.SANI,
    'guard target preserved across round boundary');

  // Verify the carried guard fires on the next qualifying enemy action in Round 2.
  const { events } = resolveEnemyActionWindow(
    r2State.battle, r2State, 0, [{ targetId: CHARACTER_IDS.SANI, hitCount: 1 }], r2State.battle.rngState,
  );
  assert.ok(events.some((e) => e.kind === 'guard-intercept' && e.originalTargetId === CHARACTER_IDS.SANI),
    'Round 2: carried guard intercepts attack on Sani');
  assert.equal(r2State.battle.activeGuard, null,
    'guard consumed after first qualifying enemy action window in Round 2');
});

// ── resolveEnemyAction — direct action-window tests ─────────────────────────

test('resolveEnemyAction: guard applies to all hits in window, consumed after window', () => {
  // Use authored-solo context so leader-protection does not fire
  const b = {
    enemyIds: [ENEMY_IDS.CROWN_EAR_BEAST],
    pendingCommands: { [CHARACTER_IDS.SANI]: null }, // not defending
    activeGuard: { guarderId: CHARACTER_IDS.YOHANI, targetId: CHARACTER_IDS.SANI },
    context: 'authored-solo',
    round: 1,
    snapshotLeaderId: CHARACTER_IDS.YOHANI,
  };
  const state = { party: { members: { [CHARACTER_IDS.SANI]: { level: 1, hp: 100 } } } };
  const { events } = resolveEnemyAction(b, state, 0, CHARACTER_IDS.SANI, 2, makeRng(5));

  const guardEvents = events.filter((e) => e.kind === 'guard-intercept');
  const attackEvents = events.filter((e) => e.kind === 'enemy-attack');
  assert.equal(guardEvents.length, 2, 'both hits intercepted by guard');
  assert.equal(attackEvents.length, 2);
  // Guard consumed after the entire action window
  assert.equal(b.activeGuard, null);
  // Each attack's damage equals the guard-reduced amount
  for (let i = 0; i < guardEvents.length; i++) {
    assert.equal(attackEvents[i].damage, guardEvents[i].reducedDamage);
  }
});

test('resolveEnemyAction: DEFEND halves incoming damage (same variance, with/without defend)', () => {
  const makeB = (withDefend) => ({
    enemyIds: [ENEMY_IDS.CROWN_EAR_BEAST],
    pendingCommands: { [CHARACTER_IDS.YOHANI]: withDefend ? DEFEND : ATK0 },
    activeGuard: null,
    context: 'authored-solo',
    round: 2,
    snapshotLeaderId: CHARACTER_IDS.YOHANI,
  });
  const rng = makeRng(7);
  const { events: evDef } = resolveEnemyAction(
    makeB(true),
    { party: { members: { [CHARACTER_IDS.YOHANI]: { level: 1, hp: 100 } } } },
    0, CHARACTER_IDS.YOHANI, 1, rng,
  );
  const { events: evNone } = resolveEnemyAction(
    makeB(false),
    { party: { members: { [CHARACTER_IDS.YOHANI]: { level: 1, hp: 100 } } } },
    0, CHARACTER_IDS.YOHANI, 1, rng,
  );
  const dmgDefend = evDef.find((e) => e.kind === 'enemy-attack').damage;
  const dmgNormal = evNone.find((e) => e.kind === 'enemy-attack').damage;
  assert.equal(dmgDefend, Math.ceil(dmgNormal / 2));
});

// ── resolveEnemyActionWindow — AoE action-window tests ───────────────────────

test('resolveEnemyActionWindow: guard consumed once after all deliveries (multi-target AoE)', () => {
  // Yohani guards Sani. Enemy delivers 1 hit to Yohani then 1 hit to Sani.
  // Guard protects Sani only; b.activeGuard is cleared after all deliveries finish.
  const b = {
    enemyIds: [ENEMY_IDS.CROWN_EAR_BEAST],
    pendingCommands: { [CHARACTER_IDS.YOHANI]: null, [CHARACTER_IDS.SANI]: null },
    activeGuard: { guarderId: CHARACTER_IDS.YOHANI, targetId: CHARACTER_IDS.SANI },
    context: 'authored-shared',
    round: 1,
    snapshotLeaderId: CHARACTER_IDS.YOHANI,
  };
  const state = {
    party: {
      members: {
        [CHARACTER_IDS.YOHANI]: { level: 1, hp: 100 },
        [CHARACTER_IDS.SANI]: { level: 1, hp: 100 },
      },
    },
  };
  const deliveries = [
    { targetId: CHARACTER_IDS.YOHANI, hitCount: 1 },
    { targetId: CHARACTER_IDS.SANI, hitCount: 1 },
  ];
  const { events } = resolveEnemyActionWindow(b, state, 0, deliveries, makeRng(5));

  const intercepts = events.filter((e) => e.kind === 'guard-intercept');
  assert.equal(intercepts.length, 1, 'guard intercepts only the guarded target (Sani)');
  assert.equal(intercepts[0].originalTargetId, CHARACTER_IDS.SANI);
  assert.equal(b.activeGuard, null, 'guard cleared once after all deliveries');

  assert.ok(events.some((e) => e.kind === 'enemy-attack' && e.targetId === CHARACTER_IDS.YOHANI), 'Yohani also attacked');
  assert.ok(events.some((e) => e.kind === 'enemy-attack' && e.targetId === CHARACTER_IDS.SANI), 'Sani also attacked');
});

test('resolveEnemyActionWindow: guard applies across same-target deliveries within one window', () => {
  // Two separate deliveries to the same guarded target (Sani).
  // Guard applies to each delivery since b.activeGuard is only cleared at window end.
  const b = {
    enemyIds: [ENEMY_IDS.CROWN_EAR_BEAST],
    pendingCommands: { [CHARACTER_IDS.SANI]: null },
    activeGuard: { guarderId: CHARACTER_IDS.YOHANI, targetId: CHARACTER_IDS.SANI },
    context: 'authored-solo',
    round: 1,
    snapshotLeaderId: CHARACTER_IDS.YOHANI,
  };
  const state = { party: { members: { [CHARACTER_IDS.SANI]: { level: 1, hp: 100 } } } };
  const deliveries = [
    { targetId: CHARACTER_IDS.SANI, hitCount: 1 },
    { targetId: CHARACTER_IDS.SANI, hitCount: 1 },
  ];
  const { events } = resolveEnemyActionWindow(b, state, 0, deliveries, makeRng(5));

  const intercepts = events.filter((e) => e.kind === 'guard-intercept');
  assert.equal(intercepts.length, 2, 'guard applies to each delivery within the window');
  assert.equal(b.activeGuard, null, 'guard cleared exactly once after window ends');
});

// ── resolveRound — Yohani leader protection ──────────────────────────────────

test('leader protection: yohani-protection event emitted when Yohani leads round-1 random', () => {
  // seed=42 shared: beast targets Yohani (index 0)
  const state = makeTestRandomBattleState(42, { shared: true });
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = DEFEND;
  state.battle.pendingCommands[CHARACTER_IDS.SANI] = DEFEND;
  const r = resolveRound(state);
  assert.equal(r.ok, true);
  assert.ok(r.roundResult.events.some((e) => e.kind === 'yohani-protection'));
});

test('leader protection: applies to Sani when she is targeted in round-1 random (seed=1)', () => {
  // seed=1 shared: beast targets Sani (index 1)
  const state = makeTestRandomBattleState(1, { shared: true });
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
  const state = makeTestRandomBattleState(42);
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

// ── migration ────────────────────────────────────────────────────────────────

test('tryMigrate: v1 non-stub battle is rejected (returns null)', () => {
  const v1State = {
    version: 1,
    mode: 'battle',
    battle: { someField: 'some-value' }, // not an m2Stub — should be rejected
  };
  assert.equal(tryMigrate(v1State), null);
});

test('tryMigrate: v1 m2Stub battle is cleared and migration proceeds', () => {
  const v1State = {
    version: 1,
    mode: 'battle',
    battle: { m2Stub: true },
    progression: {},
    // minimal required fields for migration to not crash
  };
  const result = tryMigrate(v1State);
  assert.ok(result !== null);
  assert.equal(result.version, 2);
  assert.equal(result.battle, null);
  assert.equal(result.mode, 'field');
});

// ── SaveStore suspend round-trip ─────────────────────────────────────────────

test('SaveStore: partial battle commands survive writeSuspend → readSuspend round-trip', () => {
  const storage = new Map();
  const mockStorage = {
    setItem(key, value) { storage.set(key, value); },
    getItem(key) { return storage.get(key) ?? null; },
  };
  const store = new SaveStore(mockStorage);

  const state = makeSharedState(42);
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0; // Yohani submitted
  // Sani's command stays null (partial round-in-progress)

  store.writeSuspend(state);
  const recovered = store.readSuspend();

  assert.ok(recovered, 'readSuspend returns a valid state');
  assert.ok(recovered.battle, 'battle object preserved');
  assert.deepEqual(recovered.battle.pendingCommands[CHARACTER_IDS.YOHANI], ATK0, 'submitted command preserved');
  assert.equal(recovered.battle.pendingCommands[CHARACTER_IDS.SANI], null, 'null command preserved');
  assert.equal(recovered.battle.encounterId, state.battle.encounterId, 'encounterId preserved');
  assert.equal(recovered.battle.round, 1, 'round preserved');
  assert.equal(recovered.battle.rngState, state.battle.rngState, 'rngState preserved through JSON round-trip');
  assert.equal(recovered.mode, 'battle', 'mode preserved through JSON round-trip');
});

test('SaveStore: persisted activeGuard survives writeSuspend → readSuspend round-trip', () => {
  const storage = new Map();
  const mockStorage = {
    setItem(key, value) { storage.set(key, value); },
    getItem(key) { return storage.get(key) ?? null; },
  };
  const store = new SaveStore(mockStorage);

  const state = makeSharedState(42);
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0;
  state.battle.pendingCommands[CHARACTER_IDS.SANI] = DEFEND;
  state.battle.activeGuard = { guarderId: CHARACTER_IDS.YOHANI, targetId: CHARACTER_IDS.SANI };

  store.writeSuspend(state);
  const recovered = store.readSuspend();

  assert.ok(recovered.battle.activeGuard, 'activeGuard preserved through JSON round-trip');
  assert.equal(recovered.battle.activeGuard.guarderId, CHARACTER_IDS.YOHANI, 'guarderId preserved');
  assert.equal(recovered.battle.activeGuard.targetId, CHARACTER_IDS.SANI, 'targetId preserved');
  assert.equal(recovered.mode, 'battle', 'mode preserved');
  assert.equal(recovered.battle.rngState, state.battle.rngState, 'rngState preserved');
});

// ── M3-B: persistence regression (Patch 2 closure) ───────────────────────────

test('SaveStore: battleCarry items survive writeSuspend → readSuspend round-trip', () => {
  const storage = new Map();
  const mockStorage = {
    setItem(key, value) { storage.set(key, value); },
    getItem(key) { return storage.get(key) ?? null; },
  };
  const store = new SaveStore(mockStorage);

  const state = makeTestRandomBattleState(42);
  state.inventory.battleCarry[CHARACTER_IDS.YOHANI] = [{ itemId: ITEM_IDS.HEALING_HERB, uses: 2 }];

  store.writeSuspend(state);
  const recovered = store.readSuspend();

  assert.ok(recovered, 'readSuspend returns valid state');
  const carry = recovered.inventory.battleCarry[CHARACTER_IDS.YOHANI];
  assert.equal(carry.length, 1, 'carry slot count preserved');
  assert.equal(carry[0].itemId, ITEM_IDS.HEALING_HERB, 'itemId preserved through JSON round-trip');
  assert.equal(carry[0].uses, 2, 'uses preserved through JSON round-trip');
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

// ── M3-B: ITEM command (submitCommand) ───────────────────────────────────────

test('submitCommand: ITEM with valid healing-herb slot accepted', () => {
  const state = makeTestRandomBattleState(42);
  state.party.members[CHARACTER_IDS.YOHANI].hp = 10;
  state.inventory.battleCarry[CHARACTER_IDS.YOHANI] = [{ itemId: ITEM_IDS.HEALING_HERB, uses: 1 }];
  const cmd = { type: COMMAND_TYPES.ITEM, slotIdx: 0, targetIdx: 0 };
  const { ok, result } = submitCommand(state, CHARACTER_IDS.YOHANI, cmd);
  assert.equal(ok, true);
  assert.equal(result, 'submitted');
});

test('submitCommand: ITEM with non-battle-usable item (INSCRIBED_STONE_FRAGMENT) rejected', () => {
  const state = makeTestRandomBattleState(42);
  state.inventory.battleCarry[CHARACTER_IDS.YOHANI] = [{ itemId: ITEM_IDS.INSCRIBED_STONE_FRAGMENT, uses: 1 }];
  const cmd = { type: COMMAND_TYPES.ITEM, slotIdx: 0, targetIdx: 0 };
  const { ok, result } = submitCommand(state, CHARACTER_IDS.YOHANI, cmd);
  assert.equal(ok, false);
  assert.equal(result, 'invalid-command');
});

test('submitCommand: ITEM with LUNCH_PARCEL (non-battle quest item) rejected', () => {
  const state = makeTestRandomBattleState(42);
  state.inventory.battleCarry[CHARACTER_IDS.YOHANI] = [{ itemId: ITEM_IDS.LUNCH_PARCEL, uses: 1 }];
  const cmd = { type: COMMAND_TYPES.ITEM, slotIdx: 0, targetIdx: 0 };
  const { ok, result } = submitCommand(state, CHARACTER_IDS.YOHANI, cmd);
  assert.equal(ok, false);
  assert.equal(result, 'invalid-command');
});

test('submitCommand: ITEM with out-of-range slotIdx rejected', () => {
  const state = makeTestRandomBattleState(42);
  state.inventory.battleCarry[CHARACTER_IDS.YOHANI] = [];
  const cmd = { type: COMMAND_TYPES.ITEM, slotIdx: 0, targetIdx: 0 };
  const { ok, result } = submitCommand(state, CHARACTER_IDS.YOHANI, cmd);
  assert.equal(ok, false);
  assert.equal(result, 'invalid-command');
});

test('submitCommand: ITEM targeting a dead party member rejected', () => {
  const state = makeTestRandomBattleState(42, { shared: true });
  state.party.members[CHARACTER_IDS.YOHANI].hp = 10;
  state.party.members[CHARACTER_IDS.SANI].hp = 0; // Sani fallen
  state.inventory.battleCarry[CHARACTER_IDS.YOHANI] = [{ itemId: ITEM_IDS.HEALING_HERB, uses: 1 }];
  const cmd = { type: COMMAND_TYPES.ITEM, slotIdx: 0, targetIdx: 1 }; // target Sani
  const { ok, result } = submitCommand(state, CHARACTER_IDS.YOHANI, cmd);
  assert.equal(ok, false);
  assert.equal(result, 'invalid-command');
});

// ── M3-B: ITEM ownership regression (Patch 2 closure) ────────────────────────

test('submitCommand: ITEM ownership — Sani submit uses Sani carry, not Yohani carry', () => {
  // Yohani has healing herb; Sani's carry is empty.
  // Sani submits ITEM slotIdx=0 → must look up Sani's own carry, not Yohani's.
  const state = makeTestRandomBattleState(42, { shared: true });
  state.inventory.battleCarry[CHARACTER_IDS.YOHANI] = [{ itemId: ITEM_IDS.HEALING_HERB, uses: 1 }];
  state.inventory.battleCarry[CHARACTER_IDS.SANI] = [];
  const cmd = { type: COMMAND_TYPES.ITEM, slotIdx: 0, targetIdx: 0 };
  const { ok, result } = submitCommand(state, CHARACTER_IDS.SANI, cmd);
  assert.equal(ok, false);
  assert.equal(result, 'invalid-command');
});

// ── M3-B: ITEM command (resolveRound) ────────────────────────────────────────

test('resolveRound: healing-herb heals target and removes slot when uses=1 (seed=42)', () => {
  // Yohani HP=10, uses healing-herb on self (targetIdx=0), healHp=12
  // Beast attacks: variance=2, raw=max(1,6-4+2)=4, round-1 leader protection halves → ceil(4*0.5)=2
  // Final HP = 10+12-2 = 20
  const state = makeTestRandomBattleState(42);
  state.party.members[CHARACTER_IDS.YOHANI].hp = 10;
  state.inventory.battleCarry[CHARACTER_IDS.YOHANI] = [{ itemId: ITEM_IDS.HEALING_HERB, uses: 1 }];
  const cmd = { type: COMMAND_TYPES.ITEM, slotIdx: 0, targetIdx: 0 };
  const { nextGameState: s1 } = submitCommand(state, CHARACTER_IDS.YOHANI, cmd);
  const { ok, result, nextGameState, roundResult } = resolveRound(s1);
  assert.equal(ok, true);
  assert.equal(result, 'resolved');
  assert.equal(roundResult.outcome, 'ongoing');
  const useEvent = roundResult.events.find((e) => e.kind === 'item-use');
  assert.ok(useEvent, 'item-use event emitted');
  assert.equal(useEvent.itemId, ITEM_IDS.HEALING_HERB);
  assert.equal(useEvent.healAmt, 12);
  assert.equal(nextGameState.party.members[CHARACTER_IDS.YOHANI].hp, 20); // 10+12-2
  assert.equal(nextGameState.inventory.battleCarry[CHARACTER_IDS.YOHANI].length, 0); // slot removed
});

test('resolveRound: healing-herb with uses=2 decrements to 1, slot preserved (seed=42)', () => {
  const state = makeTestRandomBattleState(42);
  state.party.members[CHARACTER_IDS.YOHANI].hp = 10;
  state.inventory.battleCarry[CHARACTER_IDS.YOHANI] = [{ itemId: ITEM_IDS.HEALING_HERB, uses: 2 }];
  const cmd = { type: COMMAND_TYPES.ITEM, slotIdx: 0, targetIdx: 0 };
  const { nextGameState: s1 } = submitCommand(state, CHARACTER_IDS.YOHANI, cmd);
  const { ok, nextGameState } = resolveRound(s1);
  assert.equal(ok, true);
  const carry = nextGameState.inventory.battleCarry[CHARACTER_IDS.YOHANI];
  assert.equal(carry.length, 1);
  assert.equal(carry[0].uses, 1);
});

// ── M3-B: Equipment stat bonuses in resolver ─────────────────────────────────

test('resolveRound: crude-blade (+2 atk) increases party attack damage (seed=1)', () => {
  // seed=1: Yohani ATK variance=-1 → base dmg=6 (no weapon), blade dmg=8
  const stateNoEquip = makeTestRandomBattleState(1);
  stateNoEquip.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0;
  const { roundResult: rr1 } = resolveRound(stateNoEquip);
  const atkNoEquip = rr1.events.find((e) => e.kind === 'attack');
  assert.equal(atkNoEquip.damage, 6);

  const stateWithBlade = makeTestRandomBattleState(1);
  stateWithBlade.equipment[CHARACTER_IDS.YOHANI].weapon = 'crude-blade';
  stateWithBlade.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0;
  const { roundResult: rr2 } = resolveRound(stateWithBlade);
  const atkWithBlade = rr2.events.find((e) => e.kind === 'attack');
  assert.equal(atkWithBlade.damage, 8);
});

test('resolveRound: iron-shield (+3 def) reduces incoming enemy damage (seed=1)', () => {
  // seed=1: beast variance=2 → raw=max(1,6-4+2)=4; round-1 leader protection: ceil(4*0.5)=2 (no shield)
  // iron-shield: raw=max(1,6-7+2)=1; round-1 protection: ceil(1*0.5)=1 (with shield)
  const stateNoShield = makeTestRandomBattleState(1);
  stateNoShield.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0;
  const { roundResult: rr1 } = resolveRound(stateNoShield);
  const beastAtkNoShield = rr1.events.find((e) => e.kind === 'enemy-attack');
  assert.equal(beastAtkNoShield.damage, 2); // raw 4, halved by round-1 protection

  const stateWithShield = makeTestRandomBattleState(1);
  stateWithShield.equipment[CHARACTER_IDS.YOHANI].shield = 'iron-shield';
  stateWithShield.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0;
  const { roundResult: rr2 } = resolveRound(stateWithShield);
  const beastAtkWithShield = rr2.events.find((e) => e.kind === 'enemy-attack');
  assert.equal(beastAtkWithShield.damage, 1); // iron-shield absorbs 3 def → raw 1, protection still 1
});

// ── M3-B: validateGameState — battleCarry schema ─────────────────────────────

test('validateGameState rejects battleCarry slot with uses=0 (exhausted slots must be removed)', () => {
  const state = makeTestRandomBattleState(42);
  state.inventory.battleCarry[CHARACTER_IDS.YOHANI] = [{ itemId: ITEM_IDS.HEALING_HERB, uses: 0 }];
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects battleCarry slot with uses=3 (max is 2)', () => {
  const state = makeTestRandomBattleState(42);
  state.inventory.battleCarry[CHARACTER_IDS.YOHANI] = [{ itemId: ITEM_IDS.HEALING_HERB, uses: 3 }];
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects LUNCH_PARCEL in battleCarry (non-battle item)', () => {
  const state = makeTestRandomBattleState(42);
  state.inventory.battleCarry[CHARACTER_IDS.YOHANI] = [{ itemId: ITEM_IDS.LUNCH_PARCEL, uses: 1 }];
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects unknown itemId in battleCarry', () => {
  const state = makeTestRandomBattleState(42);
  state.inventory.battleCarry[CHARACTER_IDS.YOHANI] = [{ itemId: 'no-such-item', uses: 1 }];
  assert.equal(validateGameState(state), null);
});

test('validateGameState accepts valid healing-herb in battleCarry (uses=1)', () => {
  const state = makeTestRandomBattleState(42);
  state.inventory.battleCarry[CHARACTER_IDS.YOHANI] = [{ itemId: ITEM_IDS.HEALING_HERB, uses: 1 }];
  assert.ok(validateGameState(state));
});

test('validateGameState accepts valid healing-herb in battleCarry (uses=2)', () => {
  const state = makeTestRandomBattleState(42);
  state.inventory.battleCarry[CHARACTER_IDS.YOHANI] = [{ itemId: ITEM_IDS.HEALING_HERB, uses: 2 }];
  assert.ok(validateGameState(state));
});

// ── M3-B: validateGameState — equipment schema ───────────────────────────────

test('validateGameState rejects equipment with invalid slot for character (Yohani has focus)', () => {
  const state = createInitialGameState();
  // Yohani does not have a 'focus' slot — inject one to break the schema
  state.equipment[CHARACTER_IDS.YOHANI] = { weapon: null, armor: null, focus: null, accessory: null };
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects equipment with item in wrong slot (focus-crystal in Yohani shield slot)', () => {
  const state = createInitialGameState();
  // focus-crystal belongs in 'focus' slot (Sani only); placing it in Yohani's shield slot is invalid
  state.equipment[CHARACTER_IDS.YOHANI].shield = 'focus-crystal';
  assert.equal(validateGameState(state), null);
});

test('validateGameState rejects equipment with incompatible item (iron-shield on Sani)', () => {
  const state = createInitialGameState();
  // iron-shield is only compatible with Yohani (slot=shield); Sani has no shield slot at all,
  // but even if we inject it, the compatibleCharacterIds check must catch incompatibility.
  // We test via the slot check: Sani has 'focus' not 'shield', so iron-shield (slot=shield) mismatches.
  state.equipment[CHARACTER_IDS.SANI] = { weapon: null, armor: null, shield: 'iron-shield', accessory: null };
  assert.equal(validateGameState(state), null);
});

test('validateGameState accepts initial game state (all null equipment slots)', () => {
  const state = createInitialGameState();
  assert.ok(validateGameState(state));
});

test('validateGameState accepts crude-blade on Yohani weapon slot', () => {
  const state = createInitialGameState();
  state.equipment[CHARACTER_IDS.YOHANI].weapon = 'crude-blade';
  assert.ok(validateGameState(state));
});

test('validateGameState accepts iron-shield on Yohani shield slot', () => {
  const state = createInitialGameState();
  state.equipment[CHARACTER_IDS.YOHANI].shield = 'iron-shield';
  assert.ok(validateGameState(state));
});

test('validateGameState accepts focus-crystal on Sani focus slot', () => {
  const state = createInitialGameState();
  state.equipment[CHARACTER_IDS.SANI].focus = 'focus-crystal';
  assert.ok(validateGameState(state));
});

// ── M3-B: validateGameState — shared inventory schema (Patch 2 closure) ──────

test('validateGameState rejects unknown itemId in shared inventory', () => {
  const state = createInitialGameState();
  state.inventory.shared['no-such-item'] = 3;
  assert.equal(validateGameState(state), null);
});

// ── M3-B: validateGameState — battleCarry exact slot schema (Patch 2 closure) ─

test('validateGameState rejects battleCarry slot with extra property', () => {
  const state = makeTestRandomBattleState(42);
  state.inventory.battleCarry[CHARACTER_IDS.YOHANI] = [{ itemId: ITEM_IDS.HEALING_HERB, uses: 1, extra: 'data' }];
  assert.equal(validateGameState(state), null);
});

// ── M3-B: validateGameState — persisted ITEM regression (Patch 2 closure) ────

test('validateGameState accepts persisted ITEM command in pendingCommands', () => {
  // Verifies that a state with an ITEM command in pendingCommands survives validateGameState,
  // which calls validateItemSemantic inside validateBattle.
  const state = makeTestRandomBattleState(42);
  state.party.members[CHARACTER_IDS.YOHANI].hp = 10;
  state.inventory.battleCarry[CHARACTER_IDS.YOHANI] = [{ itemId: ITEM_IDS.HEALING_HERB, uses: 1 }];
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = { type: COMMAND_TYPES.ITEM, slotIdx: 0, targetIdx: 0 };
  assert.ok(validateGameState(state));
});

// ── M3-B: item-failed event (defensive code path) ────────────────────────────

test('resolveRound: item-use fires and item IS consumed when target is alive (normal path)', () => {
  // Complementary test for the item-failed code path. item-failed fires when the target
  // falls during round resolution before the ITEM actor's turn. With current game content
  // (crown-ear-beast speed=6 < Yohani speed=8), enemies always act after party members,
  // making the item-failed path unreachable in normal play — it is defensive coverage for
  // M4+ content with faster enemies. This test verifies the normal (target-alive) path.
  const state = makeTestRandomBattleState(42);
  state.party.members[CHARACTER_IDS.YOHANI].hp = 10;
  state.inventory.battleCarry[CHARACTER_IDS.YOHANI] = [{ itemId: ITEM_IDS.HEALING_HERB, uses: 1 }];
  const cmd = { type: COMMAND_TYPES.ITEM, slotIdx: 0, targetIdx: 0 };
  const { nextGameState: s1 } = submitCommand(state, CHARACTER_IDS.YOHANI, cmd);
  const { ok, roundResult, nextGameState } = resolveRound(s1);
  assert.equal(ok, true);
  assert.ok(roundResult.events.some((e) => e.kind === 'item-use'), 'item-use fires on live target');
  assert.ok(!roundResult.events.some((e) => e.kind === 'item-failed'), 'no item-failed on live target');
  assert.equal(nextGameState.inventory.battleCarry[CHARACTER_IDS.YOHANI].length, 0, 'slot consumed');
});

// ── RT-M3B-001: actor-sequencing / ITEM integration boundary ─────────────────

test('RT-M3B-001 FINAL: resolveActorSequence synthetic enemy-first ordering → item-failed, no consumption', () => {
  // Step 1: commit ITEM command (target Sani alive at commit time)
  const baseState = makeTestRandomBattleState(42, { shared: true });
  baseState.party.members[CHARACTER_IDS.SANI].hp = 1;
  baseState.inventory.battleCarry[CHARACTER_IDS.YOHANI] = [{ itemId: ITEM_IDS.HEALING_HERB, uses: 1 }];
  baseState.battle.pendingCommands[CHARACTER_IDS.SANI] = DEFEND;

  const itemCmd = { type: COMMAND_TYPES.ITEM, slotIdx: 0, targetIdx: 1 };
  const { ok, nextGameState: s1 } = submitCommand(baseState, CHARACTER_IDS.YOHANI, itemCmd);
  assert.equal(ok, true, 'ITEM command accepted — Sani alive at commit time');
  assert.equal(s1.party.members[CHARACTER_IDS.SANI].hp, 1, 'Sani alive post-commit');

  // Step 2: drive resolution through the production actor dispatch loop with synthetic ordering
  const state = structuredClone(s1);
  const b = state.battle;

  // synthetic ordering: enemy acts first (speed 99), then Yohani (speed 8), Sani skipped
  const syntheticActors = [
    { kind: 'enemy', idx: 0, speed: 99 },
    { kind: 'party', id: CHARACTER_IDS.YOHANI, idx: 0, speed: 8 },
  ];
  const syntheticEnemyCmds = [{ type: COMMAND_TYPES.ATTACK, targetIdx: 1 }]; // attack Sani

  const { events } = resolveActorSequence(syntheticActors, b, state, syntheticEnemyCmds, b.rngState);

  // enemy-attack precedes item-failed
  const enemyAttackIdx = events.findIndex((e) => e.kind === 'enemy-attack' && e.targetId === CHARACTER_IDS.SANI);
  const itemFailedIdx = events.findIndex((e) => e.kind === 'item-failed');
  assert.ok(enemyAttackIdx >= 0, 'enemy-attack event present');
  assert.ok(itemFailedIdx >= 0, 'item-failed event present');
  assert.ok(enemyAttackIdx < itemFailedIdx, 'enemy-attack before item-failed');
  assert.equal(events[itemFailedIdx].reason, 'target-fallen');
  assert.ok(!events.some((e) => e.kind === 'item-use'), 'no item-use on fallen target');

  // item NOT consumed
  assert.equal(state.inventory.battleCarry[CHARACTER_IDS.YOHANI].length, 1, 'slot preserved');
  assert.equal(state.inventory.battleCarry[CHARACTER_IDS.YOHANI][0].uses, 1, 'uses unchanged');

  // original committed state untouched
  assert.equal(s1.party.members[CHARACTER_IDS.SANI].hp, 1, 'committed state not mutated');
});

// ── M3-B: applyPartyItemAction — deterministic item-failed coverage (Patch 3) ──

test('applyPartyItemAction: emits item-failed when target hp=0, does NOT consume slot', () => {
  // Synthetic state with dead target — bypasses validateGameState so we can test the
  // item-failed path deterministically without needing a faster enemy in production content.
  const b = {
    partyIds: [CHARACTER_IDS.YOHANI],
    enemyIds: [ENEMY_IDS.CROWN_EAR_BEAST],
    enemies: [{ instanceId: 'crown-ear-beast-0', hp: 18, maxHp: 18 }],
  };
  const state = {
    party: { members: { [CHARACTER_IDS.YOHANI]: { level: 1, hp: 0 } } }, // target dead
    inventory: {
      battleCarry: {
        [CHARACTER_IDS.YOHANI]: [{ itemId: ITEM_IDS.HEALING_HERB, uses: 1 }],
      },
    },
    equipment: {},
  };
  const cmd = { type: COMMAND_TYPES.ITEM, slotIdx: 0, targetIdx: 0 };
  const events = applyPartyItemAction(CHARACTER_IDS.YOHANI, cmd, b, state);

  assert.equal(events.length, 1);
  assert.equal(events[0].kind, 'item-failed');
  assert.equal(events[0].actorId, CHARACTER_IDS.YOHANI);
  assert.equal(events[0].itemId, ITEM_IDS.HEALING_HERB);
  assert.equal(events[0].reason, 'target-fallen');
  // Slot NOT consumed
  assert.equal(state.inventory.battleCarry[CHARACTER_IDS.YOHANI].length, 1);
  assert.equal(state.inventory.battleCarry[CHARACTER_IDS.YOHANI][0].uses, 1);
});

test('applyPartyItemAction: emits item-use and consumes slot when target alive', () => {
  const b = {
    partyIds: [CHARACTER_IDS.YOHANI],
    enemyIds: [ENEMY_IDS.CROWN_EAR_BEAST],
    enemies: [{ instanceId: 'crown-ear-beast-0', hp: 18, maxHp: 18 }],
  };
  const state = {
    party: { members: { [CHARACTER_IDS.YOHANI]: { level: 1, hp: 10 } } },
    inventory: {
      battleCarry: {
        [CHARACTER_IDS.YOHANI]: [{ itemId: ITEM_IDS.HEALING_HERB, uses: 1 }],
      },
    },
    equipment: {},
  };
  const cmd = { type: COMMAND_TYPES.ITEM, slotIdx: 0, targetIdx: 0 };
  const events = applyPartyItemAction(CHARACTER_IDS.YOHANI, cmd, b, state);

  assert.equal(events.length, 1);
  assert.equal(events[0].kind, 'item-use');
  assert.equal(events[0].actorId, CHARACTER_IDS.YOHANI);
  assert.equal(events[0].itemId, ITEM_IDS.HEALING_HERB);
  assert.equal(events[0].healAmt, 12);
  // Slot consumed (uses=1 → removed)
  assert.equal(state.inventory.battleCarry[CHARACTER_IDS.YOHANI].length, 0);
  // HP increased
  assert.equal(state.party.members[CHARACTER_IDS.YOHANI].hp, 22); // 10+12
});

// ── M3-B: validateGameState — ITEM slotIdx regression (Patch 3) ──────────────

test('validateGameState rejects persisted ITEM command with invalid slotIdx (999)', () => {
  const state = makeTestRandomBattleState(42);
  state.party.members[CHARACTER_IDS.YOHANI].hp = 10;
  state.inventory.battleCarry[CHARACTER_IDS.YOHANI] = [{ itemId: ITEM_IDS.HEALING_HERB, uses: 1 }];
  // slotIdx=999 points to non-existent slot in a 1-slot carry → validateItemSemantic rejects
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = { type: COMMAND_TYPES.ITEM, slotIdx: 999, targetIdx: 0 };
  assert.equal(validateGameState(state), null);
});

// ── M3-B: validateGameState — battleCarry extra character key (Patch 3) ───────

test('validateGameState rejects battleCarry with extra unknown character key', () => {
  const state = makeTestRandomBattleState(42);
  state.inventory.battleCarry['unknown-char'] = [];
  assert.equal(validateGameState(state), null);
});

// ── M3-B: SaveStore — equipment weapon round-trip (Patch 3) ──────────────────

test('SaveStore: equipment weapon slot survives writeSuspend → readSuspend round-trip', () => {
  const storage = new Map();
  const mockStorage = {
    setItem(key, value) { storage.set(key, value); },
    getItem(key) { return storage.get(key) ?? null; },
  };
  const store = new SaveStore(mockStorage);

  const state = makeTestRandomBattleState(42);
  state.equipment[CHARACTER_IDS.YOHANI].weapon = 'crude-blade';
  state.battle.pendingCommands[CHARACTER_IDS.YOHANI] = ATK0;

  store.writeSuspend(state);
  const recovered = store.readSuspend();

  assert.ok(recovered, 'readSuspend returns valid state');
  assert.equal(recovered.equipment[CHARACTER_IDS.YOHANI].weapon, 'crude-blade', 'weapon slot preserved through JSON round-trip');
  assert.equal(recovered.equipment[CHARACTER_IDS.SANI].weapon, null, 'other character equipment preserved as null');
});
