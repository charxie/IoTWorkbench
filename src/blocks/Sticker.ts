/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";

export class Sticker extends Block {

  private text: string;
  private userText: string;
  protected textColor: string = "black";
  private isArray: boolean;
  private decimals: number = 3;
  private barHeight: number;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly text: string;
    readonly userText: string;
    readonly decimals: number;
    readonly color: string;
    protected textColor: string;

    constructor(sticker: Sticker) {
      this.name = sticker.name;
      this.uid = sticker.uid;
      this.x = sticker.x;
      this.y = sticker.y;
      this.width = sticker.width;
      this.height = sticker.height;
      this.text = sticker.text;
      this.userText = sticker.userText;
      this.decimals = sticker.decimals;
      this.color = sticker.color;
      this.textColor = sticker.textColor;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#FFF86B";
    this.barHeight = Math.min(30, this.height / 3);
    this.ports.push(new Port(this, true, "I", 0, this.height / 2, false));
  }

  getCopy(): Block {
    let copy = new Sticker("Sticker #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.text = this.text;
    copy.decimals = this.decimals;
    copy.color = this.color;
    copy.textColor = this.textColor;
    copy.userText = this.userText;
    return copy;
  }

  destroy(): void {
  }

  setUserText(userText: string): void {
    this.userText = userText;
  }

  getUserText(): string {
    return this.userText;
  }

  setTextColor(textColor: string): void {
    this.textColor = textColor;
  }

  getTextColor(): string {
    return this.textColor;
  }

  setDecimals(decimals: number): void {
    this.decimals = decimals;
  }

  getDecimals(): number {
    return this.decimals;
  }

  draw(ctx: CanvasRenderingContext2D): void {

    // draw the upper bar with shade
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
      ctx.fillStyle = this.textColor;
      let titleWidth = ctx.measureText(this.name).width;
      ctx.fillText(this.name, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
    }

    // draw the text area
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.fillHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.font = Util.getOS() == "Android" ? "13px Noto Serif" : "14px Times New Roman";
    ctx.fillStyle = this.textColor;
    if (this.text != undefined) {
      if (this.isArray) {
        let lineHeight = ctx.measureText("M").width * 1.2;
        let lines = this.text.split(",");
        for (let i = 0; i < lines.length; ++i) {
          let yi = this.y + this.barHeight + 20 + i * lineHeight;
          if (yi < this.y + this.height - lineHeight / 2) {
            if (i % 2 == 0) {
              ctx.fillStyle = "lightgreen";
              ctx.beginPath();
              ctx.rect(this.x + 1, yi - lineHeight, this.width - 2, lineHeight + 4);
              ctx.fill();
            }
            ctx.fillStyle = "black";
            ctx.fillText(lines[i], this.x + 10, yi);
          }
        }
      } else {
        ctx.fillText(this.text, this.x + 10, this.y + this.barHeight + 20);
      }
    } else if (this.userText != undefined) {
      let lineHeight = ctx.measureText("M").width * 1.2;
      let lines = this.userText.split("\n");
      ctx.fillStyle = this.textColor;
      for (let i = 0; i < lines.length; ++i) {
        let yi = this.y + this.barHeight + 20 + i * lineHeight;
        if (yi < this.y + this.height - lineHeight / 2) {
          ctx.fillText(lines[i], this.x + 10, yi);
        }
      }
    }

    // draw the port
    if (this.userText == undefined) {
      ctx.font = this.iconic ? "9px Arial" : "12px Arial";
      ctx.strokeStyle = "black";
      this.ports[0].draw(ctx, this.iconic);
    }

    if (this.selected) {
      this.highlightSelection(ctx);
    }

  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    // text is part of the model
    let v = this.ports[0].getValue();
    if (v != undefined) {
      try {
        this.text = v.toFixed(this.decimals);
      } catch (e) {
        this.text = "" + v; // value is a boolean or string or array
        this.isArray = Array.isArray(v);
      }
    } else {
      this.text = undefined;
    }
  }

  refreshView(): void {
    super.refreshView();
    this.updateModel();
    this.ports[0].setY(this.height / 2);
  }

}
