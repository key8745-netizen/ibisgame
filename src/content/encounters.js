import { CHARACTER_IDS, ENEMY_IDS } from './ids.js';
import { OPENING_ENCOUNTERS } from './opening.js';

export const ENCOUNTER_CONTEXT = Object.freeze({
  AUTHORED_SOLO: 'authored-solo',
  AUTHORED_SHARED: 'authored-shared',
  RANDOM: 'random',
});

export const ENCOUNTER_CONTEXTS = Object.freeze(Object.values(ENCOUNTER_CONTEXT));

export const ENCOUNTERS = Object.freeze({
  [OPENING_ENCOUNTERS.SOLO.id]: Object.freeze({
    id: OPENING_ENCOUNTERS.SOLO.id,
    context: ENCOUNTER_CONTEXT.AUTHORED_SOLO,
    partyIds: Object.freeze([CHARACTER_IDS.YOHANI]),
    enemyIds: Object.freeze([...OPENING_ENCOUNTERS.SOLO.enemyIds]),
  }),
  [OPENING_ENCOUNTERS.SHARED.id]: Object.freeze({
    id: OPENING_ENCOUNTERS.SHARED.id,
    context: ENCOUNTER_CONTEXT.AUTHORED_SHARED,
    partyIds: Object.freeze([CHARACTER_IDS.YOHANI, CHARACTER_IDS.SANI]),
    enemyIds: Object.freeze([...OPENING_ENCOUNTERS.SHARED.enemyIds]),
  }),
});

export const KNOWN_ENCOUNTER_IDS = Object.freeze(new Set(Object.keys(ENCOUNTERS)));
