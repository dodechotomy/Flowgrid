let grid;

let savingFrames = false;
let savingFinals = false;
let autoAdvanceMode = false;
let animateMode = false;


let gridDetail;
let gap;
let margin;
let gridSize;

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


let walkerDensity = 0.5;
const walkerDensityDenominator = 2000;
const sizeRange = [-0.5,1.5];
const sizeScale = s=>map(s,0,1,sizeRange[0],sizeRange[1]);

let lifeSpan = [100, 300];

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

function reset() {
  if( !(resolution[0] === width && resolution[1] === height)){
    resizeCanvas(resolution[0], resolution[1], true); //resize canvas without redrawing
    graphics = createGraphics(resolution[0], resolution[1]);
  }
  gridDetail = 5;
  palette = Palette.createPalette()
  if(palette.colors.length > 4){
    secondPalette = palette.split();
  }else{
    secondPalette = palette;
  }

  perlin.seed(Math.random());
  // graphics.background(palette.background());


  graphics.noStroke();

  margin = -0.2;
  const options = {
    type: "rectangle",
    dimensions: {
      detail: gridDetail,
      range: [width * margin, width - width * margin, height * margin, height - height * margin]
    }
  }

  flowfield = new Flowfield(createGrid(options));
  flowfield.initialize();


  const walkerCount = () => walkerDensity/walkerDensityDenominator * resolution[0] * resolution[1];
  const normalLifespan = () => lifeSpan[0] + (lifeSpan[1] - lifeSpan[0]) * Math.random();

  walkers = new WalkerGroup(flowfield, palette, normalLifespan());

  walkers.spawn(walkerCount());
}

function draw() {
  clear();
  graphics.clear();
  if (autoAdvanceMode && walkers.complete()) {
    if (savingFinals) {
      saveFrame();
    }
    generate();
  }
  if(animateMode){
    flowfield.mutate();
    walkers.move();
    walkers.draw(graphics,false);
  }else{
    //starting ff
    walkers.fastForward();
    //done ff
    //starting walker draw
    walkers.draw(graphics,true);
    //done walker draw
    if(!autoAdvanceMode){
      noLoop();
    }
  }
  drawFlowfield(flowfield);
  drawGraphics(graphics);
  if (savingFrames) {
    saveFrame();
  }
  // clear();
}

function generate() {
  reset();
  flowfield.mutate();
  loop();
}


function drawGraphics(graphics) {
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

function drawFlowfield(flowfield){
    colorMode(HSB, 1);
    noFill();
    noStroke();
    let bg = palette.background();
    let bg1 = palette.nextColor(bg);
    flowfield.grid.points.flat().forEach(point=>{
      let x0 = point.x;
      let y0 = point.y;
      // let v = p5.Vector.fromAngle(point.value.direction*TWO_PI);
      // v.setMag(point.value.strength*20);
    //  let c = palette.colorBlend(point.value.size);
      let c = bg;
      if(bg1){
      c = lerpColor(bg, bg1, point.value.lifespan);
      }
      fill(c);
      circle(x0,y0,20);
    });
    // filter(BLUR,1);
}