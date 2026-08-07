// 即時合成音效與背景音樂。全部排程在 AudioContext 時鐘上，不使用 setTimeout，
// 因此不會因為主執行緒卡頓而讓和弦走音。

const NOTE = (semitonesFromA4) => 440 * (2 ** (semitonesFromA4 / 12));

// 小調的緩慢琶音，配合夜晚的橋。
const BASS = [-29, -29, -27, -24, -29, -29, -22, -24];
const ARP = [
  [-5, 0, 3, 7], [-5, 0, 3, 7], [-3, 0, 4, 7], [-8, -1, 4, 7],
  [-5, 0, 3, 7], [-5, 0, 3, 7], [-10, -3, 2, 5], [-8, -1, 4, 7],
];

export class AudioBus {
  constructor() {
    this.enabled = true;
    this.ctx = null;
    this.master = null;
    this.sfxGain = null;
    this.musicGain = null;
    this.noiseBuffer = null;
    this.beatStep = 0;
    this.nextNoteTime = 0;
    this.timer = 0;
    this.tempo = 0.34; // 每步秒數
    this.musicOn = false;
  }

  ensure() {
    if (!this.enabled) return false;
    if (!this.ctx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return false;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.32;
      this.sfxGain.connect(this.master);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0;
      this.musicGain.connect(this.master);

      const length = Math.floor(this.ctx.sampleRate * 0.4);
      this.noiseBuffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return true;
  }

  tone(freq, duration, { type = 'square', volume = 0.5, slide = 0, delay = 0, target = 'sfx' } = {}) {
    if (!this.ensure()) return;
    const start = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain);
    gain.connect(target === 'music' ? this.musicGain : this.sfxGain);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  noise(duration = 0.16, { volume = 0.3, delay = 0, filter = 1200 } = {}) {
    if (!this.ensure()) return;
    const start = this.ctx.currentTime + delay;
    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    const band = this.ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = filter;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(band);
    band.connect(gain);
    gain.connect(this.sfxGain);
    source.start(start);
    source.stop(start + duration);
  }

  // ---- 具體音效 ----
  blip(freq = 620) { this.tone(freq, 0.05, { volume: 0.28 }); }
  footstep() { this.noise(0.055, { volume: 0.09, filter: 900 + Math.random() * 500 }); }
  deny() { this.tone(200, 0.13, { volume: 0.3, slide: -70 }); }
  switchChar(up) {
    this.tone(up ? 440 : 560, 0.07, { volume: 0.3, type: 'triangle', slide: up ? 180 : -140 });
    this.tone(up ? 660 : 840, 0.09, { volume: 0.2, delay: 0.05 });
  }
  repair() {
    this.noise(0.22, { volume: 0.22, filter: 480 });
    [0, 0.07, 0.14].forEach((delay, index) => {
      this.tone(NOTE(-5 + index * 4), 0.16, { volume: 0.3, type: 'square', delay });
    });
  }
  fanfare() {
    [0, 4, 7, 12, 16].forEach((semi, index) => {
      this.tone(NOTE(semi), 0.28, { volume: 0.3, type: 'square', delay: index * 0.085 });
      this.tone(NOTE(semi - 12), 0.3, { volume: 0.16, type: 'triangle', delay: index * 0.085 });
    });
  }

  // ---- 背景音樂 ----
  startMusic() {
    if (!this.ensure() || this.musicOn) return;
    this.musicOn = true;
    this.beatStep = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.1;
    this.musicGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.musicGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    this.musicGain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 2.5);
    this.timer = window.setInterval(() => this.schedule(), 25);
  }

  stopMusic() {
    this.musicOn = false;
    window.clearInterval(this.timer);
    this.timer = 0;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, this.ctx.currentTime);
      this.musicGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
    }
  }

  schedule() {
    if (!this.ctx || !this.musicOn) return;
    while (this.nextNoteTime < this.ctx.currentTime + 0.2) {
      const delay = Math.max(0, this.nextNoteTime - this.ctx.currentTime);
      const bar = Math.floor(this.beatStep / 8) % BASS.length;
      if (this.beatStep % 2 === 0) {
        this.tone(NOTE(BASS[bar]), 0.36, { type: 'triangle', volume: 0.5, delay, target: 'music' });
      }
      const chord = ARP[bar];
      const note = chord[this.beatStep % chord.length];
      this.tone(NOTE(note), 0.2, { type: 'square', volume: 0.16, delay, target: 'music' });
      if (this.beatStep % 8 === 4) {
        this.tone(NOTE(note + 12), 0.5, { type: 'triangle', volume: 0.1, delay, target: 'music' });
      }
      this.nextNoteTime += this.tempo;
      this.beatStep += 1;
    }
  }

  setEnabled(on) {
    this.enabled = on;
    if (!on) {
      this.stopMusic();
      if (this.ctx) this.ctx.suspend();
    } else if (this.ctx) {
      this.ctx.resume();
    }
  }
}

export const audio = new AudioBus();
