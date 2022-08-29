let grid;

let savingFrames = false;

let flowfieldA;


let gridDetail;
let gap;
let margin;
let gridSize;

let paletteA;


let walkersA;


let framesToRender = 0;
let startFrame = 0;
let savedCount = 0;

let graphicsA;


let walkerCountExponent = 8;
const walkerCount = () => 10000;

let livingWalkers = () => walkersA.active().length + walkersB.active().length + walkersMask.active().length;

const normalLifespan = () => (Math.random() * 125) + 125;

let groupA;

function setup() {
  createCanvas(640, 400);
  noLoop();
  graphicsA = createGraphics(640, 400);
  
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
  gridDetail = 200;

  paletteA = Palette.inkyInterpolatePalette();
  
  perlin.seed(Math.random());

  graphicsA.background(paletteA.background());
 




  graphicsA.noStroke();
  
  
  margin = -0.2;
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

  flowfieldA = new Flowfield(createGrid(options));
  flowfieldA.initialize();


  walkersA = new Group(flowfieldA, paletteA, normalLifespan());
  

  walkersA.spawn(walkerCount());
  

}

function draw() {
  clear();
  reset();
  flowfieldA.mutate();
  

  walkersA.fastForward();
  

  walkersA.draw(graphicsA);
  
    drawGraphics(graphicsA);
	
	
}

function drawGraphics(graphics) {
  clear();
  image(graphics, -50, -50);
}

