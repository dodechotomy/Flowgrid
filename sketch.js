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
  perlin.seed(Math.random());
  background(palette.nextColor());

  colorA = palette.nextColor();
  colorB = palette.nextColor();
  grid = createGrid({
    type: "SQUARE",
    dimensions: {
      detail: gridDetail,
      range: [0, width]
    }
  });
  flowfield = new Flowfield({
    dimensions: {
      range: [-200, width + 200],
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
  flowfield.mutate();
  noStroke();
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
