// 粒子系統：修復閃光、角色切換光暈、勝利慶典。最多同時 48 顆。

const MAX_PARTICLES = 48;

export class Particle {
  constructor(x, y, color, vx, vy, life, size = 2, gravity = 0) {
    this.x = x; this.y = y;
    this.color = color;
    this.vx = vx; this.vy = vy;
    this.life = life; this.maxLife = life;
    this.size = size;
    this.gravity = gravity;
  }
  get alive() { return this.life > 0; }
  update(dt) {
    this.life -= dt;
    this.vy   += this.gravity * dt;
    this.x    += this.vx * dt;
    this.y    += this.vy * dt;
  }
  draw(ctx, camera) {
    if (!this.alive) return;
    ctx.globalAlpha = Math.max(0, this.life / this.maxLife) ** 0.6;
    ctx.fillStyle   = this.color;
    ctx.fillRect((this.x - camera.x) | 0, (this.y - camera.y) | 0, this.size, this.size);
    ctx.globalAlpha = 1;
  }
}

export class ParticleSystem {
  constructor({ reducedMotion = false } = {}) {
    this.list = [];
    this.reducedMotion = reducedMotion;
  }

  add(particle) {
    if (this.list.length >= MAX_PARTICLES) return;
    this.list.push(particle);
  }

  burst(x, y, colors, count = 20, options = {}) {
    if (this.reducedMotion) return;
    const {
      speed    = 55,
      life     = 0.7,
      size     = 2,
      gravity  = 80,
      vy_bias  = -20,
    } = options;
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const mag   = speed * (0.4 + Math.random() * 0.8);
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.add(new Particle(
        x + (Math.random() - 0.5) * 8,
        y + (Math.random() - 0.5) * 8,
        color,
        Math.cos(angle) * mag,
        Math.sin(angle) * mag + vy_bias,
        life * (0.6 + Math.random() * 0.8),
        size, gravity,
      ));
    }
  }

  repairFlash(x, y, color) {
    this.burst(x, y, [color, '#ffffff', '#d0e8ff'], 22, {
      speed: 60, life: 0.6, size: 2, gravity: 50, vy_bias: -30,
    });
    if (!this.reducedMotion) {
      for (let i = 0; i < 4; i += 1) {
        const angle = (i / 4) * Math.PI * 2;
        this.add(new Particle(x, y, color,
          Math.cos(angle) * 90, Math.sin(angle) * 60 - 30, 0.4, 4, 100));
      }
    }
  }

  rescueFlash(x, y) {
    this.burst(x, y, ['#f0d040', '#ffe880', '#ffffff'], 28, {
      speed: 80, life: 0.9, size: 2, gravity: 90, vy_bias: -60,
    });
  }

  winCelebration(x, y) {
    if (this.reducedMotion) return;
    const colors = ['#f0d040', '#40e0d0', '#e040a0', '#80ff80', '#ffffff', '#ff9040'];
    for (let i = 0; i < MAX_PARTICLES; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 120;
      this.add(new Particle(
        x + (Math.random() - 0.5) * 120,
        y,
        colors[Math.floor(Math.random() * colors.length)],
        Math.cos(angle) * speed,
        -20 - Math.random() * 100,
        1.2 + Math.random() * 0.8,
        2, 95,
      ));
    }
  }

  switchFlash(x, y, color) {
    this.burst(x, y, [color, '#ffffff'], 10, { speed: 40, life: 0.4, size: 2, gravity: 20 });
  }

  update(dt) {
    for (const p of this.list) p.update(dt);
    this.list = this.list.filter((p) => p.alive);
  }

  draw(ctx, camera) {
    for (const p of this.list) p.draw(ctx, camera);
  }
}
