class Walker {
  constructor(options) {
    this.flowfield = options.flowfield;
    this.palette = options.palette;
    this.normalLifespan = options.lifespan;
    this.group = options.group;
    this.sizeMultiplier = options.sizeMultiplier || 1;
    this.speedFactor = Math.floor(options.speedFactor || 1);
    this.colorSpeed = Math.random();
	
    this.reset();
  }
  deactivate() {
    this.active = false;
  }
  move() {
    const lifeFactor = this.age / this.lifespan;
    if (lifeFactor > 1) {
      // this.reset();
      this.deactivate();
      return;
	  }
    const actualSize = this.size * Math.sin(lifeFactor * PI);

    let historyEntry = {};
    historyEntry.x = this.position.x;
    historyEntry.y = this.position.y;
    historyEntry.size = actualSize;
    colorMode(RGB);
  	historyEntry.color = lerpColor(this.colorStart, this.colorEnd, lifeFactor * this.colorSpeed);

    
    this.history.push(historyEntry);
	
    const sample = this.flowfield.sample(this.position);
    if (sample === null) {
      this.outside = true;
      // this.reset();
      // return;
    } else {
      const angle = sample * TWO_PI;
      const force = p5.Vector.fromAngle(angle);
      this.momentum = this.momentum.add(force);
      this.momentum.limit(this.speed);
      // angle += (Math.random()-0.5)*2;
    }
    this.position = this.position.add(this.momentum);
    this.age++;
  }
  reset() {
  	this.history = [];
    this.active = true;
    this.colorStart = this.palette.nextColor();
	  this.color = this.colorStart;
    this.colorEnd = this.palette.nextColor();
    const range = this.flowfield.grid.range
    const rangeWidth = range[1] - range[0];
    const rangeHeight = range[3] - range[2];
    const x = Math.random() * rangeWidth + range[0];
    const y = Math.random() * rangeHeight + range[2];
    this.position = createVector(x, y);
    this.speed = (Math.random() * 1.5 + 0.5) * this.speedFactor;
    this.velocity = createVector();
    this.momentum = createVector();
    this.size = Math.random() * 50 * this.sizeMultiplier;
    this.lifespan = Math.random() * this.normalLifespan;
    this.age = 0;
  }
  draw(graphics) {
    for (var i = 0; i < this.history.length; i++) {
      const historyEntry = this.history[i];
      const centerX = historyEntry.x;
      const centerY = historyEntry.y;
      const size = historyEntry.size;
      const c = historyEntry.color;

      graphics.fill(c);
      // graphics.stroke(c);
      // graphics.strokeWeight(size/2)
      graphics.circle(centerX, centerY, size);
    }
  }
}
