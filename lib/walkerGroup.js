class WalkerGroup {
  constructor(flowfield, palette, lifespan, sizefield) {

    this.flowfield = flowfield;
    this.sizefield = sizefield;
    this.palette = palette;
    this.lifespan = lifespan;
    this.speedFactor = Math.random() > 0.9 ? Math.random() * 2 + 1 : 1;
    this.walkers = [];
    this.activeThreshold = Math.random();
    this.palettePreference = Math.random();
    // this.active = [];
  }
  complete(){
    return this.active().length <= this.activeThreshold * this.walkers.length/2;
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
        sizefield: this.sizefield,
        palette: this.palette,
        lifespan: this.lifespan,
        group: this,
        speedFactor: this.speedFactor,
        lives: 2,
        palettePreference: this.palettePreference,
      }))
    }
  }
  move() {
    this.active().forEach(walker => {
      walker.move();
    });
  }
  draw(graphics,history) {
    if(history){
      this.walkers.forEach(walker => {
        walker.draw(graphics,true);
      });
    }else{
      this.active().forEach(walker => {
        walker.draw(graphics,false);
      });
    }
  }
  fastForward() {
    let timeoutLimit = 1000000;
    let cycles = 0;
    while (!this.complete()) {
      cycles++;
      if(cycles > timeoutLimit){
        break;
      }
      this.move();
    }
    console.log(cycles);
  }
}
