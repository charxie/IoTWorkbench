/*
 * @author Charles Xie
 */

'use strict';

class Board {

  properties() {
  }

  constructor(imageId, x, y, width, height) {
    this.properties();
    this.imageId = imageId;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    let image = document.getElementById(this.imageId); // preload image
    ctx.drawImage(image, this.x, this.y);
  }

  isPressed(xClick, yClick) {
    let pressed = xClick > this.x && xClick < this.x + this.width && yClick > this.y && yClick < this.y + this.height;
    return this.pressed;
  }

}
