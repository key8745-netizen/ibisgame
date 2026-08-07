const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d', { alpha: false });
const loading = document.querySelector('#loading');
const soundButton = document.querySelector('#soundButton');
const fullscreenButton = document.querySelector('#fullscreenButton');
const gameFrame = document.querySelector('#gameFrame');

ctx.imageSmoothingEnabled = false;

const VIEW_W = canvas.width;
const VIEW_H = canvas.height;
const TILE = 16;
const WORLD_W = 64 * TILE;
const WORLD_H = 34 * TILE;
const SAVE_KEY = 'ibisgame-bridge-rescue-v1';

const COLORS = {
  skyTop: '#1c294b', skyBottom: '#7c6793', cloud: '#d6d0cf', distant: '#342f50',
  waterDark: '#162942', water: '#285276', waterLight: '#3d7892',
  bridgeDark: '#24243a', bridge: '#4a4d65', bridgeLight: '#74758a',
  danger: '#d45b6c', cyan: '#59cfda', pink: '#ef8fb1', gold: '#f3d36b',
  text: '#f8f5e8', ink: '#101426',
};

const input = { held: new Set(), pressed: new Set() };
const keyAlias = new Map([
  ['KeyW', 'ArrowUp'], ['KeyA', 'ArrowLeft'], ['KeyS', 'ArrowDown'], ['KeyD', 'ArrowRight'],
  ['KeyZ', 'Space'], ['ShiftLeft', 'KeyX'], ['ShiftRight', 'KeyX'], ['Enter', 'Space'],
]);
const normalizeKey = (code) => keyAlias.get(code) ?? code;
function setKey(code, down) {
  const key = normalizeKey(code);
  if (down && !input.held.has(key)) input.pressed.add(key);
  if (down) input.held.add(key); else input.held.delete(key);
}
window.addEventListener('keydown', (event) => {
  const key = normalizeKey(event.code);
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyX','Escape'].includes(key)) event.preventDefault();
  setKey(event.code, true);
});
window.addEventListener('keyup', (event) => setKey(event.code, false));
window.addEventListener('blur', () => { input.held.clear(); input.pressed.clear(); });
document.querySelectorAll('[data-key]').forEach((button) => {
  const code = button.dataset.key;
  const press = (event) => { event.preventDefault(); button.setPointerCapture?.(event.pointerId); setKey(code, true); };
  const release = (event) => { event.preventDefault(); setKey(code, false); };
  button.addEventListener('pointerdown', press);
  button.addEventListener('pointerup', release);
  button.addEventListener('pointercancel', release);
  button.addEventListener('pointerleave', (event) => { if (event.buttons === 0) release(event); });
});

class AudioBus {
  constructor() { this.enabled = true; this.context = null; this.master = null; }
  ensure() {
    if (!this.enabled) return false;
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return false;
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = 0.16;
      this.master.connect(this.context.destination);
    }
    if (this.context.state === 'suspended') this.context.resume();
    return true;
  }
  beep(freq = 440, duration = 0.08, type = 'square', volume = 0.5, slide = 0) {
    if (!this.ensure()) return;
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, now);
    oscillator.frequency.linearRampToValueAtTime(Math.max(40, freq + slide), now + duration);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(gain); gain.connect(this.master); oscillator.start(now); oscillator.stop(now + duration);
  }
  success() {
    this.beep(523, 0.08, 'square', 0.5);
    window.setTimeout(() => this.beep(659, 0.08, 'square', 0.45), 70);
    window.setTimeout(() => this.beep(784, 0.14, 'square', 0.4), 140);
  }
  toggle() {
    this.enabled = !this.enabled;
    soundButton.textContent = `聲音：${this.enabled ? '開' : '關'}`;
    soundButton.setAttribute('aria-pressed', String(this.enabled));
    if (this.enabled) this.beep(660, 0.08, 'square', 0.35);
  }
}
const audio = new AudioBus();
soundButton.addEventListener('click', () => audio.toggle());
fullscreenButton.addEventListener('click', async () => {
  try { if (!document.fullscreenElement) await gameFrame.requestFullscreen(); else await document.exitFullscreen(); } catch { /* optional */ }
});

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (a, b, t) => a + (b - a) * t;
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
function hash2(x, y) {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}

class Particle {
  constructor(x, y, color, options = {}) {
    this.x = x; this.y = y;
    this.vx = options.vx ?? (Math.random() - 0.5) * 35;
    this.vy = options.vy ?? (Math.random() - 0.5) * 35;
    this.life = options.life ?? 0.65; this.maxLife = this.life;
    this.size = options.size ?? 2; this.color = color; this.gravity = options.gravity ?? 0;
  }
  update(dt) { this.life -= dt; this.vy += this.gravity * dt; this.x += this.vx * dt; this.y += this.vy * dt; }
  draw(camera) {
    if (this.life <= 0) return;
    ctx.globalAlpha = clamp(this.life / this.maxLife, 0, 1);
    ctx.fillStyle = this.color;
    ctx.fillRect(Math.round(this.x - camera.x), Math.round(this.y - camera.y), this.size, this.size);
    ctx.globalAlpha = 1;
  }
}

function drawPanel(x, y, w, h, fill = COLORS.ink, border = '#7781a5') {
  ctx.fillStyle = '#05070d'; ctx.fillRect(x + 2, y + 3, w, h);
  ctx.fillStyle = border; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = fill; ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fillRect(x + 3, y + 3, w - 6, 1);
}
function drawWrappedText(text, x, y, maxWidth, lineHeight, color = COLORS.text) {
  ctx.font = '8px monospace'; ctx.fillStyle = color;
  let line = ''; let yy = y;
  for (const char of text) {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) { ctx.fillText(line, x, yy); line = char; yy += lineHeight; }
    else line = test;
  }
  if (line) ctx.fillText(line, x, yy);
}
function drawPortrait(x, y, type) {
  ctx.fillStyle = '#202847'; ctx.fillRect(x, y, 32, 32);
  if (type === 'yohani') {
    ctx.fillStyle = '#3d2d36'; ctx.fillRect(x + 9, y + 5, 15, 9);
    ctx.fillStyle = '#d7a47d'; ctx.fillRect(x + 10, y + 10, 14, 13);
    ctx.fillStyle = '#5986a6'; ctx.fillRect(x + 7, y + 22, 20, 8);
    ctx.fillStyle = '#111629'; ctx.fillRect(x + 13, y + 15, 2, 2); ctx.fillRect(x + 20, y + 15, 2, 2);
  } else if (type === 'shani') {
    ctx.fillStyle = '#2c1f34'; ctx.fillRect(x + 7, y + 4, 19, 12);
    ctx.fillStyle = '#c99072'; ctx.fillRect(x + 10, y + 11, 14, 12);
    ctx.fillStyle = '#9a4d77'; ctx.fillRect(x + 7, y + 22, 20, 8);
    ctx.fillStyle = '#111629'; ctx.fillRect(x + 13, y + 15, 2, 2); ctx.fillRect(x + 20, y + 15, 2, 2);
  } else {
    ctx.fillStyle = COLORS.gold; ctx.fillRect(x + 14, y + 6, 4, 20); ctx.fillRect(x + 6, y + 14, 20, 4);
  }
}

class DialogueBox {
  constructor() { this.queue = []; this.current = null; this.visibleChars = 0; this.timer = 0; }
  say(speaker, text, portrait = 'system') { this.queue.push({ speaker, text, portrait }); if (!this.current) this.next(); }
  next() { this.current = this.queue.shift() ?? null; this.visibleChars = 0; this.timer = 0; }
  update(dt) {
    if (!this.current) return;
    this.timer += dt; this.visibleChars = Math.min(this.current.text.length, Math.floor(this.timer * 35));
    if (input.pressed.has('Space')) {
      if (this.visibleChars < this.current.text.length) { this.visibleChars = this.current.text.length; this.timer = this.current.text.length / 35; audio.beep(700, 0.035, 'square', 0.22); }
      else { this.next(); audio.beep(520, 0.035, 'square', 0.2); }
    }
  }
  draw() {
    if (!this.current) return;
    const x = 18, y = VIEW_H - 69, w = VIEW_W - 36, h = 55;
    drawPanel(x, y, w, h, '#111629', '#7781a5'); drawPortrait(x + 9, y + 9, this.current.portrait);
    ctx.fillStyle = COLORS.gold; ctx.font = 'bold 8px monospace'; ctx.fillText(this.current.speaker, x + 48, y + 14);
    drawWrappedText(this.current.text.slice(0, this.visibleChars), x + 48, y + 26, w - 58, 10, COLORS.text);
    if (this.visibleChars >= this.current.text.length) { ctx.fillStyle = COLORS.gold; ctx.fillRect(x + w - 13, y + h - 10 + Math.floor(performance.now() / 280) % 2, 4, 3); }
  }
}

class Player {
  constructor(id, x, y, palette) {
    this.id = id; this.x = x; this.y = y; this.w = 11; this.h = 13; this.speed = 70;
    this.palette = palette; this.direction = 'down'; this.walk = 0; this.active = false; this.glow = 0;
  }
  get center() { return { x: this.x + this.w / 2, y: this.y + this.h / 2 }; }
  update(dt, game) {
    this.glow = Math.max(0, this.glow - dt * 2);
    if (!this.active || game.dialogue.current || game.mode !== 'play') return;
    let dx = 0, dy = 0;
    if (input.held.has('ArrowLeft')) dx -= 1; if (input.held.has('ArrowRight')) dx += 1;
    if (input.held.has('ArrowUp')) dy -= 1; if (input.held.has('ArrowDown')) dy += 1;
    if (dx && dy) { dx *= Math.SQRT1_2; dy *= Math.SQRT1_2; }
    if (Math.abs(dx) > Math.abs(dy)) this.direction = dx < 0 ? 'left' : 'right'; else if (dy) this.direction = dy < 0 ? 'up' : 'down';
    const oldX = this.x, oldY = this.y;
    game.moveWithCollision(this, dx * this.speed * dt, 0); game.moveWithCollision(this, 0, dy * this.speed * dt);
    this.walk = oldX !== this.x || oldY !== this.y ? this.walk + dt * 9 : 0;
    if (input.pressed.has('Space')) game.interact();
  }
  draw(camera) {
    const x = Math.round(this.x - camera.x), y = Math.round(this.y - camera.y), bob = this.walk ? Math.floor(this.walk) % 2 : 0;
    if (this.active) { ctx.globalAlpha = 0.45 + this.glow * 0.4; ctx.fillStyle = this.palette.glow; ctx.fillRect(x - 3, y + 9, 17, 5); ctx.globalAlpha = 1; }
    ctx.fillStyle = 'rgba(3,5,10,.45)'; ctx.fillRect(x + 1, y + 11, 10, 3);
    ctx.fillStyle = this.palette.legs; ctx.fillRect(x + 2, y + 9 + bob, 3, 4 - bob); ctx.fillRect(x + 7, y + 9 + (1 - bob), 3, 3 + bob);
    ctx.fillStyle = this.palette.body; ctx.fillRect(x + 1, y + 5, 10, 6); ctx.fillStyle = this.palette.trim; ctx.fillRect(x + 2, y + 6, 8, 2);
    ctx.fillStyle = this.palette.skin; ctx.fillRect(x + 3, y + 1, 7, 5); ctx.fillStyle = this.palette.hair; ctx.fillRect(x + 2, y, 8, 3); ctx.fillRect(x + 2, y + 2, 2, 3);
    ctx.fillStyle = '#111629';
    if (this.direction === 'left') ctx.fillRect(x + 3, y + 3, 1, 1); else if (this.direction === 'right') ctx.fillRect(x + 8, y + 3, 1, 1); else { ctx.fillRect(x + 4, y + 3, 1, 1); ctx.fillRect(x + 8, y + 3, 1, 1); }
  }
}

class Interactable {
  constructor({ id, x, y, type, required, label, color = COLORS.gold }) {
    Object.assign(this, { id, x, y, type, required, label, color }); this.w = 16; this.h = 16; this.done = false; this.pulse = Math.random() * 6;
  }
  update(dt) { this.pulse += dt * 3; }
  draw(camera) {
    const x = Math.round(this.x - camera.x), y = Math.round(this.y - camera.y), pulse = Math.floor((Math.sin(this.pulse) + 1) * 1.2);
    if (this.type === 'console') {
      ctx.fillStyle = '#1b2036'; ctx.fillRect(x + 2, y + 5, 12, 10); ctx.fillStyle = '#5a6075'; ctx.fillRect(x + 3, y + 3, 10, 5);
      ctx.fillStyle = this.done ? '#66d794' : COLORS.cyan; ctx.fillRect(x + 5, y + 5, 6, 2); ctx.fillStyle = '#929aae'; ctx.fillRect(x + 4, y + 12, 2, 3); ctx.fillRect(x + 10, y + 12, 2, 3);
    } else {
      ctx.strokeStyle = this.done ? '#66d794' : COLORS.pink; ctx.lineWidth = 2; ctx.strokeRect(x + 3, y + 3, 10, 10);
      ctx.fillStyle = this.done ? '#66d794' : COLORS.pink; ctx.fillRect(x + 7, y + 1 + pulse, 2, 14 - pulse * 2); ctx.fillRect(x + 1 + pulse, y + 7, 14 - pulse * 2, 2);
    }
    if (!this.done) { ctx.fillStyle = this.color; ctx.fillRect(x + 6, y - 5 - pulse, 4, 3); }
  }
}

class Rescuee {
  constructor(id, x, y, name, requirement) { Object.assign(this, { id, x, y, name, requirement }); this.w = 10; this.h = 12; this.rescued = false; this.bob = Math.random() * 6; }
  update(dt) { this.bob += dt * 4; }
  draw(camera) {
    if (this.rescued) return;
    const x = Math.round(this.x - camera.x), y = Math.round(this.y - camera.y + Math.sin(this.bob));
    ctx.fillStyle = 'rgba(3,5,10,.45)'; ctx.fillRect(x, y + 10, 10, 3); ctx.fillStyle = '#6f4a3a'; ctx.fillRect(x + 2, y, 6, 4);
    ctx.fillStyle = '#d5a07b'; ctx.fillRect(x + 2, y + 3, 6, 4); ctx.fillStyle = this.requirement === 'yohani' ? '#5f8eb2' : this.requirement === 'shani' ? '#a6537f' : '#d0aa55'; ctx.fillRect(x + 1, y + 7, 8, 5);
    ctx.fillStyle = COLORS.gold; ctx.fillRect(x + 3, y - 5, 4, 3);
  }
}

class Game {
  constructor() {
    this.mode = 'title'; this.time = 0; this.camera = { x: 0, y: 0, shake: 0 }; this.dialogue = new DialogueBox(); this.particles = [];
    this.players = [
      new Player('yohani', 13*TILE, 14*TILE, { hair:'#342832',skin:'#d6a07b',body:'#4e7897',trim:'#85bfd0',legs:'#252c43',glow:COLORS.cyan }),
      new Player('shani', 10*TILE, 19*TILE, { hair:'#2e2035',skin:'#c68d70',body:'#8d476e',trim:'#e38aaa',legs:'#2d2941',glow:COLORS.pink }),
    ];
    this.activeIndex = 0; this.players[0].active = true;
    this.interactables = [
      new Interactable({ id:'support-west',x:19*TILE,y:13*TILE,type:'console',required:'yohani',label:'啟動西側橋梁支撐',color:COLORS.cyan }),
      new Interactable({ id:'support-east',x:43*TILE,y:13*TILE,type:'console',required:'yohani',label:'啟動東側橋梁支撐',color:COLORS.cyan }),
      new Interactable({ id:'seal-lower',x:27*TILE,y:22*TILE,type:'seal',required:'shani',label:'打開地下例外道路',color:COLORS.pink }),
      new Interactable({ id:'seal-upper',x:37*TILE,y:8*TILE,type:'seal',required:'shani',label:'解除上層封鎖標記',color:COLORS.pink }),
    ];
    this.rescuees = [
      new Rescuee('resident-formal',47*TILE,11*TILE,'橋面居民','yohani'),
      new Rescuee('resident-underground',31*TILE,25*TILE,'地下同行者','shani'),
      new Rescuee('resident-child',53*TILE,19*TILE,'迷路的孩子','both'),
    ];
    this.objective = 0; this.winTimer = 0; this.lastSave = 0; this.load();
  }
  get activePlayer() { return this.players[this.activeIndex]; }
  reset() { localStorage.removeItem(SAVE_KEY); window.location.reload(); }
  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null'); if (!saved) return;
      for (const item of this.interactables) item.done = Boolean(saved.interactables?.[item.id]);
      for (const rescuee of this.rescuees) rescuee.rescued = Boolean(saved.rescuees?.[rescuee.id]);
      if (saved.players?.length === 2) saved.players.forEach((source,index) => { this.players[index].x = clamp(source.x,0,WORLD_W-this.players[index].w); this.players[index].y = clamp(source.y,0,WORLD_H-this.players[index].h); });
      this.objective = saved.objective ?? 0;
    } catch { localStorage.removeItem(SAVE_KEY); }
  }
  save(force = false) {
    if (!force && this.time - this.lastSave < 1.2) return; this.lastSave = this.time;
    localStorage.setItem(SAVE_KEY, JSON.stringify({ objective:this.objective, interactables:Object.fromEntries(this.interactables.map(i=>[i.id,i.done])), rescuees:Object.fromEntries(this.rescuees.map(i=>[i.id,i.rescued])), players:this.players.map(({x,y})=>({x,y})) }));
  }
  start() {
    this.mode = 'play';
    this.dialogue.say('系統','轉運橋同時在正式區與地下區崩解。切換尤哈尼與珊妮，讓兩條路重新接上。','system');
    this.dialogue.say('尤哈尼','我先穩住橋面。珊妮，妳找得到下面的路嗎？','yohani');
    this.dialogue.say('珊妮','找得到。但別替我決定怎麼走。需要改路時，我會告訴你。','shani');
    audio.ensure();
  }
  update(dt) {
    this.time += dt; this.camera.shake = Math.max(0,this.camera.shake-dt*7);
    if (this.mode === 'title') { if (input.pressed.has('Space')) this.start(); return; }
    if (input.pressed.has('Escape')) { if (this.mode === 'play') this.mode='pause'; else if (this.mode === 'pause') this.mode='play'; audio.beep(330,.06,'square',.25); }
    if (this.mode === 'pause') { if (input.pressed.has('KeyX')) this.reset(); return; }
    if (this.mode === 'win') { this.winTimer += dt; if (input.pressed.has('Space') && this.winTimer > 1) this.reset(); return; }
    this.dialogue.update(dt);
    if (!this.dialogue.current && input.pressed.has('KeyX')) this.switchPlayer();
    for (const player of this.players) player.update(dt,this);
    for (const item of this.interactables) item.update(dt);
    for (const rescuee of this.rescuees) rescuee.update(dt);
    for (const particle of this.particles) particle.update(dt);
    this.particles = this.particles.filter(p=>p.life>0);
    this.updateObjective(); this.updateCamera(dt); this.save();
  }
  updateObjective() {
    const supports=this.interactables.filter(i=>i.type==='console'&&i.done).length;
    const seals=this.interactables.filter(i=>i.type==='seal'&&i.done).length;
    const rescued=this.rescuees.filter(i=>i.rescued).length;
    const next=rescued>=3?3:supports>=2&&seals>=2?2:supports+seals>0?1:0;
    if(next!==this.objective){this.objective=next;this.save(true);if(next===2){this.dialogue.say('系統','兩條路已經接上。現在去找三名受困者。不同的人需要不同的救援方式。','system');audio.success();}if(next===3)this.complete();}
  }
  complete() {
    this.mode='win'; this.winTimer=0; this.camera.shake=1;
    for(let i=0;i<80;i+=1)this.particles.push(new Particle(this.activePlayer.x+(Math.random()-.5)*80,this.activePlayer.y+(Math.random()-.5)*40,i%2?COLORS.gold:COLORS.cyan,{vx:(Math.random()-.5)*100,vy:-20-Math.random()*80,gravity:100,life:1.5,size:2}));
    audio.success(); localStorage.removeItem(SAVE_KEY);
  }
  switchPlayer() { this.players[this.activeIndex].active=false; this.activeIndex=1-this.activeIndex; this.players[this.activeIndex].active=true; this.players[this.activeIndex].glow=1; audio.beep(this.activeIndex===0?470:620,.09,'square',.35,80); this.camera.shake=.25; }
  moveWithCollision(entity,dx,dy) {
    const next={x:entity.x+dx,y:entity.y+dy,w:entity.w,h:entity.h};
    const samples=[[next.x+1,next.y+6],[next.x+next.w-1,next.y+6],[next.x+1,next.y+next.h-1],[next.x+next.w-1,next.y+next.h-1]];
    if(samples.some(([x,y])=>this.isBlocked(x,y)))return; entity.x=clamp(next.x,0,WORLD_W-entity.w); entity.y=clamp(next.y,0,WORLD_H-entity.h);
  }
  isBlocked(x,y) {
    const tx=Math.floor(x/TILE),ty=Math.floor(y/TILE); if(tx<2||ty<3||tx>=62||ty>=31)return true;
    const onBridge=ty>=9&&ty<=23&&tx>=5&&tx<=58,upperDeck=ty>=7&&ty<=15&&tx>=8&&tx<=54,lowerTunnel=ty>=18&&ty<=26&&tx>=7&&tx<=56;
    if(!onBridge&&!upperDeck&&!lowerTunnel)return true;
    const west=this.interactables.find(i=>i.id==='support-west')?.done,east=this.interactables.find(i=>i.id==='support-east')?.done,lower=this.interactables.find(i=>i.id==='seal-lower')?.done,upper=this.interactables.find(i=>i.id==='seal-upper')?.done;
    if(ty>=10&&ty<=15&&tx>=24&&tx<=27&&!west)return true;
    if(ty>=10&&ty<=15&&tx>=39&&tx<=42&&!east)return true;
    if(ty>=19&&ty<=25&&tx>=28&&tx<=31&&!lower)return true;
    if(ty>=7&&ty<=10&&tx>=36&&tx<=39&&!upper)return true;
    if((ty===9||ty===23)&&tx%5!==0)return true;
    if((tx===21&&ty>=11&&ty<=13)||(tx===45&&ty>=11&&ty<=13))return true;
    return false;
  }
  interact() {
    const player=this.activePlayer;
    const nearby=this.interactables.filter(i=>!i.done).sort((a,b)=>dist(player.center,a)-dist(player.center,b))[0];
    if(nearby&&dist(player.center,nearby)<27){
      if(nearby.required!==player.id){const correct=nearby.required==='yohani'?'尤哈尼':'珊妮';this.dialogue.say('系統',`這個裝置需要${correct}的能力。按 X 切換角色。`,'system');audio.beep(180,.12,'square',.3,-30);return;}
      nearby.done=true;this.camera.shake=.5;
      for(let i=0;i<24;i+=1)this.particles.push(new Particle(nearby.x+8,nearby.y+8,nearby.color,{vx:(Math.random()-.5)*70,vy:(Math.random()-.5)*70,life:.8}));
      audio.success();this.dialogue.say(player.id==='yohani'?'尤哈尼':'珊妮',nearby.label+'完成。',player.id);this.save(true);return;
    }
    const rescuee=this.rescuees.filter(i=>!i.rescued).sort((a,b)=>dist(player.center,a)-dist(player.center,b))[0];
    if(rescuee&&dist(player.center,rescuee)<25){
      if(!this.interactables.every(i=>i.done)){this.dialogue.say(rescuee.name,'橋面和地下道路還沒接好。先把兩邊的支撐與封鎖處理完。','system');return;}
      if(rescuee.requirement!=='both'&&rescuee.requirement!==player.id){const correct=rescuee.requirement==='yohani'?'尤哈尼':'珊妮';this.dialogue.say(rescuee.name,`我需要${correct}帶我走這一段。`,'system');return;}
      if(rescuee.requirement==='both'&&dist(this.players[0].center,this.players[1].center)>70){this.dialogue.say('迷路的孩子','我怕走散……可以讓你們兩個都在附近嗎？','system');return;}
      rescuee.rescued=true;audio.success();for(let i=0;i<32;i+=1)this.particles.push(new Particle(rescuee.x+5,rescuee.y+6,COLORS.gold,{vx:(Math.random()-.5)*80,vy:-10-Math.random()*60,gravity:80,life:1}));
      this.dialogue.say(rescuee.name,'謝謝！我會沿著你們留下的返回標記撤離。','system');this.save(true);return;
    }
    audio.beep(240,.04,'square',.15);
  }
  updateCamera(dt) {
    const tx=clamp(this.activePlayer.x+this.activePlayer.w/2-VIEW_W/2,0,WORLD_W-VIEW_W),ty=clamp(this.activePlayer.y+this.activePlayer.h/2-VIEW_H/2,0,WORLD_H-VIEW_H),r=1-Math.pow(.001,dt);
    this.camera.x=lerp(this.camera.x,tx,r);this.camera.y=lerp(this.camera.y,ty,r);
  }
  draw() {
    ctx.save();const amount=this.camera.shake*3;ctx.translate(Math.round((Math.random()-.5)*amount),Math.round((Math.random()-.5)*amount));
    this.drawBackground();this.drawWorld();for(const item of this.interactables)item.draw(this.camera);for(const rescuee of this.rescuees)rescuee.draw(this.camera);for(const player of this.players)player.draw(this.camera);for(const particle of this.particles)particle.draw(this.camera);this.drawForeground();ctx.restore();
    this.drawHud();this.dialogue.draw();if(this.mode==='title')this.drawTitle();if(this.mode==='pause')this.drawPause();if(this.mode==='win')this.drawWin();input.pressed.clear();
  }
  drawBackground() {
    const gradient=ctx.createLinearGradient(0,0,0,VIEW_H);gradient.addColorStop(0,COLORS.skyTop);gradient.addColorStop(1,COLORS.skyBottom);ctx.fillStyle=gradient;ctx.fillRect(0,0,VIEW_W,VIEW_H);
    const parallax=this.camera.x*.08;ctx.fillStyle=COLORS.distant;
    for(let i=-2;i<12;i+=1){const x=Math.round(i*65-(parallax%65)),height=28+Math.floor(hash2(i,2)*38);ctx.fillRect(x,84-height,48,height);ctx.fillStyle='#50455e';ctx.fillRect(x+6,84-height+8,4,3);ctx.fillRect(x+25,84-height+15,4,3);ctx.fillStyle=COLORS.distant;}
    ctx.globalAlpha=.42;ctx.fillStyle=COLORS.cloud;
    for(let i=0;i<8;i+=1){const speed=3+i*.25,x=((i*83+this.time*speed-this.camera.x*.03)%(VIEW_W+90))-45,y=25+(i%3)*17;ctx.fillRect(Math.round(x),y,32,4);ctx.fillRect(Math.round(x+8),y-3,18,3);}ctx.globalAlpha=1;
  }
  drawWorld() {
    const sx=Math.floor(this.camera.x/TILE)-1,ex=Math.ceil((this.camera.x+VIEW_W)/TILE)+1,sy=Math.floor(this.camera.y/TILE)-1,ey=Math.ceil((this.camera.y+VIEW_H)/TILE)+1;
    for(let ty=sy;ty<=ey;ty+=1)for(let tx=sx;tx<=ex;tx+=1)this.drawTile(tx,ty,Math.round(tx*TILE-this.camera.x),Math.round(ty*TILE-this.camera.y));
  }
  drawTile(tx,ty,x,y) {
    const onBridge=ty>=9&&ty<=23&&tx>=5&&tx<=58,upperDeck=ty>=7&&ty<=15&&tx>=8&&tx<=54,lowerTunnel=ty>=18&&ty<=26&&tx>=7&&tx<=56;
    if(!onBridge&&!upperDeck&&!lowerTunnel){const wave=Math.floor((this.time*8+tx*3+ty*2)%16);ctx.fillStyle=COLORS.waterDark;ctx.fillRect(x,y,TILE,TILE);ctx.fillStyle=wave<3?COLORS.waterLight:COLORS.water;ctx.fillRect(x+wave,y+4+((tx+ty)%5),Math.max(2,12-wave),1);return;}
    if(this.isBlocked(tx*TILE+8,ty*TILE+8)){ctx.fillStyle='#161827';ctx.fillRect(x,y,TILE,TILE);if((tx+ty)%2===0){ctx.fillStyle='#24283a';ctx.fillRect(x+2,y+2,3,3);}return;}
    ctx.fillStyle=lowerTunnel&&ty>=18?'#31364d':COLORS.bridge;ctx.fillRect(x,y,TILE,TILE);ctx.fillStyle=COLORS.bridgeLight;ctx.fillRect(x,y,TILE,2);ctx.fillStyle=COLORS.bridgeDark;ctx.fillRect(x,y+14,TILE,2);
    if((tx+ty)%4===0){ctx.fillStyle='#5d6077';ctx.fillRect(x+4,y+6,7,1);}
    const nearGap=(tx>=23&&tx<=28)||(tx>=38&&tx<=43)||(tx>=27&&tx<=32);if(nearGap&&hash2(tx,ty)>.55){ctx.fillStyle=COLORS.danger;ctx.fillRect(x+7,y+4,1,4);ctx.fillRect(x+8,y+7,3,1);}
  }
  drawForeground() {
    const x=-Math.round(this.camera.x*.25)%96;ctx.globalAlpha=.25;ctx.fillStyle='#cbb9cd';for(let i=-1;i<7;i+=1){ctx.fillRect(x+i*96,VIEW_H-24,60,2);ctx.fillRect(x+12+i*96,VIEW_H-28,28,2);}ctx.globalAlpha=1;
  }
  drawHud() {
    if(this.mode==='title')return;const active=this.activePlayer;drawPanel(8,8,126,37,'#111629',active.palette.glow);drawPortrait(12,11,active.id);ctx.fillStyle=active.palette.glow;ctx.font='bold 8px monospace';ctx.fillText(active.id==='yohani'?'長子尤哈尼':'長女珊妮',49,19);ctx.fillStyle=COLORS.text;ctx.font='7px monospace';ctx.fillText(active.id==='yohani'?'正式救援／橋梁支撐':'地下道路／例外縫隙',49,31);
    const completed=this.interactables.filter(i=>i.done).length,rescued=this.rescuees.filter(i=>i.rescued).length;drawPanel(VIEW_W-139,8,131,37,'#111629','#6d7697');ctx.fillStyle=COLORS.gold;ctx.font='bold 7px monospace';ctx.fillText('目前任務',VIEW_W-130,19);ctx.fillStyle=COLORS.text;ctx.font='7px monospace';ctx.fillText(completed<4?`接通兩條路 ${completed}/4`:`救出受困者 ${rescued}/3`,VIEW_W-130,32);
    if(!this.dialogue.current&&this.mode==='play'){const target=this.findNearbyTarget();if(target){const label=target instanceof Rescuee?`協助 ${target.name}`:target.label,width=Math.min(190,ctx.measureText(label).width+34);drawPanel((VIEW_W-width)/2,VIEW_H-30,width,20,'#111629',COLORS.gold);ctx.fillStyle=COLORS.gold;ctx.font='bold 7px monospace';ctx.fillText('Z',(VIEW_W-width)/2+8,VIEW_H-17);ctx.fillStyle=COLORS.text;ctx.fillText(label,(VIEW_W-width)/2+24,VIEW_H-17);}}
  }
  findNearbyTarget() { const p=this.activePlayer,c=[...this.interactables.filter(i=>!i.done),...this.rescuees.filter(i=>!i.rescued)].sort((a,b)=>dist(p.center,a)-dist(p.center,b));return c.find(i=>dist(p.center,i)<28)??null; }
  drawTitle() {
    ctx.fillStyle='rgba(7,9,18,.68)';ctx.fillRect(0,0,VIEW_W,VIEW_H);for(let i=0;i<55;i+=1){const x=Math.floor(hash2(i,8)*VIEW_W),y=Math.floor(hash2(i,9)*150),blink=(Math.floor(this.time*3+i)%4)===0;ctx.fillStyle=blink?'#fff3b0':'#929cc6';ctx.fillRect(x,y,blink?2:1,blink?2:1);}
    ctx.textAlign='center';ctx.fillStyle=COLORS.gold;ctx.font='bold 10px monospace';ctx.fillText('IBI PRODUCTIONS',VIEW_W/2,55);ctx.fillStyle=COLORS.text;ctx.font='bold 22px monospace';ctx.fillText('未完成的星路',VIEW_W/2,89);ctx.fillStyle=COLORS.cyan;ctx.font='bold 10px monospace';ctx.fillText('轉運橋救援',VIEW_W/2,111);drawPanel(128,139,224,50,'#111629','#7b85a9');ctx.fillStyle=COLORS.text;ctx.font='8px monospace';ctx.fillText('切換兄妹，讓正式與地下兩條道路重新接上',VIEW_W/2,156);ctx.fillStyle=Math.floor(this.time*2)%2?COLORS.gold:'#fff1aa';ctx.font='bold 9px monospace';ctx.fillText('按 空白鍵 開始',VIEW_W/2,177);ctx.fillStyle='#aeb6ce';ctx.font='7px monospace';ctx.fillText('純瀏覽器像素遊戲・不需要安裝',VIEW_W/2,222);ctx.textAlign='left';
  }
  drawPause() {ctx.fillStyle='rgba(5,7,13,.72)';ctx.fillRect(0,0,VIEW_W,VIEW_H);drawPanel(145,85,190,95,'#111629','#7b85a9');ctx.textAlign='center';ctx.fillStyle=COLORS.gold;ctx.font='bold 14px monospace';ctx.fillText('暫停',VIEW_W/2,110);ctx.fillStyle=COLORS.text;ctx.font='8px monospace';ctx.fillText('Esc：繼續遊戲',VIEW_W/2,136);ctx.fillText('X：重新開始',VIEW_W/2,153);ctx.textAlign='left';}
  drawWin() {ctx.fillStyle='rgba(8,11,21,.72)';ctx.fillRect(0,0,VIEW_W,VIEW_H);drawPanel(78,56,324,151,'#111629',COLORS.gold);ctx.textAlign='center';ctx.fillStyle=COLORS.gold;ctx.font='bold 15px monospace';ctx.fillText('救援完成',VIEW_W/2,85);ctx.fillStyle=COLORS.text;ctx.font='9px monospace';ctx.fillText('正式道路與地下道路第一次重新接上。',VIEW_W/2,111);ctx.fillText('兄妹沒有和解，但決定交換證據、共同調查。',VIEW_W/2,128);ctx.fillStyle=COLORS.cyan;ctx.fillText('第一個可玩段落完成',VIEW_W/2,157);ctx.fillStyle=Math.floor(this.time*2)%2?COLORS.gold:COLORS.text;ctx.fillText('按 空白鍵 重新遊玩',VIEW_W/2,183);ctx.textAlign='left';}
}

const game = new Game();
let previous = performance.now(), accumulator = 0;
const STEP = 1 / 60;
function frame(now) {
  const elapsed = Math.min(0.1, (now - previous) / 1000); previous = now; accumulator += elapsed;
  while (accumulator >= STEP) { game.update(STEP); accumulator -= STEP; }
  game.draw(); requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
window.setTimeout(() => loading.classList.add('hidden'), 250);
