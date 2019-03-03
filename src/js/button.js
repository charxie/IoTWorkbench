/*
 * @author Charles Xie
 */

'use strict';

class Button {

  properties() {
    this.on = false;
    this.pressedColor = '#cccccc';
  }

  constructor(board, x, y, width, height) {
    this.properties();
    this.board = board;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    let x0 = board.x + this.x;
    let y0 = board.y + this.y;
    if (this.on) {
      ctx.fillStyle = this.pressedColor;
      ctx.fillRect(x0, y0, this.width, this.height);
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.rect(x0, y0, this.width, this.height);
    ctx.stroke();
  }

  inside(x, y) {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }

}
