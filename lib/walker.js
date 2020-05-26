class Walker {
  constructor(flowfield, palette, lifespan) {
    this.flowfield = flowfield;
    this.palette = palette;
    this.normalLifespan = lifespan;
    this.reset();
    this.lives = Math.random() * 2;
  }
  move(delta = 1) {

    // this.history.push(this.position.copy())

    let angle = this.flowfield.sample(this.position) * TWO_PI;
    if (angle === null) {
      this.reset();
      return;
    }
    // angle += (Math.random()-0.5)*2;
    const displacement = p5.Vector.fromAngle(angle).setMag(this.speed * delta);
    this.position = this.position.add(displacement);
  }
  reset() {
    this.lives--;
    if (this.lives < 0) {
      this.size = 0;
      this.lifespan = 0;
      return;
    }
    this.history = [];
    this.color = palette.nextColor();
    const range = this.flowfield.grid.range
    const rangeWidth = range[1] - range[0];
    const rangeHeight = range[3] - range[2];
    const x = Math.random() * rangeWidth;
    const y = Math.random() * rangeHeight;
    this.position = createVector(x, y);
    this.speed = Math.random()*1.5 + 0.5;
    this.size = Math.random() * 50 + 1;
    this.lifespan = Math.random() * this.normalLifespan + 10;
    this.birth = frameCount;
  }
  draw() {
    let age = map(frameCount - this.birth, 0, this.lifespan, 0, 1);
    if (age > 1) {
      this.reset();
      return;
    }
    let actualSize = this.size * Math.sin(age*PI);
    noStroke();
    fill(this.color);
    ellipse(this.position.x, this.position.y, actualSize, actualSize);
  }
}
