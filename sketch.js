let grid;

let savingFrames = false;
let savingFinals = false;
let autoAdvanceMode = false;
let animateMode = true;


let debugFlowfield = false;


let gridSpacing;
let gap;
let margin;
let gridSize;

let backgroundGraphics;
let graphics;
let flowfield;
let palette;
let secondPalette;
let walkers;
let group;

let framesToRender = 0;
let startFrame = 0;
let savedCount = 0;
let maxSavedFrames = 50;

let autoDelayFrames = 60;
let lastGeneratedFrame = 0;
let waiting = false;

let resetOptions = {
  keepFlowfield: true,
  keepPalette: true
}


let walkerDensity = 0.5;
const walkerDensityDenominator = 2000;
const sizeRange = [-0.5,1.5];
const sizeScale = s=>map(s,0,1,sizeRange[0],sizeRange[1]);

let suddenEndChance = 0.1;

let lifeSpan = [100, 300];
let normalLifespan = () => lifeSpan[0] + (lifeSpan[1] - lifeSpan[0]) * Math.random();

let livingWalkers = () => walkersA.active().length + walkersB.active().length + walkersMask.active().length;


let resolution = [1920, 1080];
let params = new URLSearchParams(document.location.search);
if(params.has("width")){
  let w = parseInt(params.get("width"));
  if(w > 0){
    resolution[0] = w;
  }
}
if(params.has("height")){
  let h = parseInt(params.get("height"));
  if(h > 0){
    resolution[1] = h;
  }
}
// let imageComp;

function setup() {
  createCanvas(resolution[0], resolution[1]);
  graphics = createGraphics(resolution[0], resolution[1]);
  backgroundGraphics = createGraphics(resolution[0], resolution[1]);
  reset();
  generate();
}

function saveFrame() {
  save(`image${frameCount}frames${Math.floor(framesToRender)}.png`);
  savedCount++;
  if (savedCount > maxSavedFrames) {
    noLoop();
    autoAdvanceMode = false;
  }
}

function reset(options = {}) {
  graphics.clear();
  if( !(resolution[0] === width && resolution[1] === height)){
    resizeCanvas(resolution[0], resolution[1], true); //resize canvas without redrawing
    graphics = createGraphics(resolution[0], resolution[1]);
    backgroundGraphics = createGraphics(resolution[0], resolution[1]);
  }
  gridSpacing = 20;
  if(!palette || !options.keepPalette){
      palette = Palette.createPalette()
    if(palette.colors.length > 4){
      secondPalette = palette.split();
    }else{
      secondPalette = palette;
    }
  }

  perlin.seed(Math.random());
  // graphics.background(palette.background());


  graphics.noStroke();

  if(!flowfield || !options.keepFlowfield){
    margin = -0.2;
    const options = {
      type: "random",
      dimensions: {
        detail: gridSpacing,
        range: [width * margin, width - width * margin, height * margin, height - height * margin]
      }
    }

    flowfield = new Flowfield(Grid.createGrid(options));
    flowfield.initialize();
    flowfield.mutate(); 
  }

  const walkerCount = () => walkerDensity/walkerDensityDenominator * resolution[0] * resolution[1];
  
  walkers = new WalkerGroup(flowfield, palette, normalLifespan());

  walkers.spawn(walkerCount());
}

function draw() {
  // graphics.clear();
  if (walkers.complete() && !waiting) {
    if (savingFinals) {
      saveFrame();
    }
    lastGeneratedFrame = frameCount;
    waiting = true;
  }
  if(waiting && autoAdvanceMode && frameCount > lastGeneratedFrame + autoDelayFrames){
    waiting = false;
    generate();
  }
  clear();
  if(animateMode){
    // flowfield.mutate();
    walkers.move();
    walkers.draw(graphics,false);
  }else{
    fastForward(walkers);
    walkers.draw(graphics,true);
    if(!autoAdvanceMode){
      noLoop();
    }
  }
  drawGraphics(graphics);
  if (savingFrames) {
    saveFrame();
  }
  if(debugFlowfield){
    flowfield.draw();
  }
}

function generate() {
  reset(resetOptions);
  drawBackground(flowfield);
  loop();
}


function drawGraphics(graphics) {
  image(backgroundGraphics, 0, 0);
  image(graphics, 0, 0);
}

function filterColor(options){

  options.graphics.colorMode(HSB);
  let h = hue(options.color);
  let s = saturation(options.color);
  let b = brightness(options.color);
  let a = alpha(options.color);

  let sizeFactor = map(options.size,1,100,0,1,true);
  sizeFactor = sizeFactor * sizeFactor;
  a  = map(sizeFactor,0,1,0,1, true); //make large circles transparent
  // a = a % 1;


  let ageFactor = map(options.age, 0, options.lifespan,0,1,true);
  ageFactor = Math.abs(0.5 - ageFactor)*2;
  a  = 1-ageFactor;
  a = a * a * a;

  if(a <= 0){
    return null;
  }

  return color(h,s,b,a);
  
}

function drawBackground(flowfield){
    backgroundGraphics.clear();
    backgroundGraphics.colorMode(RGB, 1);
    backgroundGraphics.noFill();
    backgroundGraphics.noStroke();
    let bg = palette.background();
    let bg1 = palette.nextColor(bg);

    // bg = color('red');
    // bg1 = color('blue');
    bg1 = null;

    if(!bg1){
      backgroundGraphics.background(bg);
      return;
    }
    for(let x = 0; x < width; x++){
      for(let y = 0; y < height; y++){
        let sample = flowfield.sample({x,y},gridSpacing);
        let k =  sample.size;
        // k = map(k,0,1,0,1, true);
        // k =  Math.round(k);
        let c = lerpColor(bg, bg1, k);
        backgroundGraphics.set(x,y,c);
      }
    }
    backgroundGraphics.updatePixels();
    filter(BLUR,2);
}


function fastForward(walkerGroup) {
  while (!walkerGroup.complete()) {
    walkerGroup.move();
  }
}