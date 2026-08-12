import { CHARACTER_IDS } from '../content/ids.js';

const CHAR_BASE = Object.freeze({
  [CHARACTER_IDS.YOHANI]: { hp: 24, mp: 4, attack: 7, defense: 4, speed: 8, hpPerLevel: 6, mpPerLevel: 2, atkPerLevel: 2, defPerLevel: 1 },
  [CHARACTER_IDS.SANI]:   { hp: 18, mp: 12, attack: 4, defense: 3, speed: 10, hpPerLevel: 4, mpPerLevel: 3, atkPerLevel: 1, defPerLevel: 1 },
});

export function maxHpAtLevel(id, level) {
  const b = CHAR_BASE[id];
  return b ? b.hp + (level - 1) * b.hpPerLevel : 0;
}

export function maxMpAtLevel(id, level) {
  const b = CHAR_BASE[id];
  return b ? b.mp + (level - 1) * b.mpPerLevel : 0;
}

export function attackAtLevel(id, level) {
  const b = CHAR_BASE[id];
  return b ? b.attack + (level - 1) * b.atkPerLevel : 0;
}

export function defenseAtLevel(id, level) {
  const b = CHAR_BASE[id];
  return b ? b.defense + (level - 1) * b.defPerLevel : 0;
}

export function speedOf(id) {
  const b = CHAR_BASE[id];
  return b ? b.speed : 0;
}
