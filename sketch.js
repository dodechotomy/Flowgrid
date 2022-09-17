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



  displayText();
  let textcolors = canvasDominantColors();
  textcolors = textcolors ? Object.values(textcolors) : null;
  colorText(textcolors);
	
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

function displayText(){
  let date = new Date(Date.now());

  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let dayOfWeek = dayNames[date.getDay()];
  
  let options = { year: "numeric", month: "long", day: "numeric" };
  let monthDayYear = date.toLocaleDateString("en-US",options);

  document.getElementById("day-of-week").innerHTML = dayOfWeek;
  document.getElementById("month-day-year").innerHTML = monthDayYear;
}

function colorText(textcolors){
  let foreground = textcolors ? textcolors[0] : color("black");
  let background = textcolors ? textcolors[1] : color("white");

  let contrastResult = Palette.findMaximumContrast(palette.colors);
  if(contrastResult.maximumContrast > 4.5){
    foreground = contrastResult.contrastingColors[0];
    background = contrastResult.contrastingColors[1];
  }

  document.getElementById("text-display").style.backgroundColor = background.toString('#rrggbb');
  document.getElementById("day-of-week").style.color = foreground.toString('#rrggbb');
  document.getElementById("month-day-year").style.color = foreground.toString('#rrggbb');

}


//extract dominant colors from canvas
function canvasDominantColors(){
  let image = document.getElementsByTagName('canvas')[0];

  let dominantPalette = areaPalette(image, {
    w: 100,
    h: 100,
    x: '50%',
    y: '50%',
    palettesize: 8,
    debug: false
  });

  let dominantColors = dominantPalette.map(c=>color(c.hex));
  let acceptableColors = Palette.findContrastPairs(dominantColors,4);
  let index = floor(random()*acceptableColors.length);
  return acceptableColors[index];
}