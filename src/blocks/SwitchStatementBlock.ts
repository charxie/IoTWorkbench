/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {FunctionBlock} from "./FunctionBlock";
import {flowchart, math} from "../Main";
import {Util} from "../Util";

export class SwitchStatementBlock extends Block {

  private cases: any[];
  private readonly portI: Port;
  private portO: Port[];

  static State = class {
    readonly uid: string;
    readonly cases;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: SwitchStatementBlock) {
      this.uid = block.uid;
      this.cases = block.cases;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
    }
  };

  constructor(uid: string, name: string, symbol: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.cases = [1, 2, 3];
    this.symbol = symbol;
    this.color = "#EE82EE";
    this.portI = new Port(this, true, "I", 0, this.height / 2, false);
    this.ports.push(this.portI);
    this.setOutputPorts();
    this.margin = 15;
  }

  private setOutputPorts(): void {
    if (this.portO == undefined || this.portO.length != this.cases.length) {
      if (this.portO) {
        for (let p of this.portO) { // disconnect all the port connectors as the ports will be recreated
          flowchart.removeAllConnectors(p);
        }
        for (let p of this.portO) {
          this.ports.pop();
        }
      }
      this.portO = new Array(this.cases.length);
      let dh = this.height / (this.cases.length + 1);
      let nm = "A";
      for (let i = 0; i < this.cases.length; i++) {
        this.portO[i] = new Port(this, false, String.fromCharCode(nm.charCodeAt(0) + i), this.width, (i + 1) * dh, true);
        this.ports.push(this.portO[i]);
      }
    }
  }

  getCopy(): Block {
    let block = new SwitchStatementBlock("Switch Statement Block #" + Date.now().toString(16), this.name, this.symbol, this.x, this.y, this.width, this.height);
    block.cases = JSON.parse(JSON.stringify(this.cases));
    return block;
  }

  destroy(): void {
  }

  setCases(cases: any[]): void {
    this.cases = JSON.parse(JSON.stringify(cases));
    this.setOutputPorts();
    this.refreshView();
  }

  getCases(): any[] {
    return JSON.parse(JSON.stringify(this.cases));
  }

  refreshView(): void {
    super.refreshView();
    this.portI.setY(this.height / 2);
    let dh = this.height / (this.cases.length + 1);
    for (let i = 0; i < this.cases.length; i++) {
      this.portO[i].setX(this.width);
      this.portO[i].setY((i + 1) * dh);
    }
  }

  updateModel(): void {
    let i = -1;
    let x = this.portI.getValue();
    if (x != undefined) {
      for (let j = 0; j < this.cases.length; j++) {
        if (x == this.cases[j]) {
          i = j;
          break;
        }
      }
    }
    for (let p of this.portO) {
      p.setValue(undefined);
    }
    if (i != -1) {
      this.portO[i].setValue(true);
    }
    this.updateConnectors();
  }

  draw(ctx: CanvasRenderingContext2D): void {

    switch (flowchart.blockView.getBlockStyle()) {
      case "Shade":
        let shade = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        shade.addColorStop(0, "white");
        shade.addColorStop(this.iconic ? 0.1 : 0.05, Util.adjust(this.color, 50));
        shade.addColorStop(1, this.color);
        ctx.fillStyle = shade;
        break;
      case "Plain":
        ctx.fillStyle = this.color;
        break;
    }
    ctx.fillRoundedRect(this.x, this.y, this.width, this.height, this.radius);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawRoundedRect(this.x, this.y, this.width, this.height, this.radius);

    if (this.hasError) {
      ctx.save();
      let offset = 10;
      ctx.shadowColor = "yellow";
      ctx.shadowBlur = offset / 2;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.lineWidth = 2;
      ctx.strokeStyle = this.errorColor;
      ctx.setLineDash([5, 3]);
      ctx.drawRoundedRect(this.x - offset, this.y - offset, this.width + 2 * offset, this.height + 2 * offset, this.radius);
      ctx.restore();
    }

    // draw the inset
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.rect(this.x + this.margin, this.y + this.margin, this.width - 2 * this.margin, this.height - 2 * this.margin);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

    // draw the cases
    ctx.font = this.iconic ? "10px Times" : "12px Times";
    for (let i = 0; i < this.cases.length; i++) {
      this.drawTextAt(this.cases[i], 0, this.portO[i].getY() - this.height / 2, ctx);
    }

    // draw the ports
    ctx.font = "bold 12px Times";
    ctx.strokeStyle = "black";
    for (let p of this.ports) {
      p.draw(ctx, this.iconic);
    }

    if (this.selected) {
      this.highlightSelection(ctx);
    }

  }

}
