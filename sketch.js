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
let walkers = [];
let framesToRender = 0;
let startFrame = 0;
let savedCount=0;
let normalLifespan = 100;

function setup() {
  createCanvas(800, 800);
  rectMode(CENTER);
  reset();
}

function keyPressed() {
  if (key === 'n') {
    reset();
  }
}

function reset() {
  gridDetail = 200;
  margin = 10;
  gridSize = width - margin;
  gridCellSize = gridSize / gridDetail;
  cellSize = gridCellSize - margin;
  // palette = Palette.limitedPalette(3);
  palette = new Palette();
  // colorMode(HSB);
  // const hue = Math.random()*100;
  perlin.seed(Math.random());
  background(  palette.nextColor());

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
      range: [-50, width + 50],
      detail: gridDetail
    }
  });
  flowfield.initialize();

  normalLifespan = Math.random()*1000;
  walkers = [];
  const walkerCount = Math.exp(Math.random()*10+3);
  for (let i = 0; i < walkerCount; i++) {
    walkers.push(new Walker(flowfield, palette,normalLifespan));
  }


  framesToRender = Math.random()*1200;
  startFrame = frameCount;
}

function draw() {
  // background(0);
  // background(palette.background());
  flowfield.mutate();
  noStroke();
  /*
  flowfield.grid.points.flat().forEach((point) => {
    push();
    // const value = Math.abs(point.value*2 - 1)/2; //flowfield.sample(point);
    const value = point.value % 1; //flowfield.sample(point);
    translate(point.x, point.y)

    let angle = value;
    // const rounding = 256;
    // angle = Math.round(value*rounding)/rounding;
    angle = map(value, 0, 1, 0, TWO_PI);
    let factor = Math.abs(value - 0.5) * 2;
    colorMode(RGB);
    const colorC = lerpColor(colorA, colorB, factor);
    colorMode(HSB);
    fill(colorC)
    rect(0, 0, cellSize, cellSize);
    // fill('#000')
    // ellipse(-10, 0, cellSize, cellSize);
    // line(-10, 0, cellSize / 2, 0);
    stroke(colorC);
    strokeWeight(2);
    rotate(angle);
    line(0, 0, cellSize, cellSize)
    pop();
  });
*/
  walkers.forEach(w=>w.move());
  walkers.forEach(w=>w.draw());

  if(frameCount-startFrame > framesToRender){
    save(`image${frameCount}frames${Math.floor(framesToRender)}.png`);
    savedCount++;
    if(savedCount>200){
      noLoop();
    }
    reset();
  }

}
