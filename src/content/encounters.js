import { CHARACTER_IDS, ENEMY_IDS } from './ids.js';
import { OPENING_ENCOUNTERS } from './opening.js';

export const ENCOUNTER_CONTEXT = Object.freeze({
  AUTHORED_SOLO: 'authored-solo',
  AUTHORED_SHARED: 'authored-shared',
  RANDOM: 'random',
  BOSS: 'boss',
});

export const ENCOUNTER_CONTEXTS = Object.freeze(Object.values(ENCOUNTER_CONTEXT));

export const OPENING_ENCOUNTER_DEFS = Object.freeze({
  SOLO: Object.freeze({
    id: OPENING_ENCOUNTERS.SOLO.id,
    context: ENCOUNTER_CONTEXT.AUTHORED_SOLO,
    partyIds: Object.freeze([CHARACTER_IDS.YOHANI]),
    enemyIds: Object.freeze([...OPENING_ENCOUNTERS.SOLO.enemyIds]),
  }),
  SHARED: Object.freeze({
    id: OPENING_ENCOUNTERS.SHARED.id,
    context: ENCOUNTER_CONTEXT.AUTHORED_SHARED,
    partyIds: Object.freeze([CHARACTER_IDS.YOHANI, CHARACTER_IDS.SANI]),
    enemyIds: Object.freeze([...OPENING_ENCOUNTERS.SHARED.enemyIds]),
  }),
});

// Random encounters: partyIds is null — party composition comes from party.activeIds snapshot at entry
export const RANDOM_ENCOUNTER_DEFS = Object.freeze({
  SOLO_CROWN_EAR: Object.freeze({
    id: 'random-solo-crown-ear',
    context: ENCOUNTER_CONTEXT.RANDOM,
    partyIds: null,
    enemyIds: Object.freeze([ENEMY_IDS.CROWN_EAR_BEAST]),
  }),
  SHARED_CROWN_EAR: Object.freeze({
    id: 'random-shared-crown-ear',
    context: ENCOUNTER_CONTEXT.RANDOM,
    partyIds: null,
    enemyIds: Object.freeze([ENEMY_IDS.CROWN_EAR_BEAST]),
  }),
});

export const ENCOUNTERS = Object.freeze({
  [OPENING_ENCOUNTER_DEFS.SOLO.id]: OPENING_ENCOUNTER_DEFS.SOLO,
  [OPENING_ENCOUNTER_DEFS.SHARED.id]: OPENING_ENCOUNTER_DEFS.SHARED,
  [RANDOM_ENCOUNTER_DEFS.SOLO_CROWN_EAR.id]: RANDOM_ENCOUNTER_DEFS.SOLO_CROWN_EAR,
  [RANDOM_ENCOUNTER_DEFS.SHARED_CROWN_EAR.id]: RANDOM_ENCOUNTER_DEFS.SHARED_CROWN_EAR,
});

export const KNOWN_ENCOUNTER_IDS = Object.freeze(new Set(Object.keys(ENCOUNTERS)));
