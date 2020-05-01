let grid;
let flowfield;

function setup() {
  createCanvas(1080, 1080);
  const gridDetail = 10;
  const gap = width / gridDetail;
  grid = createGrid({
    dimensions: {
      x: gridDetail,
      y: gridDetail,
      gap: gap
    }
  });
  flowfield = new Flowfield();
}

function draw() {
  background('#19c');
  grid.points.forEach((point) => {
    ellipse(point.x, point.y, 20);
  });

}
