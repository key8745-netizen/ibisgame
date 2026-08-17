import { OPENING_PHASE, OPENING_POINTS } from '../content/opening.js';

export const VILLAGE_WIDTH = 768;
export const VILLAGE_HEIGHT = 480;
const PLAYER_RADIUS = 6;

const BUILDINGS = Object.freeze([
  { x: 72, y: 76, w: 116, h: 72 },
  { x: 224, y: 64, w: 104, h: 78 },
  { x: 72, y: 222, w: 112, h: 76 },
  { x: 224, y: 224, w: 98, h: 70 },
]);

function inRect(x, y, rect, pad = 0) {
  return x >= rect.x - pad && x <= rect.x + rect.w + pad && y >= rect.y - pad && y <= rect.y + rect.h + pad;
}

function channelBlocked(x, y, pad) {
  if (y >= 205 - pad && y <= 235 + pad) return false;
  if (y >= 322 - pad && y <= 348 + pad) return false;
  return inRect(x, y, { x: 405, y: 16, w: 30, h: 448 }, pad);
}

function streamBlocked(x, y, pad) {
  const bands = [
    { x: 548, y: 78, w: 190, h: 18 },
    { x: 570, y: 96, w: 168, h: 18 },
    { x: 600, y: 114, w: 138, h: 18 },
  ];
  return bands.some((rect) => inRect(x, y, rect, pad));
}

export function canOccupyVillage(x, y, radius = PLAYER_RADIUS) {
  if (x < radius || y < radius || x > VILLAGE_WIDTH - radius || y > VILLAGE_HEIGHT - radius) return false;
  if (BUILDINGS.some((rect) => inRect(x, y, rect, radius))) return false;
  if (channelBlocked(x, y, radius)) return false;
  if (streamBlocked(x, y, radius)) return false;
  return true;
}

export function moveVillagePosition(position, dx, dy) {
  const next = { x: position.x, y: position.y };
  if (canOccupyVillage(position.x + dx, position.y)) next.x += dx;
  if (canOccupyVillage(next.x, position.y + dy)) next.y += dy;
  return next;
}

export function isReverseFlowActive(state) {
  if (state.progression.openingPhase === OPENING_PHASE.DELIVERY) return false;
  return state.progression.flags.localStarMarkerStabilized !== true;
}

function wr(p, camera, x, y, w, h, color) {
  p.rect(x - camera.x, y - camera.y, w, h, color);
}

function drawBuilding(p, camera, rect, roof) {
  wr(p, camera, rect.x, rect.y, rect.w, rect.h, '#c9a36f');
  wr(p, camera, rect.x - 4, rect.y - 10, rect.w + 8, 18, roof);
  wr(p, camera, rect.x + 44, rect.y + rect.h - 22, 18, 22, '#5b3a28');
}

function drawWater(p, camera, time, reverse) {
  wr(p, camera, 405, 16, 30, 448, '#315f78');
  const dir = reverse ? -1 : 1;
  for (let y = 24; y < 458; y += 18) {
    const offset = ((time * 20 * dir) % 18 + 18) % 18;
    wr(p, camera, 410, y + offset - 9, 18, 2, '#82b7c5');
  }
  wr(p, camera, 399, 205, 42, 30, '#8b7250');
  wr(p, camera, 399, 322, 42, 26, '#8b7250');
}

function drawStream(p, camera, time, reverse) {
  const bands = [
    { x: 548, y: 78, w: 190 },
    { x: 570, y: 96, w: 168 },
    { x: 600, y: 114, w: 138 },
  ];
  for (const band of bands) wr(p, camera, band.x, band.y, band.w, 18, '#35687d');
  const dir = reverse ? -1 : 1;
  const offset = ((time * 18 * dir) % 26 + 26) % 26;
  for (let x = 560; x < 730; x += 30) wr(p, camera, x + offset - 13, 91, 12, 2, '#8bc0cd');
}

export function drawVillage(p, camera, state, time) {
  p.rect(0, 0, 480, 270, '#6f9a5d');
  for (let y = 0; y < VILLAGE_HEIGHT; y += 32) {
    for (let x = 0; x < VILLAGE_WIDTH; x += 32) {
      if (((x + y) / 32) % 2 === 0) wr(p, camera, x, y, 32, 32, '#739f61');
    }
  }

  wr(p, camera, 20, 168, 728, 46, '#b89c6e');
  wr(p, camera, 136, 18, 42, 438, '#b89c6e');
  wr(p, camera, 320, 190, 252, 34, '#b89c6e');
  wr(p, camera, 470, 214, 34, 132, '#b89c6e');

  drawBuilding(p, camera, BUILDINGS[0], '#7c4d3b');
  drawBuilding(p, camera, BUILDINGS[1], '#705044');
  drawBuilding(p, camera, BUILDINGS[2], '#80513d');
  drawBuilding(p, camera, BUILDINGS[3], '#745347');

  const phase = state.progression.openingPhase;
  const reverse = isReverseFlowActive(state);
  drawWater(p, camera, time, reverse);
  drawStream(p, camera, time, reverse);

  wr(p, camera, 168, 170, 40, 28, '#6d5742');
  wr(p, camera, 174, 164, 28, 8, '#d5bd88');

  drawVillager(p, camera, OPENING_POINTS.DELIVERY_RECIPIENT.x, OPENING_POINTS.DELIVERY_RECIPIENT.y, '#596b8a');
  if (phase === OPENING_PHASE.CONVERGENCE) {
    drawActor(p, camera, OPENING_POINTS.CONVERGENCE.x, OPENING_POINTS.CONVERGENCE.y, 'yohani');
  }
}

export function drawActor(p, camera, x, y, id) {
  const body = id === 'sani' ? '#675087' : '#8a633c';
  const accent = id === 'sani' ? '#9a7db8' : '#c69a61';
  wr(p, camera, x - 5, y - 10, 10, 14, body);
  wr(p, camera, x - 3, y - 15, 6, 6, '#edc89d');
  wr(p, camera, x - 5, y + 4, 4, 5, accent);
  wr(p, camera, x + 1, y + 4, 4, 5, accent);
}

export function drawVillager(p, camera, x, y, color) {
  wr(p, camera, x - 5, y - 9, 10, 13, color);
  wr(p, camera, x - 3, y - 14, 6, 6, '#d9b48e');
}

export function drawCrownEarBeast(p, camera, x, y, pose = 'alert') {
  const ox = x - camera.x;
  const oy = y - camera.y;
  const dark = '#7b4c2e';
  const mid = '#a96f3d';
  const cream = '#e7d3a2';
  p.rect(ox - 9, oy - 6, 18, 10, mid);
  p.rect(ox - 13, oy - 4, 7, 7, dark);
  p.rect(ox + 7, oy - 2, 12, 5, dark);
  p.rect(ox - 8, oy + 3, 4, 6, dark);
  p.rect(ox + 4, oy + 3, 4, 6, dark);
  p.rect(ox - 8, oy - 11, 5, 7, dark);
  p.rect(ox + 2, oy - 11, 5, 7, dark);
  const earShift = pose === 'panic' ? 3 : 0;
  p.rect(ox - 10, oy - 15 + earShift, 2, 5, dark);
  p.rect(ox - 7, oy - 17 + earShift, 2, 7, dark);
  p.rect(ox - 4, oy - 15 + earShift, 2, 5, dark);
  p.rect(ox + 2, oy - 15 + earShift, 2, 5, dark);
  p.rect(ox + 5, oy - 17 + earShift, 2, 7, dark);
  p.rect(ox + 8, oy - 15 + earShift, 2, 5, dark);
  p.rect(ox - 6, oy - 10, 3, 4, cream);
  p.rect(ox + 3, oy - 10, 3, 4, cream);
  p.rect(ox - 2, oy - 13, 2, 3, '#d6c08e');
}
