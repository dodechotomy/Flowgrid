class Flowfield {
  constructor(options) {
    const _options = {...options,type: "square"}
    this.grid = createGrid(_options)
  }
  // Samples the field at the given point, interpolating if necessary
  sample(x,y) {
    return grid.closestPoint(x,y).value;
  }
  initialize(options) {
    const {type} = options || {};
    switch (type) {
      default:
      case 'noise':
        //TODO
        // noiseDetail(4,0.5);
        this.grid.points.flat().forEach(point => {
          point.value = perlin.simplex3(point.x/100, point.y/100,  frameCount / 100)
        })
        break;
    }
  }

}
