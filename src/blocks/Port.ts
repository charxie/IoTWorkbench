/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Arc} from "../math/Arc";
import {Point} from "../math/Point";
import {BinaryFunctionBlock} from "./BinaryFunctionBlock";
import {flowchart} from "../Main";
import {GlobalVariableBlock} from "./GlobalVariableBlock";

export class Port {

  private readonly block: Block;
  private value: any;
  private readonly input: boolean; // a port must be either input or output. If this is false, then this is a port for output.
  private multiInput: boolean = false; // most ports allow only one input, but an input port of a global variable block allows multiple inputs
  private close: boolean; // when a connector end is close to this port
  private readonly uid: string;
  private arc: Arc;

  constructor(block: Block, input: boolean, uid: string, x: number, y: number, anticlockwise: boolean) {
    this.block = block;
    this.input = input;
    this.uid = uid;
    this.arc = new Arc(x, y, 5, 0.5 * Math.PI, 1.5 * Math.PI, anticlockwise);
  }

  setValue(value: any): void {
    this.value = value;
  }

  getValue(): any {
    return this.value;
  }

  setX(x: number): void {
    this.arc.x = x;
  }

  getX(): number {
    return this.arc.x;
  }

  setY(y: number): void {
    this.arc.y = y;
  }

  getY(): number {
    return this.arc.y;
  }

  getBlock(): Block {
    return this.block;
  }

  getUid(): string {
    return this.uid;
  }

  isInput(): boolean {
    return this.input;
  }

  isClose(): boolean {
    return this.close;
  }

  setMultiInput(multiInput: boolean): void {
    this.multiInput = multiInput;
  }

  hasMultiInput(): boolean {
    return this.multiInput;
  }

  setClose(close: boolean): void {
    this.close = close;
  }

  getRelativePoint(): Point {
    return new Point(this.arc.x + (this.arc.anticlockwise ? this.arc.radius : -this.arc.radius), this.arc.y);
  }

  getAbsolutePoint(): Point {
    let p = this.getRelativePoint();
    p.translate(this.block.getX(), this.block.getY());
    return p;
  }

  contains(x: number, y: number): boolean {
    return this.arc.contains(x, y);
  }

  near(x: number, y: number): boolean {
    return this.arc.near(x, y);
  }

  draw(ctx: CanvasRenderingContext2D, iconic: boolean): void {
    ctx.save();
    let ax = this.arc.x + this.block.getX();
    let ay = this.arc.y + this.block.getY();
    ctx.lineWidth = iconic ? 1 : 2;
    this.arc.radius = iconic ? 2 : 5;
    let allow = true;
    let selectedPort = flowchart.blockView.getSelectedPort();
    if (selectedPort != null) {
      if (selectedPort.getBlock() === this.getBlock()) { // no connector between ports of the same block
        allow = false;
      }
    }
    // check other conditions
    if (allow) {
      if (this.hasMultiInput()) {
        if (selectedPort != null) {
          if (flowchart.getConnectorBetweenPorts(this, selectedPort) != null) {
            allow = false;
          }
        }
      } else {
        if (flowchart.getConnectorWithInput(this) != null) {
          allow = false;
        }
      }
    }
    if (this.close && this.input && allow) {
      let shade = ctx.createRadialGradient(ax, ay, this.arc.radius, ax, ay, 3 * this.arc.radius);
      shade.addColorStop(1, "gold");
      shade.addColorStop(0.25, "yellow");
      shade.addColorStop(0, "white");
      ctx.fillStyle = shade;
      ctx.beginPath();
      ctx.arc(ax, ay, 3 * this.arc.radius, this.arc.startAngle, this.arc.endAngle, this.arc.anticlockwise);
      ctx.fill();
    }
    ctx.fillStyle = this.value == undefined ? ("darkgray") : (this.input ? "white" : "lightgreen");
    ctx.beginPath();
    ctx.arc(ax, ay, this.arc.radius, this.arc.startAngle, this.arc.endAngle, this.arc.anticlockwise);
    ctx.fill();
    ctx.stroke();
    if (!iconic && this.block.getPorts().length > 2) {
      ctx.lineWidth = 0.75;
      ctx.fillStyle = "black";
      let t = this.block.getPortName(this.uid);
      if (this.arc.anticlockwise) {
        ctx.fillText(t, ax - ctx.measureText(t).width - (iconic ? 2 : 4), ay + 4);
      } else {
        ctx.fillText(t, ax + (iconic ? 2 : 4), ay + 4)
      }
      ctx.restore();
    }
  }

  public toString(): string {
    return this.block.toString() + " @" + this.uid;
  }

}
