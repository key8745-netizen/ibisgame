import { ABILITY_IDS, CHARACTER_IDS } from '../content/ids.js';
import { ENEMY_STATS } from '../content/enemies.js';
import { attackAtLevel, defenseAtLevel, maxHpAtLevel, speedOf } from '../rpg/stats.js';
import { completeBattleVictory, completeBattleDefeat } from '../rpg/economy.js';
import { validateGameState } from '../state/game-state.js';
import { COMMAND_TYPES } from './commands.js';
import { selectEnemyCommand } from './ai.js';
import { lcgNext, lcgVariance } from './rng.js';

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

  // Collect enemy commands before resolving (AI sees pre-round state)
  const enemyCmds = b.enemies.map((_, i) => {
    const { command, rngState: next } = selectEnemyCommand(i, b, rng);
    rng = next;
    return command;
  });

  const actors = buildActors(b);

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
          const targetId = b.partyIds[cmd.targetIdx];
          b.activeGuard = { targetId };
          events.push({ kind: 'guard-aid', actorId: id, targetId });

        } else if (cmd.abilityId === ABILITY_IDS.STAR_FLAME) {
          const enemy = b.enemies[cmd.targetIdx];
          if (!enemy || enemy.hp <= 0) continue;
          rng = lcgNext(rng);
          const damage = Math.max(1, 6 + (member.level - 1) * 2 + lcgVariance(rng, 2));
          enemy.hp = Math.max(0, enemy.hp - damage);
          events.push({ kind: 'ability', abilityId: ABILITY_IDS.STAR_FLAME, actorId: id, targetKind: 'enemy', targetIdx: cmd.targetIdx, damage });
          if (enemy.hp === 0) events.push({ kind: 'enemy-defeated', enemyIdx: cmd.targetIdx });

        } else if (cmd.abilityId === ABILITY_IDS.MINOR_HEAL) {
          const targetId = b.partyIds[cmd.targetIdx];
          const target = state.party.members[targetId];
          const healAmt = 8 + (member.level - 1) * 2;
          const cap = maxHpAtLevel(targetId, target.level);
          target.hp = Math.min(target.hp + healAmt, cap);
          events.push({ kind: 'ability', abilityId: ABILITY_IDS.MINOR_HEAL, actorId: id, targetId, healAmt });
        }
      }

    } else {
      // enemy turn
      const enemyIdx = actor.idx;
      const enemy = b.enemies[enemyIdx];
      if (enemy.hp <= 0) continue;
      const cmd = enemyCmds[enemyIdx];
      const stats = ENEMY_STATS[b.enemyIds[enemyIdx]];

      if (cmd.type === COMMAND_TYPES.ATTACK) {
        let targetId = b.partyIds[cmd.targetIdx];

        // 護援 intercept: redirect to Yohani when guarded ally is targeted
        if (b.activeGuard?.targetId === targetId) {
          const guarderId = CHARACTER_IDS.YOHANI;
          events.push({ kind: 'guard-intercept', guarderId, originalTargetId: targetId });
          targetId = guarderId;
          b.activeGuard = null;
        }

        const target = state.party.members[targetId];
        if (!target || target.hp <= 0) continue;

        rng = lcgNext(rng);
        const def = defenseAtLevel(targetId, target.level);
        let damage = physDamage(stats.attack, def, lcgVariance(rng, 2));

        if (b.pendingCommands[targetId]?.type === COMMAND_TYPES.DEFEND) {
          damage = Math.ceil(damage / 2);
        }

        // Yohani leader first-round protection (random encounters only)
        if (b.context === 'random' && b.round === 1 && !b.leaderEffectUsed
            && state.field.leaderId === CHARACTER_IDS.YOHANI) {
          if (target.hp - damage <= 0) {
            damage = Math.max(0, target.hp - 1);
            b.leaderEffectUsed = true;
            events.push({ kind: 'yohani-protection', targetId });
          }
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
  else outcome = 'ongoing';

  const roundResult = { round: b.round, events, outcome };

  b.rngState = rng;

  if (outcome === 'ongoing') {
    b.round += 1;
    b.phase = 'command-selection';
    b.pendingCommands = Object.fromEntries(b.partyIds.map((id) => [id, null]));
    b.activeGuard = null;
    state.battle = b;
  } else if (outcome === 'victory') {
    state.battle = b;
    completeBattleVictory(state);
  } else {
    state.battle = b;
    completeBattleDefeat(state);
  }

  const nextGameState = validateGameState(state);
  if (!nextGameState) return { ok: false, result: 'precondition-failed' };

  return { ok: true, result: 'resolved', nextGameState, roundResult };
}
