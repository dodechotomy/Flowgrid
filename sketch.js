let grid;

let savingFrames = false;

let flowfield;


let gridDetail = 200;
let gap;
let margin = () => Math.random() > 0.1 ? -0.2 : 0.2;
let gridSize;
let palette;
let walkers;
let graphics;


let walkerCount = () => Math.random() > 0.1 ? 1000 : 100;
let normalLifespan = () => (Math.random() * 125) + 125;

let livingWalkers = () => walkers.active().length;



function setup() {
  createCanvas(640, 400);
  noLoop();
  graphics = createGraphics(640, 400);
  
}

function keyPressed() {
  if (key === 'n') {
    // reset();
    if(!isLooping()){
      draw();
    }
  }
  if(key==='l'){
  	isLooping()?noLoop():loop();
  }
}

function reset() {

  palette = Palette.inkyInterpolatePalette();
  
  perlin.seed(Math.random());

  graphics.background(palette.background());
  graphics.noStroke();
  let _margin = margin();
  const options = {
    type: "SQUARE",
    dimensions: {
      detail: gridDetail,
      range: [width * _margin, width * (1 - _margin), height * _margin, height * (1 - _margin)]
    }
  }

  flowfield = new Flowfield(createGrid(options));
  flowfield.initialize();


  walkers = new Group(flowfield, palette, normalLifespan());
  

  walkers.spawn(walkerCount());
  
}

function draw() {
  reset();
  flowfield.mutate();
  walkers.fastForward();
  walkers.draw(graphics);
  drawGraphics(graphics);
	
  // stroke(0)
  // strokeWeight(20);
  // line(0,0,width,height);
  // line(0,height,width,0);
  // stroke(255)
  // strokeWeight(10);
  // line(0,0,width,height);
  // line(0,height,width,0);
	
}

function drawGraphics(graphics) {
  clear();
  image(graphics, 0,0);
}

