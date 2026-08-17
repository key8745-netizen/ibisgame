// Serializable LCG — state is a single non-zero uint32
export function lcgNext(state) {
  return ((Math.imul(state, 1664525) + 1013904223) >>> 0) || 1;
}

export function lcgFloat(state) {
  return state / 0x100000000;
}

export function lcgInt(state, n) {
  return state % n;
}

// Signed variance in [-range, range]
export function lcgVariance(state, range) {
  return (state % (range * 2 + 1)) - range;
}

export function makeRng(seed) {
  return ((seed ^ 0xDEADBEEF) >>> 0) || 1;
}
