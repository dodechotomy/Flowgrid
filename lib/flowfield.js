class Flowfield {
  constructor(grid) {
    this.grid = grid
    this.stability = 5000;// Math.exp(Math.random()*10);
  }
  // Samples the field at the given point,
  sampleQuick(vector) {
    const closest = this.grid.closestPoint(vector.x,vector.y);
    return closest && closest.value;
  }
  // Samples the field at the given point, interpolating nearby points
  sample(vector) {
    const surrounding = this.grid.surroundingPoints(vector.x,vector.y);
    if(!surrounding || surrounding.length < 1){
      return null;
    }
    let x = (vector.x - surrounding[0].x) / (surrounding[3].x - surrounding[0].x);
    let y = (vector.y - surrounding[0].y) / (surrounding[3].y - surrounding[0].y);
    let interpolations = {};
    let keys = Object.keys(surrounding[0].value);
    keys.forEach(key=>{
      interpolations[key] = bilateralInterpolate(x,y,
        surrounding[0].value[key],
        surrounding[1].value[key],
        surrounding[2].value[key],
        surrounding[3].value[key]
        );
    })
    return interpolations;
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
