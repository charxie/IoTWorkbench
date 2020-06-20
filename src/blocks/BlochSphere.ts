/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Rectangle} from "../math/Rectangle";

export class BlochSphere extends Block {

  private sphereRadius: number;
  private portTheta: Port;
  private portPhi: Port;
  private theta: number = 0;
  private phi: number = 0;
  private viewWindowColor: string = "white";
  private viewWindow: Rectangle;
  private barHeight: number;
  private readonly viewMargin = {
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
    readonly viewWindowColor: string;
    readonly theta: number;
    readonly phi: number;

    constructor(b: BlochSphere) {
      this.name = b.name;
      this.uid = b.uid;
      this.x = b.x;
      this.y = b.y;
      this.width = b.width;
      this.height = b.height;
      this.viewWindowColor = b.viewWindowColor;
      this.theta = b.theta;
      this.phi = b.phi;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#ACFDCE";
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 3;
    this.portTheta = new Port(this, true, "θ", 0, this.barHeight + dh, false)
    this.portPhi = new Port(this, true, "ɸ", 0, this.barHeight + 2 * dh, false)
    this.ports.push(this.portTheta);
    this.ports.push(this.portPhi);
    this.viewWindow = new Rectangle(0, 0, 1, 1);
  }

  getCopy(): Block {
    let copy = new BlochSphere("Bloch Sphere #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.viewWindowColor = this.viewWindowColor;
    copy.setTheta(this.theta);
    copy.setPhi(this.phi);
    return copy;
  }

  destroy(): void {
  }

  reset(): void {
    super.reset();
    this.erase();
  }

  erase(): void {
  }

  setTheta(theta: number): void {
    this.theta = theta;
  }

  getTheta(): number {
    return this.theta;
  }

  setPhi(phi: number): void {
    this.phi = phi;
  }

  getPhi(): number {
    return this.phi;
  }

  setViewWindowColor(viewWindowColor: string): void {
    this.viewWindowColor = viewWindowColor;
  }

  getViewWindowColor(): string {
    return this.viewWindowColor;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.drawTitleBar(ctx, this.barHeight);
    // draw the space
    ctx.fillStyle = "#FDFFFD";
    ctx.beginPath();
    ctx.fillHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.drawHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.beginPath();
    this.viewWindow.x = this.x + this.viewMargin.left;
    this.viewWindow.y = this.y + this.barHeight + this.viewMargin.top;
    this.viewWindow.width = this.width - this.viewMargin.left - this.viewMargin.right;
    this.viewWindow.height = this.height - this.barHeight - this.viewMargin.top - this.viewMargin.bottom;
    ctx.rect(this.viewWindow.x, this.viewWindow.y, this.viewWindow.width, this.viewWindow.height);
    ctx.fillStyle = this.viewWindowColor;
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.save();
    ctx.translate(this.viewWindow.x + this.viewWindow.width / 2, this.viewWindow.y + this.viewWindow.height / 2);
    this.sphereRadius = Math.min(this.viewWindow.width, this.viewWindow.height) * 0.35;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(0, 0, this.sphereRadius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = this.iconic ? 0.5 : 3;
    ctx.stroke();
    if (this.iconic) {
      ctx.lineWidth = 0.5;
    } else {
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
    }
    ctx.beginPath();
    ctx.ellipse(0, 0, this.sphereRadius, this.sphereRadius / 4, 0, 0, 2 * Math.PI);
    ctx.stroke();
    if (!this.iconic) {
      ctx.lineWidth = 0.5;
      ctx.setLineDash([]);
      let a = this.sphereRadius * 1.2;
      // z-axis
      ctx.drawLine(0, 0, 0, -a);
      ctx.drawLine(0, -a, 5, 5 - a);
      ctx.drawLine(0, -a, -5, 5 - a);
      // x-axis
      ctx.drawLine(0, 0, a, 0);
      ctx.drawLine(a, 0, a - 5, 5);
      ctx.drawLine(a, 0, a - 5, -5);
      // y-axis
      a /= 3;
      ctx.drawLine(0, 0, -a, a);
      ctx.drawLine(-a, a, -a, a - 7);
      ctx.drawLine(-a, a, -a + 7, a);
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(0, -this.sphereRadius, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, this.sphereRadius, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "black";
      ctx.lineWidth = 3;
      this.drawVector(ctx, this.theta, this.phi);
    }
    ctx.restore();

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

  // theta = 0 corresponds to the north pole, theta = pi to the south pole
  private drawVector(ctx: CanvasRenderingContext2D, theta: number, phi: number): void {
    let x = this.sphereRadius * Math.sin(theta) * Math.cos(phi);
    let y = -this.sphereRadius * Math.cos(theta);
    let z = this.sphereRadius * Math.sin(theta) * Math.sin(phi);
    let x1 = x + z * 0.25;
    let y1 = y - z * 0.25;
    ctx.drawLine(0, 0, x1, y1);
    ctx.fillCircle(x1, y1, 5);
  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    let theta = this.portTheta.getValue();
    let phi = this.portPhi.getValue();
    if (theta !== undefined && phi !== undefined) {
      this.theta = theta;
      this.phi = phi;
    }
  }

  refreshView(): void {
    super.refreshView();
    this.viewMargin.top = 10;
    this.viewMargin.bottom = 10;
    this.viewMargin.left = 20;
    this.viewMargin.right = 10;
    let dh = (this.height - this.barHeight) / 3;
    this.portTheta.setY(this.barHeight + dh);
    this.portPhi.setY(this.barHeight + 2 * dh);
  }

}
