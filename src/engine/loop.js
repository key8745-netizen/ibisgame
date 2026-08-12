export class FixedStepLoop {
  constructor({ update, render, step = 1 / 60, maxFrameDelta = 0.1 }) {
    this.update = update;
    this.render = render;
    this.step = step;
    this.maxFrameDelta = maxFrameDelta;
    this.running = false;
    this.accumulator = 0;
    this.previous = 0;
    this.frameHandle = 0;
    this.frame = this.frame.bind(this);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.accumulator = 0;
    this.previous = performance.now();
    this.frameHandle = requestAnimationFrame(this.frame);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.frameHandle);
  }

  resetClock(now = performance.now()) {
    this.previous = now;
    this.accumulator = 0;
  }

  frame(now) {
    if (!this.running) return;
    const elapsed = Math.min(Math.max((now - this.previous) / 1000, 0), this.maxFrameDelta);
    this.previous = now;
    this.accumulator += elapsed;

    while (this.accumulator >= this.step) {
      this.update(this.step);
      this.accumulator -= this.step;
    }

    this.render(this.accumulator / this.step);
    this.frameHandle = requestAnimationFrame(this.frame);
  }
}
