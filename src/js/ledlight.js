/*
 * @author Charles Xie
 */

'use strict';

class LedLight {

  properties() {
    this.pressed = false;
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

  init() {
    if (canvas == null || canvas == undefined) return;
    canvas.addEventListener('click', onMouseClick, false);
    canvas.addEventListener('dblclick', onMouseDoubleClick, false);
    canvas.addEventListener('mousemove', onMouseMove, false);
    canvas.addEventListener('mouseleave', onMouseLeave, false);
    canvas.addEventListener('touchmove', onTouchMove, false);
  }

  draw() {

    ctx = canvas.getContext('2d');

  }

  isPressed(xPressed, yPressed) {
    this.pressed = xPressed > this.x && xPressed < this.x + this.width && yPressed > this.y && yPressed < this.y + this.height;
    console.log(this.pressed + ": " + xPressed + ", " + yPressed + ", " + this.x + "," + this.y);
    return this.pressed;
  }

  onMouseMove(event) {
    event.preventDefault();
    that.draw();
  }

  onMouseLeave(event) {
    event.preventDefault();
    that.draw();
  }

  onTouchMove(event) {
    event.preventDefault();
  }

  onMouseClick(event) {
    event.preventDefault();
  }

  onMouseDoubleClick(event) {
    event.preventDefault();
  }

}
