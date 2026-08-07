// C01 可達性測試——BFS 驗證 24 種節點順序 + 6 種救援順序。無外部依賴。
import {
  TILE, MAP_COLS, MAP_ROWS,
  NODE_DEFS, BREACH_DEFS, RESCUEE_DEFS,
  YOHANI_START, SHANI_START, BOTH_RESCUE_RADIUS,
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
      const start = node.required === 'yohani' ? YOHANI_START : SHANI_START;

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
      } else if (r.requirement === 'shani') {
        if (!bfsCanReach(SHANI_START.x, SHANI_START.y, r.x, r.y, allRepaired)) {
          failures.push(`救援順序 [${perm.map((i) => RESCUEE_DEFS[i].id).join(' → ')}]：珊妮無法抵達 ${r.id}`);
          break;
        }
      } else if (r.requirement === 'both') {
        const yOk = bfsCanReach(YOHANI_START.x, YOHANI_START.y, r.x, r.y, allRepaired);
        const sOk = bfsCanReach(SHANI_START.x,  SHANI_START.y,  r.x, r.y, allRepaired);
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
];

render(suites);
