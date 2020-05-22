let grid;
let flowfield;
let gridDetail;
let gap;
let margin;
let gridSize;
let gridCellSize;
let cellSize;
let colorA, colorB;
let palette;

function setup() {
  createCanvas(800, 800);
  rectMode(CENTER);
  reset();
}

function keyPressed(){
  if( key  === 'n'){
    reset();
  }
}
function reset(){
  gridDetail = 50;
  margin = -1;
  gridSize = width - margin;
  gridCellSize = gridSize / gridDetail;
  cellSize = gridCellSize - margin;
  palette = Palette.twoColorPalette();
  // colorMode(HSB);
  // const hue = Math.random()*100;
  perlin.seed(Math.random());
  colorA = palette.nextColor();
  colorB = palette.nextColor();
  // cellSize = gap-margin;
  grid = createGrid({
    type: "SQUARE",
    dimensions: {
      detail: gridDetail,
      range: [0, width]
    }
  });
  flowfield = new Flowfield({
    dimensions: {
      range: [-20, width + 20],
      detail: gridDetail
    }
  });
  flowfield.initialize();
}

function draw() {
  // background('#07a');
  flowfield.initialize();
  noStroke();
  flowfield.grid.points.flat().forEach((point) => {
    push();
    const value = point.value; //flowfield.sample(point);
    translate(point.x, point.y)
    // rotate(value*TWO_PI);
    // const colorA = color('#07a');
    // const colorB = color('#000');
    const colorC = lerpColor(colorA,colorB,value);
    fill(colorC)
    rect(0, 0, cellSize, cellSize);
    // fill('#000')
    // ellipse(-10, 0, cellSize, cellSize);
    // stroke("#000");
    // strokeWeight(2);
    // line(-10, 0, cellSize / 2, 0);
    pop();
  });

}
