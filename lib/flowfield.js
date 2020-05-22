class Flowfield {
  constructor(options) {
    const _options = {...options,type: "square"}
    this.grid = createGrid(_options)
    this.stability = Math.exp(Math.random()*20);
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
        // noiseDetail(4,0.5);
        this.grid.points.flat().forEach(point => {
          point.value = perlin.simplex2(point.x/1000, point.y/1000)/2 + 0.5;
          point.speed = 0;
        })
        break;
    }
  }
  mutate(){
    this.grid.points.flat().forEach(point => {
      // point.value +=  point.speed;
      point.value = perlin.simplex3(point.x/1000, point.y/1000, frameCount/this.stability)+1;
    })
  }

}
