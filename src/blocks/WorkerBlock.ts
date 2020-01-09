/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Block} from "./Block";
import {flowchart} from "../Main";
import {Util} from "../Util";

export class WorkerBlock extends Block {

  private count: number = 0;
  private interval: number = 500; // in milliseconds
  private barHeight: number;
  private readonly portI: Port;
  private readonly portO: Port;
  private worker: Worker;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly interval: number;

    constructor(worker: WorkerBlock) {
      this.name = worker.name;
      this.uid = worker.uid;
      this.x = worker.x;
      this.y = worker.y;
      this.width = worker.width;
      this.height = worker.height;
      this.interval = worker.interval;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#00CED1";
    this.portI = new Port(this, true, "I", 0, this.height / 2, false);
    this.portO = new Port(this, false, "O", this.width, this.height / 2, true);
    this.ports.push(this.portI);
    this.ports.push(this.portO);
  }

  getCopy(): Block {
    let copy = new WorkerBlock("Worker Block #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.interval = this.interval;
    return copy;
  }

  setInterval(interval: number): void {
    this.interval = interval;
  }

  getInterval(): number {
    return this.interval;
  }

  draw(ctx: CanvasRenderingContext2D): void {

    // draw the upper bar with shade
    this.barHeight = Math.min(30, this.height / 3);
    let shade = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.barHeight);
    shade.addColorStop(0, "white");
    shade.addColorStop(this.iconic ? 0.2 : 0.1, Util.adjust(this.color, -20));
    shade.addColorStop(1, Util.adjust(this.color, -100));
    ctx.fillStyle = shade;
    ctx.fillHalfRoundedRect(this.x, this.y, this.width, this.barHeight, this.radius, "Top");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y, this.width, this.barHeight, this.radius, "Top");
    if (!this.iconic) {
      ctx.lineWidth = 0.75;
      ctx.font = "14px Arial";
      ctx.fillStyle = "black";
      let titleWidth = ctx.measureText(this.name).width;
      ctx.fillText(this.name, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
    }

    // draw the lower area
    ctx.fillStyle = "#FFFFFF";
    ctx.fillHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    let counter = this.count.toString();
    ctx.font = "bold 20px Courier New";
    ctx.beginPath();
    let m = this.iconic ? 4 : 8;
    let x = this.x + m;
    let y = this.y + this.barHeight + m;
    ctx.rect(x, y, this.width - 2 * m, this.height - this.barHeight - 2 * m);
    shade = ctx.createLinearGradient(x, y, x, y + this.height);
    shade.addColorStop(0, "lightgray");
    shade.addColorStop(0.5, "black");
    shade.addColorStop(1, "gray");
    ctx.fillStyle = shade;
    ctx.fill();
    ctx.strokeStyle="black";
    ctx.stroke();
    if (!this.iconic) {
      ctx.fillStyle = "white";
      let counterWidth = ctx.measureText(counter).width;
      let counterHeight = ctx.measureText("M").width;
      x = this.x + this.width - m - counterWidth - 2;
      y = this.y + this.barHeight + (this.height - this.barHeight + counterHeight) / 2;
      ctx.fillText(counter, x, y);
    }

    // draw the ports
    ctx.strokeStyle = "black";
    this.portI.draw(ctx, this.iconic);
    this.portO.draw(ctx, this.iconic);

  }

  updateModel(): void {
    let input = this.portI.getValue();
    if (input == true) {
      this.startWorker();
    } else {
      this.stopWorker();
    }
    this.portO.setValue(this.count);
    this.updateConnectors();
  }

  private startWorker(): void {
    if (this.worker == undefined && !this.iconic) {
      this.worker = new Worker("./Counter.ts");
    } else {
      this.worker.postMessage({cmd: "Start", interval: this.interval});
    }
    let that = this;
    this.worker.onmessage = function (event) {
      that.count = event.data;
      flowchart.updateResults();
      flowchart.draw();
    };
  }

  private stopWorker(): void {
    if (this.worker != undefined) {
      this.worker.postMessage({cmd: "Pause"});
    }
  }

  destroy(): void {
    if (this.worker != undefined) {
      this.worker.terminate();
    }
  }

  refreshView(): void {
    this.portI.setY(this.height / 2);
    this.portO.setX(this.width);
    this.portO.setY(this.height / 2);
  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  mouseDown(e: MouseEvent): boolean {
    return false;
  }

  mouseUp(e: MouseEvent): void {
    flowchart.blockView.canvas.style.cursor = "default";
  }

  mouseMove(e: MouseEvent): void {
  }

  mouseLeave(e: MouseEvent): void {
    flowchart.blockView.canvas.style.cursor = "default";
  }

}
