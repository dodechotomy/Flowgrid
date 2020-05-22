class Walker{
  constructor(flowfield,palette,lifespan){
    this.flowfield = flowfield;
    this.palette = palette;
    this.normalLifespan = lifespan;
    this.reset();
    this.lives = Math.random()*2;
  }
  move(delta=1){

    // this.history.push(this.position.copy())

    let angle = this.flowfield.sample(this.position) * TWO_PI;
    if(angle === null){
      this.reset();
      return;
    }
    // angle += (Math.random()-0.5)*2;
    const displacement = p5.Vector.fromAngle(angle).setMag(this.speed * delta);
    this.position = this.position.add(displacement);
  }
  reset(){
    this.lives--;
    if(this.lives < 0){
      this.size = 0;
      this.lifespan = 0;
      return;
    }
    this.history = [];
    const angle = Math.random()*TWO_PI;
    const radius = Math.random()*width/1.41;
    const position = p5.Vector.fromAngle(angle).setMag(radius);
    this.color = palette.nextColor();

    // this.position = position.add(createVector(width/2,height/2));
    const x = Math.random()*(width+10)-5;
    const y = Math.random()*(height+10)-5;
    this.position =  createVector(x,y);
    this.speed = Math.random()+1;
    this.size = Math.random()*50+1;
    this.lifespan = Math.random()*this.normalLifespan+10;
    this.birth = frameCount;
  }
  draw(){
    let age = map(frameCount - this.birth,0,this.lifespan,0,PI);
    if(age > PI){
      this.reset();
      return;
    }
    let actualSize = this.size * Math.sin(age);
    strokeWeight(10);
    stroke(this.color)
    let lastPos = null;
    // this.history.forEach(pos=>{
    //   if(lastPos){
    //     line(lastPos.x,lastPos.y,pos.x,pos.y);
    //   }
    //   lastPos = pos;
    // });
    noStroke();
    fill(this.color);
    ellipse(this.position.x,this.position.y,actualSize,actualSize);
  }
}
