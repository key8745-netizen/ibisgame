import { moveVillagePosition } from './village-map.js';

export function updateFieldMovement(state, axis, dt, speed = 70) {
  const dx = axis.x * speed * dt;
  const dy = axis.y * speed * dt;
  const next = moveVillagePosition(state.field, dx, dy);
  state.field.x = next.x;
  state.field.y = next.y;
}

export function distanceToFieldPoint(state, point) {
  return Math.hypot(state.field.x - point.x, state.field.y - point.y);
}

export function isNearFieldPoint(state, point) {
  return distanceToFieldPoint(state, point) <= (point.radius ?? point.triggerRadius ?? 28);
}
