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

  inside(x, y) {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }

}
