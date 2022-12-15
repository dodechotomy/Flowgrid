class Flowfield {
  constructor(grid) {
    this.grid = grid
    this.stability = 5000;// Math.exp(Math.random()*10);
  }
  // Samples the field at the given point, interpolating if necessary
  sample(vector) {
    const closest = this.grid.closestPoint(vector.x,vector.y);
    return closest && closest.value;
  }
  initialize(options) {
    const {type} = options || {};
    switch (type) {
      default:
      case 'noise':
        //TODO
        this.mutate();
        break;
    }
  }
  mutate(){
    this.grid.points.flat().forEach(point => {
      const o = 10000;
      let direction = perlin.simplex3(point.x/1000, point.y/1000, frameCount/this.stability)+1;
      let strength = (perlin.simplex3(o+point.x/1200, o+point.y/1200, o+frameCount/this.stability)+1) / 2;
      let size = (perlin.simplex3(o*2+point.x/1500, o*2+point.y/1500, o*2+frameCount/this.stability)+1) / 2;
      let lifespan = (perlin.simplex3(o*3+point.x/2000, o*3+point.y/2000, o*3+frameCount/this.stability)+1) / 2;
      let palette = (perlin.simplex3(o*4+point.x/1000, o*4+point.y/1000, o*4+frameCount/this.stability)+1) / 2;
      point.value = {direction,strength,size,lifespan,palette};
    })
  }

  draw(){
    fill(0);
    stroke(255);
    strokeWeight(2);
    this.grid.points.flat().forEach(point=>{
      ellipse(point.x,point.y,2,2);
    });
  }

  //clones the underlaying structure, creating a new grid and flowfield with the same options as this. Does not clone the data attached to points.
  clone(){
    let newClone =  new Flowfield(this.grid.clone());
    newClone.stability = this.stability;
    return newClone;
  }

}
