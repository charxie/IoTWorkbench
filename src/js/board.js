/*
 * @author Charles Xie
 */

'use strict';

class Board {

  properties() {
    this.imageUrl = 'img/rainbow-hat.png';
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

  draw() {

    let ctx = canvas.getContext("2d");
    let image = new Image();
    let that = this;
    image.src = this.imageUrl;
    image.onload = function () {
      ctx.drawImage(image, that.x, that.y);
    };

  }

  isPressed(xPressed, yPressed) {
    this.pressed = xPressed > this.x && xPressed < this.x + this.width && yPressed > this.y && yPressed < this.y + this.height;
    return this.pressed;
  }

}
