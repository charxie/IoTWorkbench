/*
 * @author Charles Xie
 */

'use strict';

class LedLight {

  properties() {
    this.on = false;
    this.radius = 4;
    this.rays = 8;
  }

  constructor(board, color, x, y, width, height) {
    this.properties();
    this.board = board;
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    if (this.on) {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.color;
      ctx.fillStyle = this.color;
      let centerX = board.x + this.x + this.width / 2;
      let centerY = board.y + this.y + this.height / 2;
      ctx.arc(centerX, centerY, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
      let x1, y1, x2, y2;
      let angle, cos, sin;
      let gap = 2;
      for (let i = 0; i < this.rays; i++) {
        angle = i * Math.PI * 2 / this.rays;
        cos = Math.cos(angle);
        sin = Math.sin(angle);
        x1 = centerX + this.radius * cos;
        y1 = centerY + this.radius * sin;
        x2 = centerX + (this.radius * 3 + gap) * cos;
        y2 = centerY + (this.radius * 3 + gap) * sin;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
      }
    } else {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = this.color;
      ctx.arc(board.x + this.x + this.width / 2, board.y + this.y + this.height / 2, this.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
  }

  inside(x, y) {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }

  toggle(x, y) {
    let inside = this.inside(x, y)
    if (inside) {
      this.on = !this.on;
    }
    return inside;
  }

}
