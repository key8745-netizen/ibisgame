// DOM presentation layer.
// Game state (game.mode, game.dialogue.isOpen, etc.) is the SINGLE SOURCE OF TRUTH.
// This module ONLY presents; it never drives gameplay decisions or input locks.

// Memoised element refs
const _el = {};
function el(id) { return (_el[id] = _el[id] || document.getElementById(id)); }

// Per-element render cache — avoids DOM mutations when content hasn't changed
const _cache = {};

function showEl(id, key, buildHtml) {
  const e = el(id);
  if (!e) return;
  if (e.hidden) e.hidden = false;
  if (_cache[id] === key) return;
  _cache[id] = key;
  e.innerHTML = buildHtml();
}

function hideEl(id) {
  const e = el(id);
  if (!e || e.hidden) return;
  e.hidden = true;
  _cache[id] = null;
}

// Mobile media query (pointer-coarse / no-hover)
const _mql = window.matchMedia('(hover:none),(pointer:coarse)');

// ── Dialogue ─────────────────────────────────────────────────────────────────
function syncDialogue(dialogue) {
  const mobile = _mql.matches;
  const extEl  = el('ui-dialogue-ext');

  if (!dialogue.isOpen || !dialogue.current) {
    hideEl('ui-dialogue');
    if (extEl) extEl.classList.remove('open');
    _cache.dialogue = null;
    return;
  }

  const { speaker, text, portraitId } = dialogue.current;
  const shown  = text.slice(0, dialogue.chars);
  const done   = dialogue.chars >= text.length;
  const blink  = done && (Math.floor(performance.now() / 500) % 2 === 0);

  const speakerColor = portraitId === 'yohani' ? '#40e0d0'
                     : portraitId === 'sani'   ? '#e040a0'
                     : '#f6d365';

  const key  = `${speaker}|${shown}|${blink}`;
  if (_cache.dialogue === key) return;
  _cache.dialogue = key;

  const html = `<div class="dlg-box">
    <div class="dlg-speaker" style="color:${speakerColor}">${speaker}</div>
    <div class="dlg-body">${shown}</div>
    ${blink ? '<div class="dlg-advance">▼</div>' : ''}
  </div>`;

  if (mobile) {
    if (extEl) { extEl.innerHTML = html; extEl.classList.add('open'); }
    hideEl('ui-dialogue');
  } else {
    const e = el('ui-dialogue');
    if (e) {
      e.hidden = false;
      e.innerHTML = html;
    }
    if (extEl) extEl.classList.remove('open');
  }
}

// ── Main sync (called every render frame) ────────────────────────────────────
export function syncPresentation(game) {
  const { mode, dialogue } = game;

  // ── Title ─────────────────────────────────────────────────────────────────
  if (mode === 'title') {
    const blink = Math.floor(performance.now() / 450) % 2;
    showEl('ui-title', `t${blink}`, () => `
      <div class="title-screen">
        <div class="title-studio">IBI PRODUCTIONS</div>
        <h2 class="title-main">未完成的星路</h2>
        <div class="title-sub">— C01 · 轉運橋救援 —</div>
        <div class="title-desc">
          <p>切換兄妹，讓正式與地下兩條路重新接上</p>
          <p>拯救受困在橋上的三名居民</p>
        </div>
        <div class="title-start${blink ? ' blink' : ''}">按 空白鍵 開始</div>
        <div class="title-controls">方向鍵移動・Z行動・X切換角色・Esc暫停</div>
      </div>`);
    ['ui-char-hud','ui-mission-hud','ui-top-hint','ui-prompt',
     'ui-dialogue','ui-pause','ui-win'].forEach(hideEl);
    const ext = el('ui-dialogue-ext');
    if (ext) ext.classList.remove('open');
    return;
  }
  hideEl('ui-title');

  // ── Char HUD & Mission HUD (play / pause / win) ───────────────────────────
  if (mode === 'play' || mode === 'pause' || mode === 'win') {
    const active     = game.active;
    const charColor  = active.id === 'yohani' ? '#40e0d0' : '#e040a0';
    const charName   = active.id === 'yohani' ? '長子 尤哈尼' : '長女 珊妮';
    const charRole   = active.id === 'yohani' ? '正式救援・橋梁支撐' : '地下道路・例外縫隙';

    showEl('ui-char-hud', active.id, () => `
      <div class="char-hud-box" style="--char-color:${charColor}">
        <div class="char-portrait" data-id="${active.id}"></div>
        <div class="char-info">
          <div class="char-name">${charName}</div>
          <div class="char-role">${charRole}</div>
        </div>
      </div>`);

    const { nodes, rescuees, objective } = game;
    const doneN = nodes.filter(n => n.done).length;
    const doneR = rescuees.filter(r => r.rescued).length;
    const prog  = objective < 2 ? doneN / nodes.length : doneR / rescuees.length;
    const fill  = Math.round(prog * 100);
    const bar   = prog >= 1 ? '#60e090' : '#f6d365';

    showEl('ui-mission-hud', `m${doneN}${doneR}${objective}`, () => {
      const nHtml = nodes.map(n => {
        const c = n.required === 'yohani' ? '#40e0d0' : '#e040a0';
        return `<span class="mission-node${n.done ? ' done' : ''}" style="--node-color:${c}"></span>`;
      }).join('');
      const rHtml = rescuees.map(r => {
        const c = r.requirement === 'yohani' ? '#40e0d0'
                : r.requirement === 'sani'  ? '#e040a0' : '#f6d365';
        return `<span class="mission-person${r.rescued ? ' rescued' : ''}" style="--person-color:${c}"></span>`;
      }).join('');
      return `<div class="mission-box">
        <div class="mission-label">任務</div>
        <div class="mission-icons">${nHtml}<span class="mission-sep"></span>${rHtml}</div>
        <div class="mission-bar-track">
          <div class="mission-bar-fill" style="width:${fill}%;background:${bar}"></div>
        </div>
      </div>`;
    });
  } else {
    hideEl('ui-char-hud');
    hideEl('ui-mission-hud');
  }

  // ── Pause ─────────────────────────────────────────────────────────────────
  if (mode === 'pause') {
    showEl('ui-pause', 'pause', () => `
      <div class="pause-screen">
        <h2 class="pause-title">暫停</h2>
        <p>Esc &nbsp;繼續</p>
        <p>X &nbsp;&nbsp;重新開始</p>
      </div>`);
    hideEl('ui-win');
    hideEl('ui-top-hint');
    hideEl('ui-prompt');
    syncDialogue(dialogue);
    return;
  }
  hideEl('ui-pause');

  // ── Win ───────────────────────────────────────────────────────────────────
  if (mode === 'win') {
    const blink = Math.floor(performance.now() / 900) % 2;
    showEl('ui-win', `w${blink}`, () => `
      <div class="win-screen">
        <h2 class="win-title">救援完成</h2>
        <div class="win-body">
          <p>正式道路與地下道路第一次重新接上。</p>
          <p>兄妹沒有和解，但決定交換證據，</p>
          <p>共同調查讓橋崩解的真正原因。</p>
        </div>
        <div class="win-stage">C01 第一個可玩段落完成</div>
        <div class="win-prompt${blink ? ' blink' : ''}">按 空白鍵 重新遊玩</div>
      </div>`);
    hideEl('ui-top-hint');
    hideEl('ui-prompt');
    hideEl('ui-dialogue');
    const ext = el('ui-dialogue-ext');
    if (ext) ext.classList.remove('open');
    return;
  }
  hideEl('ui-win');

  // ── Play ──────────────────────────────────────────────────────────────────
  if (mode !== 'play') return;

  syncDialogue(dialogue);

  if (dialogue.isOpen) {
    hideEl('ui-top-hint');
    hideEl('ui-prompt');
    return;
  }

  // Wrong-char hint or co-op waiting hint
  if (game.wrongCharHint) {
    const h    = game.wrongCharHint;
    showEl('ui-top-hint', `hint-${h.text}`, () =>
      `<div class="hint-box" style="--hint-color:${h.color}">${h.text}</div>`);
  } else {
    const coop = game.getBothRescueHintState();
    if (coop) {
      showEl('ui-top-hint', `coop-${coop.text}`, () =>
        `<div class="hint-box" style="--hint-color:${coop.color}">${coop.text}</div>`);
    } else {
      hideEl('ui-top-hint');
    }
  }

  // Interaction prompt
  const prompt = game.nearbyPrompt();
  if (prompt) {
    showEl('ui-prompt', `pr-${prompt}`, () =>
      `<div class="prompt-box"><kbd>Z</kbd>${prompt}</div>`);
  } else {
    hideEl('ui-prompt');
  }
}
