class Grid {
  constructor(options) {
    this.options = options;
    this.type = options.type || "square";
    this.points = options.points || [];
    this.range = options.dimensions.range;// range can be a number or array wit one number, indicating the maximum extent, an array of two numbers, indicating identical x and y extents, or an array of 4 numbers
		//maximum
		//[maximum]
		//[minimum, maximum]
		//[minX, maxX, minY, maxY]
    if (!isNaN(this.range)) { //if range is a number, use 0 to range
      this.range = [0, this.range];
    }
    if (this.range.length === 1) {//if range is an array with one element, add 0 to the start
      this.range.unshift(0);
    }
    if (this.range.length === 2) {//if range is an array with 2 elements, duplicate them
      this.range = [...this.range, ...this.range];
    }
	let w = this.range[1]-this.range[0];
	let x = this.range[0] + w/2;
	let h = this.range[3]-this.range[2];
	let y = this.range[2] + h/2;
	this.quadtree = QuadTree.create(x,y,w,h);
	this.points.forEach(p=>this.quadtree.insert(p));
  }
  
  closest(point, count, maximumDistance) {
 	 return this.quadtree.closest(point, count, maximumDistance)
  }

  //clones the points list so that it can be mutated also. Does not clone the userdata
  clone(){
    let points = this.points.map(oldPoint=>new Point(oldPoint.x,oldPoint.y));
    let newClone =  new Grid({...this.options,points});
    return newClone;
  }


static createGrid(options) {
  let _options = options || {
    type: "rectangle",
    dimensions: {
      detail: 20,
      range: [0, 1]
    }
  }
  let points = [];
  switch (_options.type) {
    case "random":
      points = Grid.createRandomPoints(_options.dimensions);
    break;
    case "rectangle":
    default:
      points = Grid.createRectanglePoints(_options.dimensions);
    break;
  }
  return new Grid({
    ..._options,
    points,
  })
}

static createRectanglePoints(dimensions) {
  const {
    range,
    detail
  } = dimensions;
  const xStart = range[0];
  const xEnd = range[1];
  const yStart = range.length >= 4 ? range[2] : range[0];
  const yEnd = range.length >= 4 ? range[3] : range[1];

  const points = Grid.createGridPoints(xStart,xEnd,yStart,yEnd,detail,detail);

  return points;
}

static createRandomPoints(dimensions) {
  const {
    range,
    detail
  } = dimensions;
  const xStart = range[0];
  const xEnd = range[1];
  const yStart = range.length >= 4 ? range[2] : range[0];
  const yEnd = range.length >= 4 ? range[3] : range[1];
  
  const points = [];

  const count = (xEnd - xStart) * (yEnd - yStart) / (detail * detail);
  for (let i = 0; i < count; i++) {
    const newPoint = new Point(random(xStart,xEnd),random(yStart,yEnd));
    points.push(newPoint);
  }

  return points;
}

static createGridPoints(xStart,xEnd,yStart,yEnd,xGap,yGap){
  const points = [];
  for (let x = xStart; x <= xEnd; x += xGap) {
    for (let y = yStart; y <= yEnd; y += yGap) {
	    const newPoint = new Point(x,y);
      points.push(newPoint);
    }
  }
  return points;
}

  
}