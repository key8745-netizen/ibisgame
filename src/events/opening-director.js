import { CHARACTER_IDS, ITEM_IDS } from '../content/ids.js';
import { OPENING_ENCOUNTERS, OPENING_PHASE } from '../content/opening.js';
import { createBattleEntry } from '../battle/battle-state.js';

export const OPENING_EVENT = Object.freeze({
  DELIVERED: 'delivered',
  CHANNEL_CONFIRMED: 'channel-confirmed',
  SOLO_BATTLE_STARTED: 'solo-battle-started',
  SOLO_BATTLE_RESOLVED: 'solo-battle-resolved',
  STREAM_CONFIRMED: 'stream-confirmed',
  CLUES_COMPARED: 'clues-compared',
  SHARED_BATTLE_STARTED: 'shared-battle-started',
  SHARED_BATTLE_RESOLVED: 'shared-battle-resolved',
  LEADER_SWITCHED_TO_SANI: 'leader-switched-to-sani',
  REPORTED_TO_VILLAGE: 'reported-to-village',
});

function setFieldActor(state, id, x, y) {
  state.field.controlledId = id;
  state.field.x = x;
  state.field.y = y;
}

function beginBattle(state, encounter) {
  state.mode = 'battle';
  state.battle = createBattleEntry(encounter.id);
}

export function applyOpeningEvent(state, event) {
  const phase = state.progression.openingPhase;
  const flags = state.progression.flags;

  if (phase === OPENING_PHASE.DELIVERY && event === OPENING_EVENT.DELIVERED) {
    state.progression.openingPhase = OPENING_PHASE.CHANNEL;
    flags.deliveryComplete = true;
    delete state.inventory.shared[ITEM_IDS.LUNCH_PARCEL];
    return true;
  }
  if (phase === OPENING_PHASE.CHANNEL && event === OPENING_EVENT.CHANNEL_CONFIRMED) {
    state.progression.openingPhase = OPENING_PHASE.SOLO_APPROACH;
    flags.channelReverseFlowConfirmed = true;
    return true;
  }
  if (phase === OPENING_PHASE.SOLO_APPROACH && event === OPENING_EVENT.SOLO_BATTLE_STARTED) {
    beginBattle(state, OPENING_ENCOUNTERS.SOLO);
    return true;
  }
  if (phase === OPENING_PHASE.SOLO_APPROACH && event === OPENING_EVENT.SOLO_BATTLE_RESOLVED) {
    state.battle = null;
    state.mode = 'field';
    state.progression.openingPhase = OPENING_PHASE.SANI_STREAM;
    flags.soloBattleResolved = true;
    setFieldActor(state, CHARACTER_IDS.SANI, 586, 158);
    return true;
  }
  if (phase === OPENING_PHASE.SANI_STREAM && event === OPENING_EVENT.STREAM_CONFIRMED) {
    state.progression.openingPhase = OPENING_PHASE.CONVERGENCE;
    flags.streamReverseFlowConfirmed = true;
    return true;
  }
  if (phase === OPENING_PHASE.CONVERGENCE && event === OPENING_EVENT.CLUES_COMPARED) {
    state.progression.openingPhase = OPENING_PHASE.SHARED_PANIC;
    state.party.activeIds = [CHARACTER_IDS.YOHANI, CHARACTER_IDS.SANI];
    flags.cluesComparedWithoutCauseClaim = true;
    setFieldActor(state, CHARACTER_IDS.YOHANI, 510, 264);
    return true;
  }
  if (phase === OPENING_PHASE.SHARED_PANIC && event === OPENING_EVENT.SHARED_BATTLE_STARTED) {
    beginBattle(state, OPENING_ENCOUNTERS.SHARED);
    return true;
  }
  if (phase === OPENING_PHASE.SHARED_PANIC && event === OPENING_EVENT.SHARED_BATTLE_RESOLVED) {
    state.battle = null;
    state.mode = 'field';
    state.progression.openingPhase = OPENING_PHASE.LEADER_TUTORIAL;
    state.progression.leaderUnlocked = true;
    flags.sharedBattleResolved = true;
    flags.panickedBeastSubduedAndFled = true;
    state.field.leaderId = CHARACTER_IDS.YOHANI;
    state.field.controlledId = CHARACTER_IDS.YOHANI;
    return true;
  }
  if (phase === OPENING_PHASE.LEADER_TUTORIAL && event === OPENING_EVENT.LEADER_SWITCHED_TO_SANI) {
    state.field.leaderId = CHARACTER_IDS.SANI;
    state.field.controlledId = CHARACTER_IDS.SANI;
    state.progression.openingPhase = OPENING_PHASE.RETURN;
    flags.leaderTutorialComplete = true;
    return true;
  }
  if (phase === OPENING_PHASE.RETURN && event === OPENING_EVENT.REPORTED_TO_VILLAGE) {
    state.progression.openingPhase = OPENING_PHASE.COMPLETE;
    flags.openingReportComplete = true;
    return true;
  }
  return false;
}

export function switchLeader(state) {
  if (!state.progression.leaderUnlocked || state.party.activeIds.length < 2) return false;
  const next = state.field.leaderId === CHARACTER_IDS.YOHANI ? CHARACTER_IDS.SANI : CHARACTER_IDS.YOHANI;
  state.field.leaderId = next;
  state.field.controlledId = next;
  if (state.progression.openingPhase === OPENING_PHASE.LEADER_TUTORIAL && next === CHARACTER_IDS.SANI) {
    applyOpeningEvent(state, OPENING_EVENT.LEADER_SWITCHED_TO_SANI);
  }
  return true;
}

// Test utility: fast-forward an authored opening encounter to its resolved state.
// Used by the M3 integration scaffold in main.js and the opening event graph tests.
// M3-D will replace the main.js call-site with the full resolveRound → battle-UI flow.
export function resolveM2BattleStub(state) {
  if (!state.battle) return false;
  if (state.battle.encounterId === OPENING_ENCOUNTERS.SOLO.id) {
    return applyOpeningEvent(state, OPENING_EVENT.SOLO_BATTLE_RESOLVED);
  }
  if (state.battle.encounterId === OPENING_ENCOUNTERS.SHARED.id) {
    return applyOpeningEvent(state, OPENING_EVENT.SHARED_BATTLE_RESOLVED);
  }
  return false;
}
