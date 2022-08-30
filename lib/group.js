class Group {
  constructor(flowfield, palette, lifespan) {

    this.flowfield = flowfield;
    this.palette = palette;
    this.lifespan = lifespan;
    this.speedFactor = Math.random() > 0.9 ? Math.random() * 2 + 1 : 1;
    this.walkers = [];
  }
  active() {
    return this.walkers.filter(walker => walker.active);
  }
  inactive() {
    return this.walkers.filter(walker => !walker.active);
  }
  spawn(n = 1) {
    for (let i = 0; i < n; i++) {
      this.walkers.push(new Walker({
        flowfield: this.flowfield,
        palette: this.palette,
        lifespan: this.lifespan,
        group: this,
        speedFactor: this.speedFactor
      }))
    }
  }
  move() {
    this.active().forEach(walker => {
      walker.move();
    });
  }
  draw(graphics) {
    this.walkers.forEach(walker => {
      walker.draw(graphics);
    });
  }
  fastForward() {
    while (this.active().length > 0) {
      this.move();
    }
  }
}
