class Grid {
  constructor(options) {
    this.type = options.type || "SQUARE"
    this.points = options.points || [];
  }

}

class Gridpoint {
  constructor(options) {
    this.x = options.x || 0;
    this.y = options.y || 0;
  }
}

function createGrid(options) {
  let points;
  switch (options.type) {
    case "SQUARE":
    default:
      points = createSquareGrid(options.dimensions);
  }
  return new Grid({
    ...options,
    points: points.flat()
  })
}

function createSquareGrid(dimensions) {
  const {x,y,gap} = dimensions;
  if (isNaN(x) || isNaN(y) || isNaN(gap)) {
    return [];
  }
  const points = [];
  for (let _x = 0; _x < x; _x++) {
    const newRow = [];
    points.push(newRow);
    for (let _y = 0; _y < y; _y++) {
      const newPoint = {
        x: _x * gap,
        y: _y * gap
      };
      newRow.push(newPoint);
    }
  }
  return points;
}
