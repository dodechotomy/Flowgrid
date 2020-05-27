class Group {
  constructor(flowfield,palette,lifeSpan) {

    this.flowfield = flowfield;
    this.palette = palette;
    this.lifeSpan = lifeSpan;

    this.walkers = [];
    // this.active = [];
  }
  active(){
    return this.walkers.filter(walker=>walker.active);
  }
  inactive(){
    return this.walkers.filter(walker=>!walker.active);
  }
  spawn(n = 1) {
    for (let i = 0; i < n; i++) {
      this.walkers.push(new Walker(this.flowfield, this.palette, this.lifeSpan,this))
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
  fastForward(){
    while(this.active().length > 0){
      this.move();
    }
  }
}
