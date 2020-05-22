
function gcd(a, b) {
  return b ? gcd(b, a % b) : a;
}

class Palette {
  constructor(colors) {
    colorMode(HSB, 1);
    this.lastColorPicked = -1;
    // this.type = 'saturationGradient';
    // const modes = [Palette.hueGradient, Palette.saturationGradient, Palette.brightnessGradient, Palette.colorGradient];
    // this.mode = modes[Math.floor(Math.random() * modes.length)];
    // console.log(mode);
    if (colors) {
      this.colors = colors;
    } else {
      let colorValues = Palette.randomGradient();
      this.colors = [];
      colorValues.forEach((c) => {
        this.colors.push(color(c[0], c[1], c[2]));
      });
      this.skip = Math.ceil(Math.random() * 20) % this.colors.length;
    }
    if (this.skip < 1) {
      this.skip++;
    }
    if (gcd(this.skip, this.colors.length) > 1) {
      this.skip = 1;
    }

  }
  color() {
    if (this.colors.length == 0) {
      return color(0);
    }
    return this.colors[Math.floor(this.colors.length * Math.random())];
  }
  static randomGradient() {
    let count = 2; //1+ Math.floor(Math.random() * 100);
    for (var i = 3; i < 8; i++) {
      if (Math.random() < Math.pow(2, -i) * 4) {
        count = Math.pow(2, i);
      }
    }
    let hSpan = Math.random() * 2 - 1;
    let sSpan = Math.random() * 2 - 1;
    let bSpan = Math.random() * 2 - 1;
    //normalize the spans so that there is a good ammount of variety
    let sum = Math.abs(hSpan) + Math.abs(sSpan) + Math.abs(bSpan);
    hSpan /= sum;
    sSpan /= sum;
    bSpan /= sum;
    if (hSpan < 0.25) {
      sSpan = map(sSpan, 0, 1, 0.5, 1);
      bSpan = map(bSpan, 0, 1, 0.5, 1);
    } else
    if (sSpan < 0.25) {
      hSpan = map(hSpan, 0, 1, 0.5, 1);
      bSpan = map(bSpan, 0, 1, 0.5, 1);
    } else
    if (bSpan < 0.25) {
      sSpan = map(sSpan, 0, 1, 0.5, 1);
      hSpan = map(hSpan, 0, 1, 0.5, 1);
    }

    const hStart = Math.max(-hSpan, Math.random());
    const hueRange = [hStart, hStart + hSpan];

    let sStart = sSpan > 0 ? Math.random() * (1 - sSpan) : 1 - Math.random() * (1 + sSpan);
    if (Math.abs(sSpan) < 0.75) {
      sStart += 0.75;
    }
    if (sSpan > 0) {
      sStart = Math.min(sStart, 1 - sSpan);
    } else {
      sStart = Math.max(sStart, -sSpan);
    }
    const saturationRange = [sStart, sStart + sSpan];

    let bStart = bSpan > 0 ? Math.random() * (1 - bSpan) : 1 - Math.random() * (1 + bSpan);
    if (Math.abs(bSpan) < 0.75) {
      bStart += 0.75;
    }
    if (bSpan > 0) {
      bStart = Math.min(bStart, 1 - bSpan);
    } else {
      bStart = Math.max(bStart, -bSpan);
    }
    const brightnessRange = [bStart, bStart + bSpan];

    return Palette.colorGradient(count, hueRange, saturationRange, brightnessRange);
  }
  static hueGradient(count, span, start) {
    const _span = span || Math.random();
    const _start = start || Math.random() * (1 - _span);
    const hueRange = [_start, _start + _span];
    const saturationRange = randomBetween(0.2, 1);
    const brightnessRange = randomBetween(0.75, 1);

    const colors = Palette.colorGradient(count, hueRange, saturationRange, brightnessRange);
    return colors;
  }
  static saturationGradient() {
    const _span = span || Math.random();
    const _start = start || Math.random() * (1 - _span);
    const hueRange = randomBetween(0, 1);
    const saturationRange = [_start, _start + _span];
    const brightnessRange = randomBetween(0.75, 1);

    const colors = Palette.colorGradient(count, hueRange, saturationRange, brightnessRange);
    return colors;
  }
  static brightnessGradient() {
    const _span = span || Math.random();
    const _start = start || Math.random() * (1 - _span);
    const hueRange = randomBetween(0, 1);
    const saturationRange = randomBetween(0.2, 1);
    const brightnessRange = [_start, _start + _span];

    const colors = Palette.colorGradient(count, hueRange, saturationRange, brightnessRange);
    return colors;
  }
  static colorGradient(count, hueRange, saturationRange, brightnessRange) {
    let colors = [];
    const _count = count || 1 + Math.floor(Math.random() * 100);
    let h = Palette.gradient(_count, hueRange);
    let s = Palette.gradient(_count, saturationRange);
    let b = Palette.gradient(_count, brightnessRange);
    for (var i = 0; i < _count; i++) {
      colors.push([(h[i] + 1) % 1, s[i], b[i]]);
    }
    return colors;
  }
  static gradient(count, range) {
    const nums = [];
    const _count = count || 1 + Math.floor(Math.random() * 100);
    const _range = range || [0, 1];
    if (!isNaN(range)) {
      return [range];
    }
    if (count == 1) {
      return [_range[0]];
    }
    const reverse = _range[0] > _range[1];
    const [start, end] = reverse ? [_range[1], _range[0]] : [_range[0], _range[1]];
    let increment = (end - start) / _count;
    for (var i = start; i < end; i += increment) {
      nums.push(Math.min(end, Math.max(start, i)));
    }
    if (reverse) {
      nums.reverse();
    }
    return nums;
  }
  static twoColorPalette() {
    colorMode(HSB, 1);
    let p = new Palette();
    let h1 = Math.random();
    let s1 = Math.random();
    let b1 = Math.random();
    // let h2 = Math.random();
    let s2 = Math.random();
    let b2 = Math.random();
    p.colors = [color(h1, s1, b1), color((h1 + 0.61) % 1, s2, b2)];
    p.skip = 1;
    return p;
  }
  static limitedPalette(count) {
    colorMode(HSB, 1);
    let colors = [];
    let h = Math.random();
    let s = randomBetween(0.5, 1);
    let b = randomBetween(0.5, 1);
    let n = !isNaN(count) ? count : randomBetween(3, 16);
    for (var i = 0; i < n; i++) {
      h += 0.61;
      h %= 1;
      s += 0.61;
      s %= 1;
      b += 0.61;
      b %= 1;
      colors.push(color(h, s, b));
    }
    // colors = [color(h1, s1, b1), color((h1 + 0.61) % 1, s2, b2)];
    let p = new Palette(colors);
    return p;
  }
  static bw() {
    colorMode(HSB, 1);
    return new Palette([color(0), color(1)]);
  }
  static monochrome(hue) {
    let colors = [];
    let h = !isNaN(hue) ? hue : Math.random();
    let s = 1;
    let n = randomBetween(2, 64);
    let min = randomBetween(0, 0.5);
    let max = randomBetween(0.5, 1);
    if (max - min < 0.5) {
      min = min * min;
      max = 1 - ((1 - max) * (1 - max));
    }

    for (var i = 0; i < n; i++) {
      let b = map(i, 0, n, min, max);
      colors.push(color(h, s, b));
    }
    if (Math.random() < 0.5) {
      colors.reverse();
    }
    return new Palette(colors);
  }
  static normalPalette() {
    return new Palette();
  }
  static createPalette() {
    let paletteTypes = [{
      value: Palette.normalPalette,
      weight: 1
    }, {
      value: Palette.monochrome,
      weight: 0.2
    }, {
      value: Palette.bw,
      weight: 0.2
    }, {
      value: Palette.limitedPalette,
      weight: 0.2
    }, {
      value: Palette.twoColorPalette,
      weight: 0.2
    }];
    let n = Math.floor(paletteTypes.length * Math.random());
    let generator = pickWeighted(paletteTypes);
    return generator();
  }
  nextColor(exclude) {
    this.lastColorPicked += this.skip;
    this.lastColorPicked %= this.colors.length;
    let availableColors = exclude ? this.colors.filter(c => c !== exclude) : this.colors;
    let c = availableColors[this.lastColorPicked % availableColors.length];
    return c;
  }
  background() {
    colorMode(HSB, 1);
    let c = this.colors[0];
    let h = hue(c);
    let s = saturation(c); // / 4; //0.5 + saturation(c)) % 1;
    let b = brightness(c); // < 0.5 ? 0.1: 0.9;//(0.5 + ) % 1;
    return color(h, s, b);
  }
  colorBlend(k) {
    if (this.colors.length == 0) {
      return color(0);
    }
    if (this.colors.length < 2) {
      return this.colors[0];
    }
    const i = k * (this.colors.length - 1);
    const index = Math.floor(i);
    const lerpIndex = i - index;
    if (lerpIndex < 0.001 || this.colors.length === index) {
      return this.colors[index];
    }
    const colorLower = this.colors[index];
    const colorHigher = this.colors[index + 1];
    const color = lerpColor(colorLower, colorHigher, lerpIndex);
    return color;
  }
}
