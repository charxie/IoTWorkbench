/*
 * @author Charles Xie
 */

import $ from "jquery";

export class Util {

  static parseCSV(str: string): any[] {
    let arr = [];
    let quote = false;  // true means we're inside a quoted field
    // iterate over each character, keep track of current row and column (of the returned array)
    for (let row = 0, col = 0, c = 0; c < str.length; c++) {
      let cc = str[c], nc = str[c + 1];        // current character, next character
      arr[row] = arr[row] || [];             // create a new row if necessary
      arr[row][col] = arr[row][col] || '';   // create a new column (start with empty string) if necessary
      // If the current character is a quotation mark, and we're inside a
      // quoted field, and the next character is also a quotation mark,
      // add a quotation mark to the current column and skip the next character
      if (cc == '"' && quote && nc == '"') {
        arr[row][col] += cc;
        ++c;
        continue;
      }
      // If it's just one quotation mark, begin/end quoted field
      if (cc == '"') {
        quote = !quote;
        continue;
      }
      // If it's a comma and we're not in a quoted field, move on to the next column
      if (cc == ',' && !quote) {
        ++col;
        continue;
      }
      // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
      // and move on to the next row and move to column 0 of that new row
      if (cc == '\r' && nc == '\n' && !quote) {
        ++row;
        col = 0;
        ++c;
        continue;
      }
      // If it's a newline (LF or CR) and we're not in a quoted field,
      // move on to the next row and move to column 0 of that new row
      if (cc == '\n' && !quote) {
        ++row;
        col = 0;
        continue;
      }
      if (cc == '\r' && !quote) {
        ++row;
        col = 0;
        continue;
      }
      // Otherwise, append the current character to the current column
      arr[row][col] += cc;
    }
    return arr;
  }

  static hookupColorInputs(textInput: HTMLInputElement, colorPicker: HTMLInputElement) {
    colorPicker.onchange = e => {
      textInput.value = colorPicker.value;
    };
    textInput.onkeyup = e => {
      if (Util.isHexColor(textInput.value)) {
        colorPicker.value = textInput.value;
      }
    };
  }

  static setColorPicker(colorPicker: HTMLInputElement, color: string): void {
    if (Util.isHexColor(color)) {
      colorPicker.value = color;
    } else {
      let hex = Util.nameToHexColor(color);
      if (hex) colorPicker.value = hex;
    }
  }

  static getFileNameFromPath(path: string): string {
    return path.replace(/^.*[\\\/]/, '');
  }

  static deleteArrayElement(e: any, a: any[]): any[] {
    let index = a.indexOf(e);
    if (index >= 0) {
      a.splice(index, 1);
    }
    return a;
  }

  static isEmptyObject(o): boolean {
    return Object.keys(o).length === 0 && o.constructor === Object;
  }

  static clearObject(o): void {
    if (o !== undefined && o !== null) {
      for (let x in Object.getOwnPropertyNames(o)) delete o[x];
    }
  }

  static isArrowKey(e: KeyboardEvent): boolean {
    return e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight";
  }

  static getOS(): string {
    let userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }
    return os;
  }

  static showBlockError(message): void {
    let d = $("#error-dialog").html("<div style='font-size: 90%;'>" + message + ".<br>Please fix the highlighted blocks.</div>");
    d.dialog({
      resizable: false,
      modal: false,
      title: "Block Error",
      height: 300,
      width: 250,
      buttons: {
        "OK": function () {
          d.dialog('close');
        }
      }
    });
  }

  static showInputError(message): void {
    let d = $("#error-dialog").html("<div style='font-size: 90%;'>" + message + ".<br>Please fix the input.</div>");
    d.dialog({
      resizable: false,
      modal: true,
      title: "Input Error",
      height: 300,
      width: 250,
      buttons: {
        "OK": function () {
          d.dialog('close');
        }
      }
    });
  }

  static selectField(field: HTMLInputElement, start: number, end: number) {
    if (field.setSelectionRange) {
      field.setSelectionRange(start, end);
    } else if (field.selectionStart) {
      field.selectionStart = start;
      field.selectionEnd = end;
    }
    field.focus();
  }

  static saveText(text: string, fileName: string): void {
    let a = document.createElement('a') as HTMLAnchorElement
    a.href = 'data:text/plain;charset=utf-u,' + encodeURIComponent(text);
    a.download = fileName;
    a.click();
  }

  static countDigits(x: number): number {
    return x.toString().length;
  }

  static nameToHexColor(name: string): string | false {
    let a = document.createElement('div');
    a.style.color = name;
    let colors = window.getComputedStyle(document.body.appendChild(a)).color.match(/\d+/g).map(function (a) {
      return parseInt(a, 10);
    });
    document.body.removeChild(a);
    return (colors.length >= 3) ? '#' + (((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2]).toString(16).substr(1)) : false;
  }

  static isHexColor(s: string): boolean {
    return /^#[0-9A-F]{6}$/i.test(s);
  }

  static getHexColor(colorName: string): string | false {
    let a = document.createElement('div');
    a.style.color = colorName;
    var colors = window.getComputedStyle(document.body.appendChild(a)).color.match(/\d+/g).map(function (a) {
      return parseInt(a, 10);
    });
    document.body.removeChild(a);
    return colors.length >= 3 ? '#' + (((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2]).toString(16).substr(1)) : false;
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

  static rgbaToHex(r, g, b, a): string {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    a = Math.round(a * 255).toString(16);
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
    if (a.length == 1)
      a = "0" + a;
    return "#" + r + g + b + a;
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
