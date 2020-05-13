/*
 * @author Charles Xie
 */

import $ from "jquery";

export class Util {

  static drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, n: number, inset): void {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.moveTo(0, radius);
    for (let i = 0; i < n; i++) {
      ctx.rotate(Math.PI / n);
      ctx.lineTo(0, radius * inset);
      ctx.rotate(Math.PI / n);
      ctx.lineTo(0, radius);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  static copyStringToClipboard(s: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = s;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px'; // Move outside the screen to make it invisible
    document.body.appendChild(textArea);
    const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
  }

  static getParameterByName(name: string): string {
    let url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  static getSelectedText(): string {
    let text = "";
    if (typeof window.getSelection != "undefined") {
      let sel = window.getSelection();
      if (sel.rangeCount) {
        let container = document.createElement("div");
        for (let i = 0, len = sel.rangeCount; i < len; ++i) {
          container.appendChild(sel.getRangeAt(i).cloneContents());
        }
        text = container.innerHTML;
      }
    }
    return text;
  }

  static hookupColorInputs(textInput: HTMLInputElement, colorPicker: HTMLInputElement) {
    colorPicker.onchange = e => {
      textInput.value = colorPicker.value;
      textInput.dispatchEvent(new Event("change"));
    };
    textInput.onkeyup = e => {
      if (Util.isHexColor(textInput.value)) {
        colorPicker.value = textInput.value;
      }
    };
  }

  static containsInRect(x: number, y: number, rect: DOMRect): boolean {
    return x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height;
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
        "OK": () => d.dialog('close')
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
        "OK": () => d.dialog('close')
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
    return colors.length >= 3 ? '#' + (((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2]).toString(16).substr(1)) : false;
  }

  static isHexColor(s: string): boolean {
    return /^#[0-9A-F]{6}$/i.test(s);
  }

  static invertHexColor(hex: string): string {
    return (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase();
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

  static isDarkish(color): boolean {
    // Variables for red, green, blue values
    let r, g, b, hsp;
    if (typeof color === "string") {
      // Check the format of the color, HEX or RGB?
      if (color.match(/^rgb/)) {
        // If HEX --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        r = color[1];
        g = color[2];
        b = color[3];
      } else if (color.startsWith("#")) {
        // If RGB --> Convert it to HEX: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));
        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
      } else {
        color = this.nameToHexColor(color);
        color = "0x" + color.slice(1).replace(color.length < 5 && /./g, '$&$&');
        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
      }
      // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
      hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
      // Using the HSP value, determine whether the color is light or dark
      return hsp < 127.5;
    }
    if (typeof color === "number") {
      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
      hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
      return hsp < 127.5;
    }
    return false;
  }

}
