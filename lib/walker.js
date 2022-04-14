class Walker {
  constructor(options) {
    this.flowfield = options.flowfield;
    this.palette = options.palette;
    this.normalLifespan = options.lifespan;
    this.lives = Math.random() * 2 + 1;
    this.group = options.group;
    this.history = [];
    this.sizeMultiplier = options.sizeMultiplier || 1;
    this.speedFactor = Math.floor(options.speedFactor || 1);

    this.reset();
  }
  deactivate() {
    this.active = false;
  }
  move() {
    this.age++;
    if (this.outside) {
      this.age++;
    }
    const lifeFactor = this.age / this.lifespan;
    if (lifeFactor > 1) {
      // this.reset();
      this.deactivate();
      return;
    }
    const actualSize = this.size * Math.sin(lifeFactor * PI);
    const index = this.age * 3;
    this.history[index] = this.position.x;
    this.history[index + 1] = this.position.y;
    this.history[index + 2] = actualSize;

    const sample = this.flowfield.sample(this.position);
    if (sample === null) {
      this.outside = true;
      // this.reset();
      // return;
    } else {
      const angle = sample * TWO_PI;
      const force  = p5.Vector.fromAngle(angle);
      this.momentum = this.momentum.add(force);
      this.momentum.limit(this.speed);
      // angle += (Math.random()-0.5)*2;
    }
    this.position = this.position.add(this.momentum);
  }
  reset() {
    this.outside = false;
    if (this.lives < 0) {
      this.size = 0;
      this.lifespan = 0;
      livingWalkers--;
      return;
    }
    this.active = true;
    this.color = this.palette.nextColor();
    const range = this.flowfield.grid.range
    const rangeWidth = range[1] - range[0];
    const rangeHeight = range[3] - range[2];
    const x = Math.random() * rangeWidth + range[0];
    const y = Math.random() * rangeHeight + range[2];
    this.position = createVector(x, y);
    this.speed = Math.random() * 1.5 + 0.5;
    this.velocity = createVector();
    this.momentum = createVector();
    this.size = Math.random() * 50 * this.lives * this.sizeMultiplier;
    this.lifespan = Math.random() * this.normalLifespan + this.lives * 10;
    this.history.length = Math.ceil(this.lifespan) * 3;
    this.age = 0;
    this.lives--;
  }
  draw(graphics) {
    graphics.stroke(this.color);
    for (var i = 3; i < this.history.length; i += 3*this.speedFactor) {
      const centerX = this.history[i];
      const centerY = this.history[i + 1];
      const size = this.history[i + 2];
      graphics.strokeWeight(size)
      graphics.line(centerX, centerY, centerX, centerY);
    }
  }
}
