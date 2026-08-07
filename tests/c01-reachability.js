// C01 可達性測試——BFS 驗證 24 種節點順序 + 6 種救援順序 + 連接梯道 + 存檔強化。無外部依賴。
import {
  TILE, MAP_COLS, MAP_ROWS, WORLD_W, WORLD_H,
  NODE_DEFS, BREACH_DEFS, RESCUEE_DEFS,
  YOHANI_START, SANI_START, BOTH_RESCUE_RADIUS,
  isWalkable, validateSave, SAVE_VERSION,
} from '../src/c01-level.js';

// ── BFS ───────────────────────────────────────────────────────────────────────

function bfsCanReach(startPx, startPy, targetPx, targetPy, repairedSet) {
  const sx = Math.floor(startPx / TILE);
  const sy = Math.floor(startPy / TILE);
  const gx = Math.floor(targetPx / TILE);
  const gy = Math.floor(targetPy / TILE);

  if (sx === gx && sy === gy) return true;
  if (!isWalkable((sx + 0.5) * TILE, (sy + 0.5) * TILE, repairedSet)) return false;

  const key  = (x, y) => x * 200 + y;
  const visited = new Set([key(sx, sy)]);
  const queue   = [[sx, sy]];

  while (queue.length > 0) {
    const [cx, cy] = queue.shift();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx;
      const ny = cy + dy;
      const nk = key(nx, ny);
      if (visited.has(nk)) continue;
      visited.add(nk);
      if (!isWalkable((nx + 0.5) * TILE, (ny + 0.5) * TILE, repairedSet)) continue;
      if (nx === gx && ny === gy) return true;
      queue.push([nx, ny]);
    }
  }
  return false;
}

// ── 全排列 ───────────────────────────────────────────────────────────────────

function permutations(arr) {
  if (arr.length <= 1) return [arr.slice()];
  const result = [];
  for (let i = 0; i < arr.length; i += 1) {
    const rest = arr.filter((_, j) => j !== i);
    for (const p of permutations(rest)) result.push([arr[i], ...p]);
  }
  return result;
}

// ── 測試：24 種節點修復順序 ──────────────────────────────────────────────────

function testNodeOrderings() {
  const indices = NODE_DEFS.map((_, i) => i);
  const perms   = permutations(indices);
  const failures = [];

  for (const perm of perms) {
    const repairedSet = new Set();

    for (const nodeIdx of perm) {
      const node = NODE_DEFS[nodeIdx];
      const start = node.required === 'yohani' ? YOHANI_START : SANI_START;

      if (!bfsCanReach(start.x, start.y, node.x, node.y, repairedSet)) {
        failures.push(`順序 [${perm.map((i) => NODE_DEFS[i].id).join(' → ')}] 卡關於 ${node.id}`);
        break;
      }
      repairedSet.add(node.id);
    }
  }

  return { label: `節點順序（${perms.length}/24）`, failures };
}

// ── 測試：6 種救援順序 ────────────────────────────────────────────────────────

function testRescueOrderings() {
  const allRepaired = new Set(NODE_DEFS.map((n) => n.id));
  const rIndices    = RESCUEE_DEFS.map((_, i) => i);
  const perms       = permutations(rIndices);
  const failures    = [];

  for (const perm of perms) {
    for (const rIdx of perm) {
      const r = RESCUEE_DEFS[rIdx];

      if (r.requirement === 'yohani') {
        if (!bfsCanReach(YOHANI_START.x, YOHANI_START.y, r.x, r.y, allRepaired)) {
          failures.push(`救援順序 [${perm.map((i) => RESCUEE_DEFS[i].id).join(' → ')}]：尤哈尼無法抵達 ${r.id}`);
          break;
        }
      } else if (r.requirement === 'sani') {
        if (!bfsCanReach(SANI_START.x, SANI_START.y, r.x, r.y, allRepaired)) {
          failures.push(`救援順序 [${perm.map((i) => RESCUEE_DEFS[i].id).join(' → ')}]：珊妮無法抵達 ${r.id}`);
          break;
        }
      } else if (r.requirement === 'both') {
        const yOk = bfsCanReach(YOHANI_START.x, YOHANI_START.y, r.x, r.y, allRepaired);
        const sOk = bfsCanReach(SANI_START.x,  SANI_START.y,  r.x, r.y, allRepaired);
        if (!yOk || !sOk) {
          failures.push(`救援順序 [${perm.map((i) => RESCUEE_DEFS[i].id).join(' → ')}]：` +
            `${!yOk ? '尤哈尼' : '珊妮'} 無法抵達 ${r.id}`);
          break;
        }
      }
    }
  }

  return { label: `救援順序（${perms.length}/6）`, failures };
}

// ── 測試：存檔驗證 ────────────────────────────────────────────────────────────

function testSaveValidation() {
  const failures = [];

  const validSave = {
    version: SAVE_VERSION,
    objective: 2,
    repaired: ['support-west', 'support-east'],
    rescued: ['formal'],
    positions: [{ x: 320, y: 224 }, { x: 320, y: 384 }],
  };

  if (!validateSave(validSave)) failures.push('有效存檔被拒絕');
  if (validateSave({ ...validSave, version: 1 })) failures.push('舊版 (v1) 存檔應被拒絕');
  if (validateSave({ ...validSave, version: 999 })) failures.push('未來版本存檔應被拒絕');
  if (validateSave(null)) failures.push('null 應被拒絕');
  if (validateSave('string')) failures.push('字串應被拒絕');

  const withBadNode = validateSave({ ...validSave, repaired: ['support-west', 'hacker-inject'] });
  if (withBadNode && withBadNode.repaired.includes('hacker-inject')) {
    failures.push('非法節點 ID 應被過濾');
  }

  const withBadPos = validateSave({ ...validSave, positions: [{ x: NaN, y: 0 }, { x: 0, y: 0 }] });
  if (withBadPos && withBadPos.positions !== null) {
    failures.push('NaN 座標存檔的 positions 應為 null');
  }

  return { label: '存檔驗證', failures };
}

// ── 測試：破損區與節點不重疊 ─────────────────────────────────────────────────

function testNoSelfBlock() {
  const failures = [];

  for (const node of NODE_DEFS) {
    const tx = Math.floor(node.x / TILE);
    const ty = Math.floor(node.y / TILE);
    for (const breach of BREACH_DEFS) {
      if (tx >= breach.tx0 && tx <= breach.tx1 && ty >= breach.ty0 && ty <= breach.ty1) {
        failures.push(`節點 ${node.id} 在自身破損區內 (tx=${tx} ty=${ty} breach=${JSON.stringify(breach)})`);
      }
    }
  }

  return { label: '節點不在破損區內', failures };
}

// ── 測試：連接梯道雙向可達 ────────────────────────────────────────────────────

function testConnectors() {
  const failures    = [];
  const noRepairs   = new Set();
  const allRepaired = new Set(NODE_DEFS.map((n) => n.id));

  // 西連接梯道：無修復即可上下互通
  const wUpX = 7 * TILE + TILE / 2;  const wUpY  = 14 * TILE + TILE / 2;
  const wDnX = 7 * TILE + TILE / 2;  const wDnY  = 24 * TILE + TILE / 2;
  if (!bfsCanReach(wUpX, wUpY, wDnX, wDnY, noRepairs))
    failures.push('西連接梯道：上層→地道 無修復時不可達');
  if (!bfsCanReach(wDnX, wDnY, wUpX, wUpY, noRepairs))
    failures.push('西連接梯道：地道→上層 無修復時不可達');

  // 東連接梯道：需全修復方可上下互通
  const eUpX = 72 * TILE + TILE / 2; const eUpY  = 14 * TILE + TILE / 2;
  const eDnX = 72 * TILE + TILE / 2; const eDnY  = 24 * TILE + TILE / 2;
  if (!bfsCanReach(eUpX, eUpY, eDnX, eDnY, allRepaired))
    failures.push('東連接梯道：上層→地道 全修復後不可達');
  if (!bfsCanReach(eDnX, eDnY, eUpX, eUpY, allRepaired))
    failures.push('東連接梯道：地道→上層 全修復後不可達');

  // 兩個角色都能抵達迷路的孩子（全修復）
  const child = RESCUEE_DEFS.find((r) => r.requirement === 'both');
  if (!bfsCanReach(YOHANI_START.x, YOHANI_START.y, child.x, child.y, allRepaired))
    failures.push('尤哈尼全修復後無法抵達迷路的孩子');
  if (!bfsCanReach(SANI_START.x,  SANI_START.y,  child.x, child.y, allRepaired))
    failures.push('珊妮全修復後無法抵達迷路的孩子');

  return { label: '連接梯道雙向可達 + 孩子可達', failures };
}

// ── 測試：存檔驗證（擴充）────────────────────────────────────────────────────

function testSaveValidationExtended() {
  const failures = [];
  const basePos  = [
    { x: YOHANI_START.x, y: YOHANI_START.y },
    { x: SANI_START.x,  y: SANI_START.y  },
  ];
  const base = { version: SAVE_VERSION, objective: 0, repaired: [], rescued: [], positions: basePos };

  // 起始點座標應通過
  const valid = validateSave(base);
  if (!valid || valid.positions === null)
    failures.push('起始點座標應為有效 positions');

  // OOB — x < 0：positions 設為 null，整份存檔仍有效
  const oobNegX = validateSave({ ...base, positions: [{ x: -1, y: YOHANI_START.y }, basePos[1]] });
  if (!oobNegX)               failures.push('x<0 不應拒絕整份存檔');
  if (oobNegX && oobNegX.positions !== null) failures.push('x<0 應使 positions=null');

  // OOB — x >= WORLD_W
  const oobMaxX = validateSave({ ...base, positions: [{ x: WORLD_W, y: YOHANI_START.y }, basePos[1]] });
  if (oobMaxX && oobMaxX.positions !== null) failures.push('x>=WORLD_W 應使 positions=null');

  // OOB — y < 0
  const oobNegY = validateSave({ ...base, positions: [basePos[0], { x: SANI_START.x, y: -1 }] });
  if (oobNegY && oobNegY.positions !== null) failures.push('y<0 應使 positions=null');

  // OOB — y >= WORLD_H
  const oobMaxY = validateSave({ ...base, positions: [basePos[0], { x: SANI_START.x, y: WORLD_H }] });
  if (oobMaxY && oobMaxY.positions !== null) failures.push('y>=WORLD_H 應使 positions=null');

  // Infinity
  const infPos = validateSave({ ...base, positions: [{ x: Infinity, y: YOHANI_START.y }, basePos[1]] });
  if (infPos && infPos.positions !== null) failures.push('Infinity 座標應使 positions=null');

  // 非可行走區域（所有區域外）
  const nonWalk = validateSave({ ...base, positions: [{ x: 50 * TILE, y: 5 * TILE }, basePos[1]] });
  if (nonWalk && nonWalk.positions !== null) failures.push('不可行走區域座標應使 positions=null');

  // 破損區（未修復）— support-west: tx:44-48, ty:12-16
  const breachX = 45 * TILE, breachY = 14 * TILE;
  const inBreach = validateSave({ ...base, repaired: [], positions: [{ x: breachX, y: breachY }, basePos[1]] });
  if (inBreach && inBreach.positions !== null)
    failures.push('破損區（未修復）座標應使 positions=null');

  // 破損區（已修復）— 應為有效
  const fixedBreach = validateSave({ ...base, repaired: ['support-west'], positions: [{ x: breachX, y: breachY }, basePos[1]] });
  if (!fixedBreach || fixedBreach.positions === null)
    failures.push('修復後破損區座標應為有效 positions');

  // 無效位置不應拒絕整份存檔——repaired/rescued 應保留
  if (!oobNegX || !Array.isArray(oobNegX.repaired))
    failures.push('positions 無效時 repaired 應仍被保留');

  return { label: '存檔驗證（擴充）', failures };
}

// ── 渲染結果 ──────────────────────────────────────────────────────────────────

function render(suites) {
  const allPass = suites.every((s) => s.failures.length === 0);
  const lines   = [];

  for (const suite of suites) {
    const ok = suite.failures.length === 0;
    lines.push(`${ok ? '✓ PASS' : '✗ FAIL'}  ${suite.label}`);
    for (const f of suite.failures) lines.push(`        ⚠ ${f}`);
  }

  const el = document.getElementById('output');
  el.innerHTML = `
    <div class="result ${allPass ? 'pass' : 'fail'}">
      ${allPass ? '全部測試通過' : '測試失敗'}
    </div>
    <pre>${lines.join('\n')}</pre>
    <div class="verdict ${allPass ? 'pass' : 'fail'}">
      ${allPass ? 'PASS CANDIDATE' : 'BLOCKED'}
    </div>`;
}

// ── 執行 ─────────────────────────────────────────────────────────────────────

const suites = [
  testNoSelfBlock(),
  testNodeOrderings(),
  testRescueOrderings(),
  testSaveValidation(),
  testConnectors(),
  testSaveValidationExtended(),
];

render(suites);
