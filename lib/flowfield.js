class Flowfield {
  constructor(options) {
    this.grid = createGrid(options)
  }
  // Samples the field at the given point, interpolating if necessary
  sample(point) {
    const rounding = 128;
    const weight0 = noise(0, frameCount / 1000);
    const weight1 = noise(1000, frameCount / 1000);
    const weight2 = noise(-1000, frameCount / 1000);
    const value0 = Math.round(noise(point.x, point.y, frameCount / 100) * rounding) / rounding * Math.PI * 4;
    const value1 = Math.round(noise(point.x / 10, point.y / 10, frameCount / 500) * rounding) / rounding * Math.PI * 8;
    const value2 = Math.round(noise(point.x / 100, point.y / 100, frameCount / 1000) * rounding) / rounding * Math.PI * 16;
    return weight0 * value0 + weight1 * value1 + weight2 * value2;
  }
  initialize(options){

    switch (options.type){
      default:
      case 'noise':
        //TODO
      break;
    }
  }

}
