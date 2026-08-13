import { ABILITY_IDS, CHARACTER_IDS } from '../content/ids.js';
import { ENEMY_STATS } from '../content/enemies.js';
import { ITEM_DEFS } from '../content/items.js';
import { attackAtLevel, defenseAtLevel, maxHpAtLevel, speedOf } from '../rpg/stats.js';
import { applyVictoryRewards, applyDefeatPenalties } from '../rpg/economy.js';
import { getAttackBonus, getDefenseBonus } from '../rpg/equipment.js';
import { consumeBattleCarrySlot } from '../rpg/inventory.js';
import { validateGameState } from '../state/game-state.js';
import { COMMAND_TYPES, validateCommand } from './commands.js';
import { selectEnemyCommand } from './ai.js';
import { lcgNext, lcgVariance } from './rng.js';
import { applyOpeningEvent, OPENING_EVENT } from '../events/opening-director.js';
import { OPENING_PHASE } from '../content/opening.js';

const GUARD_AID_REDUCTION = 0.5;
const LEADER_PROTECTION_REDUCTION = 0.5;

function physDamage(atk, def, variance) {
  return Math.max(1, atk - def + variance);
}

function buildActors(battle) {
  const actors = [];
  for (let i = 0; i < battle.partyIds.length; i++) {
    const id = battle.partyIds[i];
    actors.push({ kind: 'party', id, idx: i, speed: speedOf(id) });
  }
  for (let i = 0; i < battle.enemyIds.length; i++) {
    const stats = ENEMY_STATS[battle.enemyIds[i]];
    actors.push({ kind: 'enemy', idx: i, speed: stats.speed });
  }
  actors.sort((a, b) => {
    if (b.speed !== a.speed) return b.speed - a.speed;
    if (a.kind === 'party' && b.kind === 'enemy') return -1;
    if (a.kind === 'enemy' && b.kind === 'party') return 1;
    return 0;
  });
  return actors;
}

// Per-target hit loop. Does NOT mutate b.activeGuard; returns guardConsumed flag
// so resolveEnemyActionWindow can track guard usage across the full action window.
function applyTargetHits(b, state, enemyIdx, targetId, hitCount, rngIn, guardConsumedIn) {
  const events = [];
  const stats = ENEMY_STATS[b.enemyIds[enemyIdx]];
  const target = state.party.members[targetId];
  let rng = rngIn;
  let guardConsumed = guardConsumedIn;

  for (let hit = 0; hit < hitCount; hit++) {
    rng = lcgNext(rng);
    const def = defenseAtLevel(targetId, target.level) + getDefenseBonus(state.equipment, targetId);
    let damage = physDamage(stats.attack, def, lcgVariance(rng, 2));

    if (b.pendingCommands[targetId]?.type === COMMAND_TYPES.DEFEND) {
      damage = Math.ceil(damage / 2);
    }

    // 護援 (Guard Aid): applies to every hit in this action window; b.activeGuard cleared after window.
    if (b.activeGuard?.targetId === targetId) {
      const originalDamage = damage;
      damage = Math.max(1, Math.floor(damage * GUARD_AID_REDUCTION));
      events.push({ kind: 'guard-intercept', guarderId: b.activeGuard.guarderId, originalTargetId: targetId, originalDamage, reducedDamage: damage });
      guardConsumed = true;
    }

    // Yohani leader first-round protection (random encounters only, party-wide).
    if (b.context === 'random' && b.round === 1 && b.snapshotLeaderId === CHARACTER_IDS.YOHANI) {
      damage = Math.max(1, Math.ceil(damage * LEADER_PROTECTION_REDUCTION));
      events.push({ kind: 'yohani-protection', targetId });
    }

    target.hp = Math.max(0, target.hp - damage);
    events.push({ kind: 'enemy-attack', enemyIdx, targetId, damage });
    if (target.hp <= 0) break;
  }

  return { events, rng, guardConsumed };
}

// Canonical multi-delivery enemy action. deliveries = [{ targetId, hitCount }].
// 護援 (Guard Aid) applies to all deliveries targeting the guarded character;
// guard is cleared exactly once after all deliveries complete.
// Exported for action-window test coverage.
export function resolveEnemyActionWindow(b, state, enemyIdx, deliveries, rngIn) {
  const events = [];
  let rng = rngIn;
  let guardConsumed = false;

  for (const { targetId, hitCount } of deliveries) {
    const target = state.party.members[targetId];
    if (!target || target.hp <= 0) continue;
    const { events: targetEvents, rng: nextRng, guardConsumed: consumed } =
      applyTargetHits(b, state, enemyIdx, targetId, hitCount, rng, guardConsumed);
    rng = nextRng;
    guardConsumed = consumed;
    events.push(...targetEvents);
  }

  if (guardConsumed) {
    b.activeGuard = null;
  }

  return { events, rng };
}

// Single-target wrapper — delegates to resolveEnemyActionWindow.
// Preserved for direct test coverage of single-target action windows.
export function resolveEnemyAction(b, state, enemyIdx, targetId, hitCount, rngIn) {
  return resolveEnemyActionWindow(b, state, enemyIdx, [{ targetId, hitCount }], rngIn);
}

// Authored victory transition prevalidation result codes.
const VICTORY_RESULT = Object.freeze({
  RESOLVED: 'resolved',
  INVALID_CONTEXT: 'invalid-context',
  INVALID_PHASE: 'invalid-phase',
  ALREADY_COMPLETED: 'already-completed',
  PRECONDITION_FAILED: 'precondition-failed',
});

// Apply the authored opening event for victory, then clear battle state.
// Called on a structuredClone — safe to mutate.
// Returns a VICTORY_RESULT code.
function applyVictoryTransition(state) {
  const b = state.battle;

  // Prevalidate authored context ↔ opening phase before any reward mutation.
  if (b.context === 'authored-solo') {
    if (state.progression.openingPhase !== OPENING_PHASE.SOLO_APPROACH) {
      return VICTORY_RESULT.INVALID_PHASE;
    }
    if (state.progression.flags.soloBattleResolved) {
      return VICTORY_RESULT.ALREADY_COMPLETED;
    }
  } else if (b.context === 'authored-shared') {
    if (state.progression.openingPhase !== OPENING_PHASE.SHARED_PANIC) {
      return VICTORY_RESULT.INVALID_PHASE;
    }
    if (state.progression.flags.sharedBattleResolved) {
      return VICTORY_RESULT.ALREADY_COMPLETED;
    }
  }

  // All prevalidation passed — apply rewards and authored event.
  applyVictoryRewards(state);

  if (b.context === 'authored-solo') {
    const ok = applyOpeningEvent(state, OPENING_EVENT.SOLO_BATTLE_RESOLVED);
    if (!ok) return VICTORY_RESULT.INVALID_PHASE;
  } else if (b.context === 'authored-shared') {
    const ok = applyOpeningEvent(state, OPENING_EVENT.SHARED_BATTLE_RESOLVED);
    if (!ok) return VICTORY_RESULT.INVALID_PHASE;
  } else {
    // random / boss: no authored opening event; just clear battle
    state.battle = null;
    state.mode = 'field';
  }

  // For authored contexts, opening-director.js clears battle and sets mode=field.
  // If it somehow didn't (e.g., test state without full opening flow), clear explicitly.
  if (state.battle !== null) {
    state.battle = null;
    state.mode = 'field';
  }

  return VICTORY_RESULT.RESOLVED;
}

// Apply defeat penalties and clear battle state. Called on a structuredClone.
// Returns defeatRecord for the presentation layer.
function applyDefeatTransition(state) {
  const moneyLost = applyDefeatPenalties(state);
  state.field.controlledId = state.field.leaderId;
  state.battle = null;
  state.mode = 'field';
  return { moneyLost, retainedEXP: true, retainedItems: true };
}

// Apply escape outcome: clear battle, return to field.
function applyEscapeTransition(state) {
  state.field.controlledId = state.field.leaderId;
  state.battle = null;
  state.mode = 'field';
}

// Submit a single player command into a battle's pending-command slot.
// Validates the command authoritatively against the current battle context.
// Returns { ok, result, nextGameState? }.
export function submitCommand(currentGameState, characterId, command) {
  if (!currentGameState?.battle) return { ok: false, result: 'invalid-context' };
  const battle = currentGameState.battle;
  if (battle.phase !== 'command-selection') return { ok: false, result: 'invalid-phase' };
  if (!battle.partyIds.includes(characterId)) return { ok: false, result: 'invalid-actor' };

  const member = currentGameState.party.members[characterId];
  if (!member || member.hp <= 0) return { ok: false, result: 'fallen-actor' };

  const battleCtx = {
    context: battle.context,
    mp: member.mp,
    enemies: battle.enemies,
    partyIds: battle.partyIds,
  };

  if (!validateCommand(command, characterId, battleCtx)) {
    return { ok: false, result: 'invalid-command' };
  }

  if (command.type === COMMAND_TYPES.ITEM) {
    const carry = currentGameState.inventory?.battleCarry?.[characterId] ?? [];
    const slot = carry[command.slotIdx];
    if (!slot || slot.uses <= 0) return { ok: false, result: 'invalid-command' };
    const itemDef = ITEM_DEFS[slot.itemId];
    if (!itemDef || itemDef.battleTarget === null) return { ok: false, result: 'invalid-command' };
    if (itemDef.battleTarget === 'ally') {
      const tIdx = command.targetIdx;
      if (!Number.isInteger(tIdx) || tIdx < 0) return { ok: false, result: 'invalid-command' };
      const targetId = battle.partyIds[tIdx];
      if (!targetId) return { ok: false, result: 'invalid-command' };
      const targetMember = currentGameState.party.members[targetId];
      if (!targetMember || targetMember.hp <= 0) return { ok: false, result: 'invalid-command' };
    }
  }

  const state = structuredClone(currentGameState);
  state.battle.pendingCommands[characterId] = command;

  const nextGameState = validateGameState(state);
  if (!nextGameState) return { ok: false, result: 'precondition-failed' };

  return { ok: true, result: 'submitted', nextGameState };
}

export function resolveRound(currentGameState) {
  // Pre-check before validateGameState so a wrong phase returns 'invalid-phase', not 'invalid-context'.
  if (!currentGameState?.battle) return { ok: false, result: 'invalid-context' };
  if (currentGameState.battle.phase !== 'command-selection') return { ok: false, result: 'invalid-phase' };

  const validated = validateGameState(currentGameState);
  if (!validated) return { ok: false, result: 'invalid-context' };
  if (!validated.battle) return { ok: false, result: 'invalid-context' };

  // Work on the validated clone — already a structuredClone from validateGameState.
  const state = validated;
  const b = state.battle;

  // Fallen actors (hp=0) are not required for round readiness.
  const livingIds = b.partyIds.filter((id) => state.party.members[id].hp > 0);
  if (!livingIds.every((id) => b.pendingCommands[id] !== null)) {
    return { ok: false, result: 'precondition-failed' };
  }

  b.phase = 'resolving';

  let rng = b.rngState;
  const events = [];

  // ── PRE-ROUND EFFECT INITIALIZATION ──────────────────────────────────────────
  // Guard Aid (護援) is established from the committed command set BEFORE any
  // initiative actions execute. An enemy faster than Yohani cannot bypass a
  // committed guard because the effect is active from the start of the round.
  // Fallen actors cannot establish guard effects.
  for (const id of b.partyIds) {
    if (state.party.members[id].hp <= 0) continue;
    const cmd = b.pendingCommands[id];
    if (cmd?.type === COMMAND_TYPES.ABILITY && cmd.abilityId === ABILITY_IDS.GUARD_AID) {
      const targetId = b.partyIds[cmd.targetIdx];
      if (targetId !== undefined) {
        b.activeGuard = { guarderId: id, targetId };
      }
      break;
    }
  }

  // ── COLLECT ENEMY COMMANDS (pre-round, AI sees current state) ────────────────
  const enemyCmds = b.enemies.map((_, i) => {
    const { command, rngState: next } = selectEnemyCommand(i, b, rng);
    rng = next;
    return command;
  });

  const actors = buildActors(b);
  let runEscaped = false;

  for (const actor of actors) {
    if (runEscaped) break; // successful escape terminates the encounter resolution

    if (actor.kind === 'party') {
      const id = actor.id;
      const member = state.party.members[id];
      if (member.hp <= 0) continue;
      const cmd = b.pendingCommands[id];

      if (cmd.type === COMMAND_TYPES.ATTACK) {
        const enemy = b.enemies[cmd.targetIdx];
        if (!enemy || enemy.hp <= 0) continue;
        const enemyStats = ENEMY_STATS[b.enemyIds[cmd.targetIdx]];
        rng = lcgNext(rng);
        const atk = attackAtLevel(id, member.level) + getAttackBonus(state.equipment, id);
        const damage = physDamage(atk, enemyStats.defense, lcgVariance(rng, 2));
        enemy.hp = Math.max(0, enemy.hp - damage);
        events.push({ kind: 'attack', actorId: id, targetKind: 'enemy', targetIdx: cmd.targetIdx, damage });
        if (enemy.hp === 0) events.push({ kind: 'enemy-defeated', enemyIdx: cmd.targetIdx });

      } else if (cmd.type === COMMAND_TYPES.DEFEND) {
        events.push({ kind: 'defend', actorId: id });

      } else if (cmd.type === COMMAND_TYPES.ABILITY) {
        if (cmd.abilityId === ABILITY_IDS.GUARD_AID) {
          const targetId = b.partyIds[cmd.targetIdx];
          events.push({ kind: 'guard-aid', actorId: id, targetId });

        } else if (cmd.abilityId === ABILITY_IDS.STAR_FLAME) {
          const enemy = b.enemies[cmd.targetIdx];
          if (!enemy || enemy.hp <= 0) continue;
          member.mp -= 3;
          rng = lcgNext(rng);
          const damage = Math.max(1, 6 + (member.level - 1) * 2 + lcgVariance(rng, 2));
          enemy.hp = Math.max(0, enemy.hp - damage);
          events.push({ kind: 'ability', abilityId: ABILITY_IDS.STAR_FLAME, actorId: id, targetKind: 'enemy', targetIdx: cmd.targetIdx, damage });
          if (enemy.hp === 0) events.push({ kind: 'enemy-defeated', enemyIdx: cmd.targetIdx });

        } else if (cmd.abilityId === ABILITY_IDS.MINOR_HEAL) {
          member.mp -= 4;
          const targetId = b.partyIds[cmd.targetIdx];
          const target = state.party.members[targetId];
          const healAmt = 8 + (member.level - 1) * 2;
          const cap = maxHpAtLevel(targetId, target.level);
          target.hp = Math.min(target.hp + healAmt, cap);
          events.push({ kind: 'ability', abilityId: ABILITY_IDS.MINOR_HEAL, actorId: id, targetId, healAmt });
        }

      } else if (cmd.type === COMMAND_TYPES.ITEM) {
        const carry = state.inventory.battleCarry[id] ?? [];
        const slot = carry[cmd.slotIdx];
        if (!slot || slot.uses <= 0) continue;
        const def = ITEM_DEFS[slot.itemId];
        if (!def || def.battleTarget === null) continue;

        const targetIdx = cmd.targetIdx ?? b.partyIds.indexOf(id);
        const targetId = b.partyIds[targetIdx];
        if (!targetId) continue;
        const target = state.party.members[targetId];
        if (!target || target.hp <= 0) continue; // target fell this round — skip

        const itemId = slot.itemId;
        let healAmt = 0;
        if (def.healHp) {
          const cap = maxHpAtLevel(targetId, target.level);
          healAmt = Math.min(def.healHp, cap - target.hp);
          target.hp = Math.min(target.hp + def.healHp, cap);
        }
        consumeBattleCarrySlot(state.inventory, id, cmd.slotIdx);
        events.push({ kind: 'item-use', actorId: id, itemId, targetId, healAmt });

      } else if (cmd.type === COMMAND_TYPES.RUN) {
        if (b.context !== 'random') {
          events.push({ kind: 'run-blocked', actorId: id, reason: 'not-random-encounter' });
        } else {
          rng = lcgNext(rng);
          const escaped = (rng % 4) !== 0;
          events.push({ kind: 'run-attempt', actorId: id, escaped });
          if (escaped) {
            runEscaped = true;
            break; // stop all further actions immediately
          }
        }
      }

    } else {
      // ── ENEMY TURN ────────────────────────────────────────────────────────────
      const enemyIdx = actor.idx;
      const enemy = b.enemies[enemyIdx];
      if (enemy.hp <= 0) continue;
      const cmd = enemyCmds[enemyIdx];

      if (cmd.type === COMMAND_TYPES.ATTACK) {
        const targetId = b.partyIds[cmd.targetIdx];
        const target = state.party.members[targetId];
        if (!target || target.hp <= 0) continue;

        const hitCount = cmd.hitCount ?? 1;
        const { events: actionEvents, rng: nextRng } = resolveEnemyActionWindow(b, state, enemyIdx, [{ targetId, hitCount }], rng);
        rng = nextRng;
        events.push(...actionEvents);
      }
    }
  }

  const allEnemiesDead = b.enemies.every((e) => e.hp <= 0);
  const allPartyDown = b.partyIds.every((id) => state.party.members[id].hp <= 0);

  let outcome;
  if (allEnemiesDead) outcome = 'victory';
  else if (allPartyDown) outcome = 'defeat';
  else if (runEscaped) outcome = 'escaped';
  else outcome = 'ongoing';

  const roundResult = { round: b.round, events, outcome };

  b.rngState = rng;

  if (outcome === 'ongoing') {
    b.round += 1;
    b.phase = 'command-selection';
    b.pendingCommands = Object.fromEntries(b.partyIds.map((id) => [id, null]));
    // Policy B (SSOT: "current or next resolved enemy action window"): activeGuard is NOT
    // cleared at round end. If the enemy did not target the guarded character this round,
    // the guard carries forward and fires on the next qualifying enemy action window.
    state.battle = b;
  } else if (outcome === 'victory') {
    state.battle = b;
    const transitionResult = applyVictoryTransition(state);
    if (transitionResult !== VICTORY_RESULT.RESOLVED) {
      return { ok: false, result: transitionResult };
    }
  } else if (outcome === 'defeat') {
    state.battle = b;
    roundResult.defeatRecord = applyDefeatTransition(state);
  } else {
    // escaped
    state.battle = b;
    applyEscapeTransition(state);
  }

  const nextGameState = validateGameState(state);
  if (!nextGameState) return { ok: false, result: 'precondition-failed' };

  return { ok: true, result: 'resolved', nextGameState, roundResult };
}
