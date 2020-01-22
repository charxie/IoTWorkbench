/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Block} from "./Block";
import {flowchart} from "../Main";
import {Util} from "../Util";

export class WorkerBlock extends Block {

  private outputType: string = "Natural Number";
  private value: number = 0;
  private interval: number = 500; // in milliseconds
  private repeatTimes: number = 1000000;
  private barHeight: number;
  private readonly portI: Port;
  private readonly portO: Port;
  private worker: Worker;
  private count: number;
  private completed: boolean = false;
  private paused: boolean = false;
  private connectedToGlobalVariable: boolean = false;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly outputType: string;
    readonly interval: number;
    readonly repeatTimes: number;

    constructor(worker: WorkerBlock) {
      this.name = worker.name;
      this.uid = worker.uid;
      this.x = worker.x;
      this.y = worker.y;
      this.width = worker.width;
      this.height = worker.height;
      this.outputType = worker.outputType;
      this.interval = worker.interval;
      this.repeatTimes = worker.repeatTimes;
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
    copy.outputType = this.outputType;
    copy.repeatTimes = this.repeatTimes;
    return copy;
  }

  setOutputType(output: string): void {
    this.outputType = output;
  }

  getOutputType(): string {
    return this.outputType;
  }

  setInterval(interval: number): void {
    this.interval = interval;
    if (this.worker != null) {
      this.worker.postMessage({interval: this.interval});
    }
  }

  getInterval(): number {
    return this.interval;
  }

  setRepeatTimes(repeatTimes: number): void {
    this.repeatTimes = repeatTimes;
    if (this.worker != null) {
      this.worker.postMessage({repeat: this.repeatTimes});
    }
  }

  getRepeatTimes(): number {
    return this.repeatTimes;
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
    let display;
    switch (this.outputType) {
      case "Random Number":
        display = this.value.toFixed(2);
        break;
      default:
        display = this.value.toString();
    }
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
    ctx.strokeStyle = "black";
    ctx.stroke();
    if (!this.iconic) {
      ctx.fillStyle = "white";
      let counterWidth = ctx.measureText(display).width;
      let counterHeight = ctx.measureText("M").width;
      x = this.x + this.width - m - counterWidth - 2;
      y = this.y + this.barHeight + (this.height - this.barHeight + counterHeight) / 2;
      ctx.fillText(display, x, y);
    }

    // draw the ports
    ctx.strokeStyle = "black";
    this.portI.draw(ctx, this.iconic);
    this.portO.draw(ctx, this.iconic);

    if (this.selected) {
      this.highlightSelection(ctx);
    }

  }

  updateModel(): void {
    let input = this.portI.getValue();
    if (input == true) {
      this.connectedToGlobalVariable = flowchart.isConnectedToGlobalVariable(this);
      this.startWorker();
    } else {
      this.stopWorker();
    }
    this.portO.setValue(this.value);
    this.updateConnectors();
  }

  private startWorker(): void {
    if (this.worker == undefined && !this.iconic) {
      this.worker = new Worker("./Counter.ts");
      this.worker.postMessage({interval: this.interval, repeat: this.repeatTimes});
    }
    if (this.completed) {
      this.worker.postMessage({count: 0});
    }
    this.worker.postMessage({cmd: "Start"});
    let that = this;
    this.worker.onmessage = function (event) {
      that.count = event.data;
      switch (that.outputType) {
        case "Natural Number":
          that.value = event.data;
          break;
        case "Random Number":
          that.value = Math.random();
          break;
      }
      // FIXME: potential deadlock
      if (that.connectedToGlobalVariable) {
        flowchart.updateResults();
      } else {
        flowchart.updateResultsForBlock(that);
      }
      flowchart.blockView.requestDraw();
    };
    this.paused = false;
    this.completed = this.count == this.repeatTimes;
  }

  private stopWorker(): void {
    if (this.worker != undefined) {
      this.worker.postMessage({cmd: "Pause"});
      this.paused = true;
    }
  }

  destroy(): void {
    if (this.worker != undefined) {
      this.worker.terminate();
    }
  }

  refreshView(): void {
    super.refreshView();
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
