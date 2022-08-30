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



let walkerDensity = () => Math.random() > 0.1 ? 1/256 : 1/2560;

let normalLifespan = () => (Math.random() * 125) + 125;

let livingWalkers = () => walkers.active().length;



let queryParams = new URLSearchParams(document.location.search);
let inky = queryParams.get("inky") === '1';
let widthParam = inky ? 640*2 : parseInt(queryParams.get("width"));
let heightParam = inky ? 400*2 : parseInt(queryParams.get("height"));

const canvasWidth = widthParam || window.innerWidth;
const canvasHeight = heightParam || window.innerHeight;


let walkerCount = () => walkerDensity() * canvasWidth * canvasHeight;


function setup() {
  createCanvas(canvasWidth, canvasHeight);
  noLoop();
  graphics = createGraphics(canvasWidth, canvasHeight);

  
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

