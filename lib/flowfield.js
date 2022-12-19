class Flowfield {
  constructor(grid) {
    this.grid = grid
    this.stability = 5000;// Math.exp(Math.random()*10);
  }
  // Samples the field at the given point,
  sampleQuick(point) {
    const closest = this.grid.closest(point, 1, 1);
	if(!closest){
		return null;
	}
    return closest.userData;
  }
  // Samples the field at the given point, averaging nearby points
  sample(point, radius) {
    let interpolateDistance = radius || gridSpacing;
    let surrounding = [];
    let limit = 8;
    let minimumSamples = 4;
    while(limit > 0 && surrounding.length < minimumSamples){
      const circleRange = new Circle(point.x,point.y,interpolateDistance);
      surrounding = this.grid.quadtree.query(circleRange);
      interpolateDistance *= 2;
      limit --;
    }
    if(surrounding.length == 0){
      return null;
    }
    if(surrounding.length == 1){
      return surrounding[0].userData;
    }
    if(surrounding.length == 2){
      return surrounding[0].userData;
      //TODO add lerp for 2 closest points
    }
	
	//weighted average of the closest points
	// weights are inversely proportional to the distance from that point squared
	let distances = [];
	
	//calculate each distanceSq, if ay point is extremely close, just return its data
	for (var i = 0; i < surrounding.length; i++) {
    let dX = point.x - surrounding[i].x;
    let dY = point.y - surrounding[i].y;
		distances[i] = dX * dX + dY * dY;
		if(distances[i] < 0.00001){
			return surrounding[i].userData;
		}
	}
	//calculate weights for each point, inverse to its distanceSq
	let weights = [];
	let weightSum = 0;
	for (var i = 0; i < surrounding.length; i++) {
		weights[i] = 1 / distances[i];
		weightSum += weights[i];
	}
    
	//calculate weighted averages for each attribute of each point
	let weightedAverage = {};
    let keys = Object.keys(surrounding[0].userData);
    keys.forEach(key=>{
		let average = 0;
		for (var i = 0; i < surrounding.length; i++) {
			average += surrounding[i].userData[key] * weights[i];
		}
		average /= weightSum;
		weightedAverage[key] = average;
    })
    return weightedAverage;
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
      point.userData = {direction,strength,size,lifespan,palette};
    })
  }

  draw(){
    fill(color('magenta'));
    stroke(color('magenta'));
    strokeWeight(10);
    this.grid.points.forEach(point=>{
      const p = point.userData;
      let v = p5.Vector.fromAngle(p.direction * TWO_PI).setMag(p.strength*50);
      strokeWeight(20);
      stroke(color('cyan'));
      line(point.x,point.y,point.x + v.x, point.y + v.y);
      strokeWeight(10);
      stroke(color('magenta'));
      line(point.x,point.y,point.x + v.x, point.y + v.y);
    });
  }

  //clones the underlaying structure, creating a new grid and flowfield with the same options as this. Does not clone the data attached to points.
  clone(){
    let newClone =  new Flowfield(this.grid.clone());
    newClone.stability = this.stability;
    return newClone;
  }

}
