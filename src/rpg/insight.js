// Sani's Insight domain helper — derives a condition band from HP ratio.
// Presentation gating (showing/hiding the band) is handled by M3-D UI code.
// Thresholds are tunable here without touching any display logic.

const INJURED_THRESHOLD = 0.5;   // hp/maxHp <= 0.5 → 受傷
const CRITICAL_THRESHOLD = 0.2;  // hp/maxHp <= 0.2 → 危急

export function getSaniConditionBand(hp, maxHp) {
  if (!Number.isFinite(hp) || !Number.isFinite(maxHp) || maxHp <= 0) return '危急';
  const ratio = hp / maxHp;
  if (ratio > INJURED_THRESHOLD) return '穩定';
  if (ratio > CRITICAL_THRESHOLD) return '受傷';
  return '危急';
}
