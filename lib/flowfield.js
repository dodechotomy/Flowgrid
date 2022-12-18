class Flowfield {
  constructor(grid) {
    this.grid = grid
    this.stability = 5000;// Math.exp(Math.random()*10);
  }
  // Samples the field at the given point,
  sampleQuick(vector) {
    const closest = this.grid.closest(vector.x,vector.y);
	if(!closest){
		return null;
	}
    return closest.userData;
  }
  // Samples the field at the given point, averaging nearby points
  sample(vector) {
    const surrounding = this.grid.closest(vector.x,vector.y,3);
    if(!surrounding){
      return null;
    }
	if(surrounding.length == 1){
		return surrounding[0].userData;
	}
	if(surrouding.length == 2){
		return surrounding[0].userData;
		//TODO add lerp for 2 closest points
	}
	
	//weighted average of the closest points
	// weights are inversely proportional to the distance from that point squared
	let distances = [];
	
	//calculate each distance, if ay point is extremely close, just return its data
	for (var i = 0; i < surrounding.length; i++) {
		distances[i] = p5.Vector.distanceSq(surrounding[i],vector);
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
			average += surrounding[i][key] * weights[i];
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
