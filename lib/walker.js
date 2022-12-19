class Walker {
  constructor(options) {
    this.flowfield = options.flowfield;
    this.palette = options.palette;
    this.normalLifespan = options.lifespan;
    this.lives = options.lives || 1;
    this.group = options.group;
    this.history = [];
    this.speedFactor = Math.floor(options.speedFactor || 1);
    this.curl =  0;
    this.childrenCount = 0;
    this.childrenLimit = 50;
    this.splitDelay = 50;
    this.ageLastSplit = 0;
    this.palettePreference =  options.palettePreference || 1;

    this.reset(options.givens);
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
    if (this.size <= 0 || lifeFactor > 1) {
      if (this.lives < 0) {
        this.deactivate();
      }else{
        this.reset();
      }
      return;
    }
    const actualSize = this.size * Math.sin(lifeFactor * PI);
    const index = this.age * 3;
    this.history[index] = this.position.x;
    this.history[index + 1] = this.position.y;
    this.history[index + 2] = actualSize;

    const sample = this.flowfield.sample(this.position);
    if (!sample) {
      this.outside = true;
      // this.reset();
      // return;
    } else {
      const angle = sample.direction * TWO_PI;
      const strength = sample.strength * 2;
      const force = p5.Vector.fromAngle(angle).mult(strength);
      let forcePower = 1;
      let momentumPower = 2;
      if(this.isChild){
        // let ageSinceSplit = this.age - this.splitAge;
        this.momentum = this.momentum.rotate(this.curl);
        this.momentum.mult(0.995);
        forcePower = 0.01
      }
      let powerFactor = 1 /(forcePower + momentumPower);
      forcePower *= powerFactor;
      momentumPower *= powerFactor;
      // this.momentum = force;
      this.momentum.mult(momentumPower).add(force.mult(forcePower));
      
      let currentSpeed = this.momentum.mag();
      let newSpeed = (currentSpeed + this.speed)/2;
      this.momentum.limit(newSpeed);
    }
    this.position = this.position.add(this.momentum);
    if(
      (this.childrenCount < this.childrenLimit)
       && this.lives > 0
       && lifeFactor > 0.2
       && Math.random() > 0.9
       && this.age - this.ageLastSplit > this.splitDelay
       ){
      this.split();
    }
  }
  reset(givens = {}) {
    this.outside = false;
    this.active = true;
    this.hasSplit = false;
    this.ageLastSplit = 0;
    this.isChild = false;
    const range = this.flowfield.grid.range
    const rangeWidth = range[1] - range[0];
    const rangeHeight = range[3] - range[2];
    const x = Math.random() * rangeWidth + range[0];
    const y = Math.random() * rangeHeight + range[2];
    this.position = givens.position || createVector(x, y);
    this.speed = givens.speed ||  (Math.random() * 1.5 + 0.5)*this.speedFactor;
    // this.speed = this.speed / 2;
    this.momentum = givens.momentum ||  createVector();
    const sample = this.flowfield.sample(this.position);
    this.sizeMultiplier = sample ? sample.size : 1;
    this.sizeMultiplier = sizeScale(this.sizeMultiplier);
    this.size = givens.size || Math.random() * 50 *  this.sizeMultiplier;
    this.lifespan = Math.random() * this.normalLifespan;
    if(sample){
      this.lifespan *= sample.lifespan;
    }
    this.history.length = Math.ceil(this.lifespan) * 3;
    this.age = givens.age || 0;
    this.curl =  givens.curl || 0;
    this.lives--;
    this.childrenCount = 0;
    if(sample){
      if(Math.random() < sample.palette * this.palettePreference){
        this.palette = secondPalette;
      }
    }
    this.color = givens.color || this.palette.nextColor();
  }
  draw(graphics,history) {
    if(history){
      this.drawHistory(graphics)
    }else{
      this.drawSingle(graphics, this.age)
    }
  }
  drawHistory(graphics) {
    graphics.noStroke();
    graphics.fill(this.color);
    for (var i = 0; i < this.age; i += 1) {
      this.drawSingle(graphics, i);
    }
  }
  drawSingle(graphics, age){
    let i = age*3;
    const centerX = this.history[i];
    const centerY = this.history[i + 1];
    const size = this.history[i + 2];
    let filterOptions = {
      color: this.color,
      x:centerX,
      y:centerY,
      size: size,
      age: age,
      lifespan: this.lifespan,
      graphics: graphics
    }
    let newColor = filterColor(filterOptions);
    if(newColor){
      // this.color.setAlpha(a);
      // graphics.stroke(this.color);
      // graphics.strokeWeight(size)
      // graphics.line(centerX, centerY, centerX, centerY);
      graphics.fill(newColor);
      // graphics.noFill();
      graphics.noStroke();
      // graphics.stroke(this.color);
      // graphics.strokeWeight(1);
      graphics.circle(centerX, centerY, size, size);
    }
  }
  split(){
    this.lives /= 2;
    let options = {
      flowfield: this.flowfield,
      palette: this.palette,
      lifespan: this.lifespan,
      group: this.group,
      speedFactor: this.speedFactor,
      lives: this.lives,
      givens:{
        position: createVector(this.position.x,this.position.y),
        speed: this.speed,
        momentum: this.momentum.copy().mult(1.2),
        size: this.size,
        // color: color(this.color),
        age: this.age,
      }
    }
    let child = new Walker(options);
    let myIndex = this.group.walkers.indexOf(this);
    this.group.walkers.splice(myIndex,0,child);


    let newCurl = (Math.random() +1) * 0.025;
    if(this.curl > 0.001 || (this.curl > -0.001 && Math.random() > 0.5)){
      newCurl *= -1
    }
    child.curl = newCurl;

    this.childrenCount ++;
    child.isChild = true;
    child.ageLastSplit = this.age;
    this.ageLastSplit = this.age;
    // child.color = color("magenta");
  }
}
