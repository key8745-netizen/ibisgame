// 《未完成的星路》C01 關卡定義——所有位置、節點、破損區域的唯一資料來源。
// 防卡設計保證：所有修復節點在 tx ≤ 38，所有破損阻擋區在 tx ≥ 44。

export const TILE = 16;
export const MAP_COLS = 80;
export const MAP_ROWS = 36;
export const WORLD_W = MAP_COLS * TILE;
export const WORLD_H = MAP_ROWS * TILE;
export const SAVE_VERSION = 2;
export const SAVE_KEY = 'ibisgame-c01-v2';
export const CHAR_W = 14;
export const CHAR_H = 14;

// 可行走區域（圖塊座標，含邊界）
export const WALKABLE = {
  upper:  { tx0: 5,  tx1: 74, ty0: 12, ty1: 16 }, // 正式橋面
  tunnel: { tx0: 5,  tx1: 74, ty0: 22, ty1: 26 }, // 地下通道
  west:   { tx0: 5,  tx1: 9,  ty0: 12, ty1: 26 }, // 西側連接梯道
  east:   { tx0: 70, tx1: 75, ty0: 12, ty1: 26 }, // 東側連接梯道
};

export const YOHANI_START = { x: 10 * TILE, y: 14 * TILE };
export const SANI_START   = { x: 10 * TILE, y: 24 * TILE };

// 修復節點——全部在 tx ≤ 38，確保任何修復順序都不會自我封鎖
export const NODE_DEFS = [
  { id: 'support-west', x: 20 * TILE, y: 14 * TILE, type: 'console', required: 'yohani', label: '西側橋梁支撐' },
  { id: 'support-east', x: 38 * TILE, y: 14 * TILE, type: 'console', required: 'yohani', label: '東側橋梁支撐' },
  { id: 'seal-lower',   x: 22 * TILE, y: 24 * TILE, type: 'seal',    required: 'sani',  label: '地下例外道路' },
  { id: 'seal-upper',   x: 38 * TILE, y: 24 * TILE, type: 'seal',    required: 'sani',  label: '上層封鎖標記' },
];

// 破損阻擋區——全部在 tx ≥ 44，位於所有修復節點以東
export const BREACH_DEFS = [
  { id: 'support-west', tx0: 44, tx1: 48, ty0: 12, ty1: 16 },
  { id: 'support-east', tx0: 60, tx1: 64, ty0: 12, ty1: 16 },
  { id: 'seal-lower',   tx0: 44, tx1: 48, ty0: 22, ty1: 26 },
  { id: 'seal-upper',   tx0: 60, tx1: 64, ty0: 22, ty1: 26 },
];

// 受困者——在東側，只有所有節點修復後才可抵達
export const RESCUEE_DEFS = [
  { id: 'formal',      x: 67 * TILE, y: 14 * TILE, name: '橋面居民',   requirement: 'yohani' },
  { id: 'underground', x: 67 * TILE, y: 24 * TILE, name: '地下同行者', requirement: 'sani'  },
  { id: 'child',       x: 72 * TILE, y: 19 * TILE, name: '迷路的孩子', requirement: 'both'   },
];

// 迷路的孩子需要兩人同時在此半徑內（像素）
export const BOTH_RESCUE_RADIUS = 80;

const VALID_NODE_IDS    = new Set(NODE_DEFS.map((n) => n.id));
const VALID_RESCUEE_IDS = new Set(RESCUEE_DEFS.map((r) => r.id));

export function isWalkable(worldX, worldY, repaired) {
  const tx = Math.floor(worldX / TILE);
  const ty = Math.floor(worldY / TILE);
  if (tx < 1 || tx >= MAP_COLS - 1 || ty < 2 || ty >= MAP_ROWS - 2) return false;

  const { upper, tunnel, west, east } = WALKABLE;
  const inZone =
    (tx >= upper.tx0  && tx <= upper.tx1  && ty >= upper.ty0  && ty <= upper.ty1)  ||
    (tx >= tunnel.tx0 && tx <= tunnel.tx1 && ty >= tunnel.ty0 && ty <= tunnel.ty1) ||
    (tx >= west.tx0   && tx <= west.tx1   && ty >= west.ty0   && ty <= west.ty1)   ||
    (tx >= east.tx0   && tx <= east.tx1   && ty >= east.ty0   && ty <= east.ty1);
  if (!inZone) return false;

  for (const { id, tx0, tx1, ty0, ty1 } of BREACH_DEFS) {
    if (!repaired.has(id) && tx >= tx0 && tx <= tx1 && ty >= ty0 && ty <= ty1) return false;
  }
  return true;
}

function _positionValid(x, y, repairedSet) {
  if (x < 0 || x >= WORLD_W || y < 0 || y >= WORLD_H) return false;
  const corners = [
    [x + 2,          y + CHAR_H - 2],
    [x + CHAR_W - 2, y + CHAR_H - 2],
    [x + 2,          y + CHAR_H + 2],
    [x + CHAR_W - 2, y + CHAR_H + 2],
  ];
  return corners.every(([cx, cy]) => isWalkable(cx, cy, repairedSet));
}

export function validateSave(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (raw.version !== SAVE_VERSION) return null;
  const repaired = Array.isArray(raw.repaired)
    ? raw.repaired.filter((id) => VALID_NODE_IDS.has(id))
    : [];
  const rescued = Array.isArray(raw.rescued)
    ? raw.rescued.filter((id) => VALID_RESCUEE_IDS.has(id))
    : [];
  const repairedSet = new Set(repaired);
  let positions = null;
  if (Array.isArray(raw.positions) && raw.positions.length === 2) {
    const ps = raw.positions.map((p) =>
      (p && typeof p.x === 'number' && typeof p.y === 'number' &&
       isFinite(p.x) && isFinite(p.y))
        ? { x: p.x | 0, y: p.y | 0 }
        : null,
    );
    if (ps.every(Boolean) && ps.every((pos) => _positionValid(pos.x, pos.y, repairedSet))) {
      positions = ps;
    }
  }
  return {
    version:   SAVE_VERSION,
    objective: (typeof raw.objective === 'number') ? Math.max(0, Math.min(3, raw.objective | 0)) : 0,
    repaired,
    rescued,
    positions,
  };
}

export function isVictory(repairedSet, rescuedSet) {
  return NODE_DEFS.every((n) => repairedSet.has(n.id)) &&
         RESCUEE_DEFS.every((r) => rescuedSet.has(r.id));
}
