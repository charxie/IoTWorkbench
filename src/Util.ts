/*
 * @author Charles Xie
 */

export class Util {

  static saveText(text: string, filename: string): void {
    let a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click();
  }

  static countDigits(x: number): number {
    return x.toString().length;
  }

  static adjust(color: string, amount: number): string {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }

  static hexToRgb(hex: string): any {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  static rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  static rgbToHue(r: number, g: number, b: number): number {
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let c = max - min;
    let hue;
    if (c == 0) {
      hue = 0;
    } else {
      switch (max) {
        case r:
          let segment = (g - b) / c;
          let shift = 0 / 60;       // R° / (360° / hex sides)
          if (segment < 0) {        // hue > 180, full rotation
            shift = 360 / 60;       // R° / (360° / hex sides)
          }
          hue = segment + shift;
          break;
        case g:
          segment = (b - r) / c;
          shift = 120 / 60;     // G° / (360° / hex sides)
          hue = segment + shift;
          break;
        case b:
          segment = (r - g) / c;
          shift = 240 / 60;     // B° / (360° / hex sides)
          hue = segment + shift;
          break;
      }
    }
    return hue * 60; // hue is in [0,6], scale it up
  }

  static rgbToHsl(r: number, g: number, b: number): any {
    let r1 = r / 255;
    let g1 = g / 255;
    let b1 = b / 255;
    let maxColor = Math.max(r1, g1, b1);
    let minColor = Math.min(r1, g1, b1);
    let lightness = (maxColor + minColor) / 2;
    let saturation = 0;
    let hue = 0;
    if (maxColor != minColor) {
      if (lightness < 0.5) {
        saturation = (maxColor - minColor) / (maxColor + minColor);
      } else {
        saturation = (maxColor - minColor) / (2 - maxColor - minColor);
      }
      if (r1 == maxColor) {
        hue = (g1 - b1) / (maxColor - minColor);
      } else if (g1 == maxColor) {
        hue = 2.0 + (b1 - r1) / (maxColor - minColor);
      } else {
        hue = 4.0 + (r1 - g1) / (maxColor - minColor);
      }
    }
    lightness = lightness * 100;
    saturation = saturation * 100;
    hue = hue * 60;
    if (hue < 0) {
      hue += 360;
    }
    return {h: hue, s: saturation, l: lightness};
  }

  /*
   * Converts an HSL color value to RGB. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes h, s, and l are contained in the set [0, 1] and
   * returns r, g, and b in the set [0, 255].
   *
   * @param   {number}  h       The hue
   * @param   {number}  s       The saturation
   * @param   {number}  l       The lightness
   * @return  {Array}           The RGB representation
   */
  static hslToRgb(h: number, s: number, l: number): any {
    let r, g, b;
    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      let hue2rgb = function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return {r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
  }

  static getHueColor(color: string): string {
    let c = Util.hexToRgb(color);
    c = Util.hslToRgb(Util.rgbToHue(c.r, c.g, c.b) / 360, 0.5, 0.5);
    return Util.rgbToHex(c.r, c.g, c.b);
  }

  // expects 0 <= h, s, v <= 1
  static hsvToRgb(h: number, s: number, v: number): any {
    let r, g, b;
    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        r = v, g = t, b = p;
        break;
      case 1:
        r = q, g = v, b = p;
        break;
      case 2:
        r = p, g = v, b = t;
        break;
      case 3:
        r = p, g = q, b = v;
        break;
      case 4:
        r = t, g = p, b = v;
        break;
      case 5:
        r = v, g = p, b = q;
        break;
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  // output 0 <= h, s, v <= 1
  static rgbToHsv(r: number, g: number, b: number): any {
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let d = max - min;
    let h;
    let s = (max === 0 ? 0 : d / max);
    let v = max / 255;
    switch (max) {
      case min:
        h = 0;
        break;
      case r:
        h = (g - b) + d * (g < b ? 6 : 0);
        h /= 6 * d;
        break;
      case g:
        h = (b - r) + d * 2;
        h /= 6 * d;
        break;
      case b:
        h = (r - g) + d * 4;
        h /= 6 * d;
        break;
    }
    return {h: h, s: s, v: v};
  }

}
