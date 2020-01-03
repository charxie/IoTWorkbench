/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Movable} from "../Movable";
import {Util} from "../Util";
import {flowchart} from "../Main";

export abstract class Block implements Movable {

  protected ports: Port[] = [];
  protected source: boolean = false;
  protected uid: string;
  protected x: number;
  protected y: number;
  protected width: number;
  protected height: number;
  protected color: string = "#666666";
  protected name: string = "TBD";
  protected symbol: string;
  protected radius: number = 5;
  protected margin: number = 30; // margin for inset
  protected small: boolean; // true when used for small icons

  static State = class {
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: Block) {
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    this.uid = uid;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  abstract refreshView(): void;

  abstract updateModel(): void;

  isSource(): boolean {
    return this.source;
  }

  // scan all the connectors to find out those whose output port is from this block.
  // if found, update the input port with the current value from the output port.
  protected updateConnectors(): void {
    for (let c of flowchart.connectors) {
      if (this.ports.indexOf(c.getOutput()) != -1) {
        c.getInput().setValue(c.getOutput().getValue());
      }
    }
  }

  // get the blocks that this one outputs to through a port connector
  outputTo(): Block[] {
    let blocks: Block[] = [];
    for (let p of this.ports) {
      if (p.isInput()) continue;
      for (let c of flowchart.connectors) {
        if (c.getOutput() == p) {
          blocks.push(c.getInput().getBlock());
        }
      }
    }
    return blocks;
  }

  // get the blocks that input to this one through a port connector
  inputFrom(): Block[] {
    let blocks: Block[] = [];
    for (let p of this.ports) {
      if (!p.isInput()) continue;
      for (let c of flowchart.connectors) {
        if (c.getInput() == p) {
          blocks.push(c.getOutput().getBlock());
        }
      }
    }
    return blocks;
  }

  getPorts(): Port[] {
    return this.ports;
  }

  getPort(uid: string): Port {
    for (let p of this.ports) {
      if (p.getUid() == uid) {
        return p;
      }
    }
    return null;
  }

  getUid(): string {
    return this.uid;
  }

  setUid(uid: string): void {
    this.uid = uid;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  getSymbol(): string {
    return this.symbol;
  }

  setSymbol(symbol: string): void {
    this.symbol = symbol;
  }

  getX(): number {
    return this.x;
  }

  setX(x: number): void {
    this.x = x;
  }

  getY(): number {
    return this.y;
  }

  setY(y: number): void {
    this.y = y;
  }

  getWidth(): number {
    return this.width;
  }

  setWidth(width: number): void {
    this.width = width;
  }

  getHeight(): number {
    return this.height;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  setColor(color: string): void {
    this.color = color;
  }

  getColor(): string {
    return this.color;
  }

  setSmall(small: boolean): void {
    this.small = small;
  }

  setMargin(margin: number): void {
    this.margin = margin;
  }

  contains(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }

  onDraggableArea(x: number, y: number): boolean {
    return this.contains(x, y);
  }

  draw(ctx: CanvasRenderingContext2D): void {

    // draw the block with shade
    let shade = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    shade.addColorStop(0, "white");
    shade.addColorStop(this.small ? 0.1 : 0.05, Util.adjust(this.color, 50));
    shade.addColorStop(1, this.color);
    ctx.fillStyle = shade;
    ctx.fillRoundedRect(this.x, this.y, this.width, this.height, this.radius);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawRoundedRect(this.x, this.y, this.width, this.height, this.radius);

    // draw the inset
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.rect(this.x + this.margin, this.y + this.margin, this.width - 2 * this.margin, this.height - 2 * this.margin);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

    // draw the symbol or formula or name (if symbol or formula is not available)
    ctx.save();
    ctx.fillStyle = "gray";
    ctx.strokeStyle = "black";
    ctx.lineWidth = this.small ? 0.75 : 1;
    ctx.font = this.small ? "12px Arial" : "bold 16px Arial";
    let s = this.symbol ? this.symbol : this.name;
    let textWidth = ctx.measureText(s).width;
    if (textWidth < this.width - 2 * this.margin - 10) {
      ctx.translate(this.x + this.width / 2 - textWidth / 2, this.y + this.height / 2 + (this.small ? 5 : 7));
    } else {
      ctx.translate(this.x + this.width / 2 + 5, this.y + this.height / 2 + textWidth / 2);
      ctx.rotate(-Math.PI / 2);
    }
    ctx.fillText(s, 0, 0);
    ctx.restore();

    // draw the ports
    ctx.font = this.small ? "9px Arial" : "12px Arial";
    ctx.strokeStyle = "black";
    for (let p of this.ports) {
      p.draw(ctx, this.small);
    }

  }

  public toString(): string {
    return this.uid;
  }

  /* handle mouse events within the block */

  mouseDown(e: MouseEvent): boolean {
    return false;
  }

  mouseUp(e: MouseEvent): void {
  }

  mouseMove(e: MouseEvent): void {
  }

  mouseLeave(e: MouseEvent): void {
  }

}
