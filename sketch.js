let grid;

let savingFrames = false;

let flowfieldA;
let flowfieldB;
let flowfieldMask;

let gridDetail;
let gap;
let margin;
let gridSize;

let paletteA;
let paletteB;
let paletteMask;

let walkersA;
let walkersB;
let walkersMask;

let framesToRender = 0;
let startFrame = 0;
let savedCount = 0;

let graphicsA;
let graphicsB;
let graphicsMask;

let walkerCountExponent = 8;

let livingWalkers = () => walkersA.active().length + walkersB.active().length + walkersMask.active().length;

let groupA;
let groupB;
let groupMask;

const resolution = [400, 400];
// let imageComp;

function setup() {
  noLoop();
  createCanvas(resolution[0], resolution[1]);
  graphicsA = createGraphics(resolution[0], resolution[1]);
  graphicsB = createGraphics(resolution[0], resolution[1]);
  graphicsMask = createGraphics(resolution[0], resolution[1]);
  reset();
}

function saveFrame() {
  save(`image${frameCount}frames${Math.floor(framesToRender)}.png`);
  savedCount++;
  if (savedCount > 200) {
    noLoop();
  }
}

function reset() {
  gridDetail = 200;
  // palette = Palette.limitedPalette(3);
  paletteA = Palette.normalPalette()
  paletteB = Palette.normalPalette()
  // paletteMask = Palette.normalPalette();
  paletteMask = Palette.bw();

  perlin.seed(Math.random());
  // if (Math.random() < 0.5) {
  graphicsA.background(paletteA.background());
  graphicsB.background(paletteB.background());
  graphicsMask.background(paletteMask.background());


  graphicsA.noStroke();
  graphicsB.noStroke();
  graphicsMask.noStroke();


  // clear();
  // }
  margin = -0.2;
  if (Math.random() < 0.2) {
    margin = Math.random() / 5;
  }
  const options = {
    type: "square",
    dimensions: {
      detail: gridDetail,
      range: [width * margin, width - width * margin, height * margin, height - height * margin]
    }
  }

  flowfieldA = new Flowfield(createGrid(options));
  flowfieldA.initialize();

  flowfieldB = new Flowfield(createGrid(options));
  flowfieldB.initialize();

  flowfieldMask = new Flowfield(createGrid(options));
  flowfieldMask.initialize();

  const normalLifespan = () => Math.random() * 250;
  const walkerCount = () => 3000; // Math.exp(Math.random() * walkerCountExponent + 2);

  walkersA = new Group(flowfieldA, paletteA, normalLifespan());
  walkersB = new Group(flowfieldB, paletteB, normalLifespan());
  walkersMask = new Group(flowfieldMask, paletteMask, normalLifespan());

  walkersA.spawn(walkerCount());
  walkersB.spawn(walkerCount());
  walkersMask.spawn(walkerCount());



  // framesToRender = Math.random() * 600;
  // startFrame = frameCount;
}

function draw() {
  clear();
  reset();
  flowfieldA.mutate();
  // flowfieldB.mutate();
  // flowfieldMask.mutate();

  walkersA.fastForward();
  // walkersB.fastForward();
  // walkersMask.fastForward();

  walkersA.draw(graphicsA);
  // walkersB.draw(graphicsB);
  // walkersMask.draw(graphicsMask);

  // if (frameCount - startFrame > framesToRender) {
  //   saveFrame();
  //   reset();
  // }
  // if (livingWalkers() < 1) {
  // }

  if (keyIsPressed === true) {
    switch (key) {
      case '1':
        drawGraphics(graphicsA);
        break;
      case '2':
        drawGraphics(graphicsB);
        break;
      case '3':
        drawGraphics(graphicsMask);
        break;
      default:
        fullDraw();
    }
  } else {
    drawGraphics(graphicsA);
    // fullDraw();
  }
  if (savingFrames === true) {
    saveFrame();
  }

}

function fullDraw() {
  // flowfield.draw();
  graphicsA.loadPixels();
  graphicsB.loadPixels();
  graphicsMask.loadPixels();
  loadPixels();
  const d = pixelDensity();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) {
          // loop over
          index = 4 * ((y * d + j) * width * d + (x * d + i));

          const a = graphicsMask.pixels[index] / 255;
          const b = 1 - a;

          pixels[index] = graphicsA.pixels[index] * a + graphicsB.pixels[index] * b;
          pixels[index + 1] = graphicsA.pixels[index + 1] * a + graphicsB.pixels[index + 1] * b;
          pixels[index + 2] = graphicsA.pixels[index + 2] * a + graphicsB.pixels[index + 2] * b;
          pixels[index + 3] = graphicsA.pixels[index + 3] * a + graphicsB.pixels[index + 3] * b;
        }
      }
    }
  }
  updatePixels();
}

function drawGraphics(graphics) {
  clear();
  image(graphics, 0, 0);
}
