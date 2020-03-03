/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {flowchart} from "../Main";

export class IntegralBlock extends Block {

  private readonly portI: Port;
  private readonly portX: Port;
  private readonly portD: Port;
  private readonly portO: Port;
  private x0: number;
  private dx: number;
  private fx: number[];
  private result: number;
  private barHeight: number;
  private fractionDigits: number = 3;
  private method: string = "Trapezoidal Rule";
  private readonly windowMargin = {
    left: <number>4,
    right: <number>3,
    top: <number>4,
    bottom: <number>4
  };

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly fractionDigits: number;
    readonly method: string;

    constructor(block: IntegralBlock) {
      this.name = block.name;
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.fractionDigits = block.fractionDigits;
      this.method = block.method;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = "Integral Block";
    this.color = "#3FF";
    this.symbol = "∫";
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 4;
    this.portI = new Port(this, true, "I", 0, this.barHeight + dh, false);
    this.portX = new Port(this, true, "X", 0, this.barHeight + 2 * dh, false);
    this.portD = new Port(this, true, "D", 0, this.barHeight + 3 * dh, false);
    this.portO = new Port(this, false, "O", this.width, (this.height + this.barHeight) / 2, true);
    this.ports.push(this.portI);
    this.ports.push(this.portX);
    this.ports.push(this.portD);
    this.ports.push(this.portO);
  }

  getCopy(): Block {
    let copy = new IntegralBlock("Integral Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    copy.name = this.name;
    copy.fractionDigits = this.fractionDigits;
    copy.method = this.method;
    return copy;
  }

  setMethod(method: string): void {
    this.method = method;
  }

  getMethod(): string {
    return this.method;
  }

  getFractionDigits(): number {
    return this.fractionDigits;
  }

  setFractionDigits(fractionDigits: number): void {
    this.fractionDigits = fractionDigits;
  }

  destroy(): void {
  }

  draw(ctx: CanvasRenderingContext2D): void {
    switch (flowchart.blockView.getBlockStyle()) {
      case "Shade":
        let shade = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.barHeight);
        shade.addColorStop(0, "white");
        shade.addColorStop(this.iconic ? 0.2 : 0.1, Util.adjust(this.color, -20));
        shade.addColorStop(1, Util.adjust(this.color, -100));
        ctx.fillStyle = shade;
        break;
      case "Plain":
        ctx.fillStyle = this.color;
        break;
    }
    ctx.fillHalfRoundedRect(this.x, this.y, this.width, this.barHeight, this.radius, "Top");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y, this.width, this.barHeight, this.radius, "Top");
    if (!this.iconic) {
      ctx.lineWidth = 0.75;
      ctx.font = "14px Arial";
      ctx.fillStyle = "white";
      let titleWidth = ctx.measureText(this.name).width;
      ctx.fillText(this.name, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
    }

    // draw the lower area
    ctx.fillStyle = "#EEFFEE";
    ctx.fillHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");

    let x = this.x + this.windowMargin.left;
    let y = this.y + this.barHeight + this.windowMargin.top;
    let w = this.width - this.windowMargin.left - this.windowMargin.right;
    let h = this.height - this.barHeight - this.windowMargin.top - this.windowMargin.bottom;
    ctx.drawRoundedRect(x, y, w, h, this.iconic ? 2 : 8);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

    let display = this.iconic ? this.symbol : this.result === undefined ? "" : this.result.toPrecision(this.fractionDigits);
    ctx.fillStyle = "black";
    let textWidth = ctx.measureText(display).width;
    let textHeight = ctx.measureText("M").width;
    x = this.x + (this.width - textWidth) / 2;
    y = this.y + this.barHeight + (this.height - this.barHeight + textHeight) / 2;
    ctx.fillText(display, x, y);

    // draw the port
    ctx.font = this.iconic ? "9px Arial" : "12px Arial";
    ctx.strokeStyle = "black";
    for (let p of this.ports) {
      p.draw(ctx, this.iconic);
    }

    if (this.selected) {
      this.highlightSelection(ctx);
    }

  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    let x0 = this.portX.getValue();
    let dx = this.portD.getValue();
    let fx = this.portI.getValue();
    if (x0 != undefined && dx != undefined && fx != undefined && Array.isArray(fx)) {
      this.x0 = x0;
      this.dx = dx;
      this.fx = fx;
      this.result = this.calculate(this.x0, this.dx, this.fx);
    } else {
      this.result = undefined;
    }
    this.portO.setValue(this.result);
    this.updateConnectors();
  }

  refreshView(): void {
    super.refreshView();
    this.windowMargin.top = 10;
    this.windowMargin.bottom = 10;
    this.windowMargin.left = 20;
    this.windowMargin.right = 20;
    let dh = (this.height - this.barHeight) / 4;
    this.portI.setY(this.barHeight + dh);
    this.portX.setY(this.barHeight + 2 * dh);
    this.portD.setY(this.barHeight + 3 * dh);
    this.portO.setX(this.width);
    dh = (this.height - this.barHeight) / 2;
    this.portO.setY(this.barHeight + dh);
  }

  calculate(x0: number, dx: number, fx: number[]): number {
    let r = 0;
    // trapezoidal rule
    for (let i = 1; i < fx.length - 1; i++) {
      r += fx[i];
    }
    r = dx * (r + 0.5 * (fx[0] + fx[fx.length - 1]));
    return r;
  }

}
