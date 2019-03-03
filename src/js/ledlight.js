/*
 * @author Charles Xie
 */

'use strict';

class LedLight {

  properties() {
    this.on = false;
  }

  constructor(canvas, name, x, y, width, height) {
    this.properties();
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.canvas = canvas;
  }

  draw() {
    let ctx = canvas.getContext('2d');
  }

  isPressed(xClick, yClick) {
    let pressed = xClick > this.x && xClick < this.x + this.width && yClick > this.y && yClick < this.y + this.height;
    console.log(pressed + ": " + xClick + ", " + yClick + ", " + this.x + "," + this.y);
    if (pressed) {
      this.on = !this.on;
    }
    return pressed;
  }

}
