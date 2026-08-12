import { ABILITY_IDS, CHARACTER_IDS } from '../content/ids.js';
import { ENEMY_STATS } from '../content/enemies.js';
import { attackAtLevel, defenseAtLevel, maxHpAtLevel, speedOf } from '../rpg/stats.js';
import { applyVictoryRewards, applyDefeatPenalties } from '../rpg/economy.js';
import { validateGameState } from '../state/game-state.js';
import { COMMAND_TYPES } from './commands.js';
import { selectEnemyCommand } from './ai.js';
import { lcgNext, lcgVariance } from './rng.js';
import { applyOpeningEvent, OPENING_EVENT } from '../events/opening-director.js';

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

// Apply the authored opening event for victory, then always clear battle state.
// Called on a structuredClone — safe to mutate.
function applyVictoryTransition(state) {
  applyVictoryRewards(state);

  if (state.battle.context === 'authored-solo') {
    applyOpeningEvent(state, OPENING_EVENT.SOLO_BATTLE_RESOLVED);
  } else if (state.battle.context === 'authored-shared') {
    applyOpeningEvent(state, OPENING_EVENT.SHARED_BATTLE_RESOLVED);
  }

  // Always clear battle — handles random encounters and cases where opening event
  // returned false (wrong phase in test states without full opening flow)
  if (state.battle !== null) {
    state.battle = null;
    state.mode = 'field';
  }
}

// Apply defeat penalties and clear battle state. Called on a structuredClone.
function applyDefeatTransition(state) {
  applyDefeatPenalties(state);
  state.battle = null;
  state.mode = 'field';
}

// Apply escape outcome: clear battle, return to field.
function applyEscapeTransition(state) {
  state.battle = null;
  state.mode = 'field';
}

export function resolveRound(currentGameState) {
  if (!currentGameState?.battle) return { ok: false, result: 'invalid-context' };
  const battle = currentGameState.battle;
  if (battle.phase !== 'command-selection') return { ok: false, result: 'invalid-phase' };
  if (!battle.partyIds.every((id) => battle.pendingCommands[id] !== null)) {
    return { ok: false, result: 'precondition-failed' };
  }

  const state = structuredClone(currentGameState);
  const b = state.battle;
  b.phase = 'resolving';

  let rng = b.rngState;
  const events = [];

  // ── PRE-ROUND EFFECT INITIALIZATION ──────────────────────────────────────────
  // Guard Aid (護援) is established from the committed command set BEFORE any
  // initiative actions execute.  An enemy faster than Yohani cannot bypass a
  // committed guard because the effect is active from the start of the round.
  for (const id of b.partyIds) {
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
        const damage = physDamage(attackAtLevel(id, member.level), enemyStats.defense, lcgVariance(rng, 2));
        enemy.hp = Math.max(0, enemy.hp - damage);
        events.push({ kind: 'attack', actorId: id, targetKind: 'enemy', targetIdx: cmd.targetIdx, damage });
        if (enemy.hp === 0) events.push({ kind: 'enemy-defeated', enemyIdx: cmd.targetIdx });

      } else if (cmd.type === COMMAND_TYPES.DEFEND) {
        events.push({ kind: 'defend', actorId: id });

      } else if (cmd.type === COMMAND_TYPES.ABILITY) {
        if (cmd.abilityId === ABILITY_IDS.GUARD_AID) {
          // Effect already pre-initialized; emit event for presentation layer
          const targetId = b.partyIds[cmd.targetIdx];
          events.push({ kind: 'guard-aid', actorId: id, targetId });

        } else if (cmd.abilityId === ABILITY_IDS.STAR_FLAME) {
          const enemy = b.enemies[cmd.targetIdx];
          if (!enemy || enemy.hp <= 0) continue;
          const mpCost = 3;
          if (member.mp < mpCost) continue;
          member.mp -= mpCost;
          rng = lcgNext(rng);
          const damage = Math.max(1, 6 + (member.level - 1) * 2 + lcgVariance(rng, 2));
          enemy.hp = Math.max(0, enemy.hp - damage);
          events.push({ kind: 'ability', abilityId: ABILITY_IDS.STAR_FLAME, actorId: id, targetKind: 'enemy', targetIdx: cmd.targetIdx, damage });
          if (enemy.hp === 0) events.push({ kind: 'enemy-defeated', enemyIdx: cmd.targetIdx });

        } else if (cmd.abilityId === ABILITY_IDS.MINOR_HEAL) {
          const mpCost = 4;
          if (member.mp < mpCost) continue;
          member.mp -= mpCost;
          const targetId = b.partyIds[cmd.targetIdx];
          const target = state.party.members[targetId];
          const healAmt = 8 + (member.level - 1) * 2;
          const cap = maxHpAtLevel(targetId, target.level);
          target.hp = Math.min(target.hp + healAmt, cap);
          events.push({ kind: 'ability', abilityId: ABILITY_IDS.MINOR_HEAL, actorId: id, targetId, healAmt });
        }

      } else if (cmd.type === COMMAND_TYPES.RUN) {
        if (b.context !== 'random') {
          events.push({ kind: 'run-blocked', actorId: id, reason: 'not-random-encounter' });
        } else {
          rng = lcgNext(rng);
          // 75% success: escaped if rng % 4 !== 0
          const escaped = (rng % 4) !== 0;
          events.push({ kind: 'run-attempt', actorId: id, escaped });
          if (escaped) runEscaped = true;
        }
      }

    } else {
      // ── ENEMY TURN ────────────────────────────────────────────────────────────
      const enemyIdx = actor.idx;
      const enemy = b.enemies[enemyIdx];
      if (enemy.hp <= 0) continue;
      const cmd = enemyCmds[enemyIdx];
      const stats = ENEMY_STATS[b.enemyIds[enemyIdx]];

      if (cmd.type === COMMAND_TYPES.ATTACK) {
        const targetId = b.partyIds[cmd.targetIdx];
        const target = state.party.members[targetId];
        if (!target || target.hp <= 0) continue;

        rng = lcgNext(rng);
        const def = defenseAtLevel(targetId, target.level);
        let damage = physDamage(stats.attack, def, lcgVariance(rng, 2));

        // Defend reduction applies regardless of initiative order
        if (b.pendingCommands[targetId]?.type === COMMAND_TYPES.DEFEND) {
          damage = Math.ceil(damage / 2);
        }

        // 護援 (Guard Aid): if the targeted ally is guarded, apply damage reduction.
        // Guard was pre-initialized before the action loop; consumes on first qualifying hit.
        // If no qualifying hit occurs this round, activeGuard persists to next round.
        if (b.activeGuard?.targetId === targetId) {
          const originalDamage = damage;
          damage = Math.max(1, Math.floor(damage * GUARD_AID_REDUCTION));
          events.push({ kind: 'guard-intercept', guarderId: b.activeGuard.guarderId, originalTargetId: targetId, originalDamage, reducedDamage: damage });
          b.activeGuard = null; // consumed
        }

        // Yohani leader first-round protection (random encounters only).
        // Party-wide: applies to any party member targeted in round 1.
        // Full-round: not consumed per-hit; expires at round boundary naturally (round advances to 2).
        if (b.context === 'random' && b.round === 1 && b.snapshotLeaderId === CHARACTER_IDS.YOHANI) {
          damage = Math.max(1, Math.ceil(damage * LEADER_PROTECTION_REDUCTION));
          events.push({ kind: 'yohani-protection', targetId });
        }

        target.hp = Math.max(0, target.hp - damage);
        events.push({ kind: 'enemy-attack', enemyIdx, targetId, damage });
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
    // activeGuard is NOT cleared here — it persists if no qualifying enemy action consumed it
    state.battle = b;
  } else if (outcome === 'victory') {
    state.battle = b;
    applyVictoryTransition(state);
  } else if (outcome === 'defeat') {
    state.battle = b;
    applyDefeatTransition(state);
  } else {
    // escaped
    state.battle = b;
    applyEscapeTransition(state);
  }

  const nextGameState = validateGameState(state);
  if (!nextGameState) return { ok: false, result: 'precondition-failed' };

  return { ok: true, result: 'resolved', nextGameState, roundResult };
}
