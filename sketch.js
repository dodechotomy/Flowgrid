let grid;

let savingFrames = false;

let flowfield;


let gridDetail = 200;
let gap;
let margin = -0.2;
let gridSize;
let palette;
let walkers;
let graphics;


let walkerCount = () => 1000;
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
}

function reset() {

  palette = Palette.inkyInterpolatePalette();
  
  perlin.seed(Math.random());

  graphics.background(palette.background());
  graphics.noStroke();
  
  
  if (Math.random() < 0.2) {
    margin = Math.random() / 5;
  }
  const options = {
    type: "SQUARE",
    dimensions: {
      detail: gridDetail,
      range: [width * margin, width - width * margin, height * margin, height - height * margin]
    }
  }

  flowfield = new Flowfield(createGrid(options));
  flowfield.initialize();


  walkers = new Group(flowfield, palette, normalLifespan());
  

  walkers.spawn(walkerCount());
  
  document.getElementById("debug-log").innerHTML = walkers.walkers.length;
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

