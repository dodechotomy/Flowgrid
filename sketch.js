let grid;
let flowfield;
let gridDetail;
let gap;
let margin;
let gridSize;
let gridCellSize;
let cellSize;

function setup() {
  createCanvas(800, 800);
  rectMode(CENTER);
  gridDetail = 50;
  margin = 2;
  gridSize = width - margin;
  gridCellSize = gridSize / gridDetail;
  cellSize = gridCellSize - margin;

  // cellSize = gap-margin;
  grid = createGrid({
    dimensions: {
      origin: {
        x: margin/2 + gridCellSize/2,
        y: margin/2 + gridCellSize/2
      },
      x: gridDetail,
      y: gridDetail,
      gap: gridCellSize
    }
  });
  flowfield = new Flowfield();
}

function draw() {
  background('#19c');
  noStroke();
  grid.points.forEach((point) => {
    push();
    const value = flowfield.sample(point);
    translate(point.x, point.y)
    rotate(value);
    fill('#07a')
    ellipse(0,0,cellSize, cellSize);
    stroke("#000");
    strokeWeight(2);
    line(0,0,cellSize/2,0);
    pop();
  });

}
