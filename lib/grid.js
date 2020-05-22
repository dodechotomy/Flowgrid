class Grid {
  constructor(options) {
    this.type = options.type || "square"
    this.points = options.points || [];
    this.range = options.dimensions.range;
    this.y = options.dimensions.range;
  }
  closestPoint(x,y){
    debugger;
    //TODO Implement quadtree closest point search
    //which would allow efficient non square grids
    let row;
    for(let i = 0; i < this.points.length; i++ ){
      row = this.points[i];
      if(row[0].x <= x){
        for(let j = 0; j < row.length; j++ ){
          if(row[j].y <= y){
            return row[j];
          }
        }
      }
    }
    return row[i-1];
  }

}

class Gridpoint {
  constructor(options) {
    this.x = options.x || 0;
    this.y = options.y || 0;
  }
}

function createGrid(options) {
  let _options = options || {
    type: "square",
    dimensions: {
      detail: 20,
      range: [0, 1]
    }
  }
  let points=[];
  switch (_options.type) {
    case "square":
    default:
      points = createSquarePoints(_options.dimensions);
  }
  return new Grid({
    ..._options,
    points,
  })
}

function createSquarePoints(dimensions) {
  const {
    range,
    detail
  } = dimensions;
  const xStart = range[0];
  const xEnd = range[1];
  const yStart = range.length >= 4 ? range[2] : range[0];
  const yEnd = range.length >= 4 ? range[3] : range[1];
  const xDetail = Array.isArray(detail) ? detail[0] : detail;
  const yDetail = Array.isArray(detail) ? detail[1] : detail;
  const xGap = (xEnd - xStart) / xDetail;
  const yGap = (yEnd - yStart) / yDetail;

  const points = [];
  for (let x = xStart; x <= xEnd; x += xGap) {
    const newRow = [];
    points.push(newRow);
    for (let y = yStart; y <= yEnd; y += yGap) {
      const newPoint = {
        x,
        y
      };
      newRow.push(newPoint);
    }
  }
  return points;
}
