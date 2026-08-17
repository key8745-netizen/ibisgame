import { ENEMY_IDS } from './ids.js';

export const OPENING_PHASE = Object.freeze({
  DELIVERY: 'delivery',
  CHANNEL: 'channel-anomaly',
  SOLO_APPROACH: 'solo-approach',
  SANI_STREAM: 'sani-stream',
  CONVERGENCE: 'convergence',
  SHARED_PANIC: 'shared-panic',
  LEADER_TUTORIAL: 'leader-tutorial',
  RETURN: 'return-to-village',
  COMPLETE: 'opening-complete',
});

export const OPENING_PHASES = Object.freeze(Object.values(OPENING_PHASE));

export const OPENING_POINTS = Object.freeze({
  DELIVERY_RECIPIENT: Object.freeze({ x: 342, y: 336, radius: 30 }),
  CHANNEL_OBSERVATION: Object.freeze({ x: 382, y: 294, radius: 34 }),
  SOLO_BEAST: Object.freeze({ x: 326, y: 226, triggerRadius: 82 }),
  SANI_STREAM_TEST: Object.freeze({ x: 612, y: 132, radius: 34 }),
  CONVERGENCE: Object.freeze({ x: 520, y: 246, radius: 38 }),
  SHARED_BEAST: Object.freeze({ x: 632, y: 246 }),
  VILLAGE_AUTHORITY: Object.freeze({ x: 188, y: 194, radius: 36 }),
});

export const OPENING_ENCOUNTERS = Object.freeze({
  SOLO: Object.freeze({ id: 'opening-solo-crown-ear', enemyIds: [ENEMY_IDS.CROWN_EAR_BEAST] }),
  SHARED: Object.freeze({ id: 'opening-shared-crown-ear', enemyIds: [ENEMY_IDS.CROWN_EAR_BEAST] }),
});

export function objectiveForOpening(phase) {
  switch (phase) {
    case OPENING_PHASE.DELIVERY: return '把包好的午飯送到村裡水渠旁。';
    case OPENING_PHASE.CHANNEL: return '看看水渠哪裡不對勁。';
    case OPENING_PHASE.SOLO_APPROACH: return '小心前方的冠耳獸。';
    case OPENING_PHASE.SANI_STREAM: return '珊妮：用葉片確認溪水流向。';
    case OPENING_PHASE.CONVERGENCE: return '到村邊路口和尤哈尼會合。';
    case OPENING_PHASE.SHARED_PANIC: return '注意那隻行為異常的冠耳獸。';
    case OPENING_PHASE.LEADER_TUTORIAL: return '切換一次領隊，確認 Protection / Insight。';
    case OPENING_PHASE.RETURN: return '回溪石村，把觀察到的事情告訴村裡負責的人。';
    case OPENING_PHASE.COMPLETE: return '開場段落完成；下一步將接村內準備與出發。';
    default: return '';
  }
}
