/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {closeAllContextMenus, flowchart} from "../Main";
import {Complex} from "../math/Complex";
import {MyVector} from "../math/MyVector";
import {MyMatrix} from "../math/MyMatrix";
import {BoundaryCondition} from "./BoundaryCondition";
import {Rectangle} from "../math/Rectangle";

export class Sticker extends Block {

  private text: string;
  private keepResult: boolean = false;
  private arrayLength: number;
  private userText: string;
  private textColor: string = "black";
  private isArray: boolean;
  private decimals: number = 3;
  private barHeight: number;
  private htmlOverlay: HTMLDivElement;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly marginX: number;
    readonly marginY: number;
    readonly text: string;
    readonly userText: string;
    readonly decimals: number;
    readonly color: string;
    readonly textColor: string;
    readonly useHtml: boolean;
    readonly keepResult: boolean;

    constructor(sticker: Sticker) {
      this.name = sticker.name;
      this.uid = sticker.uid;
      this.x = sticker.x;
      this.y = sticker.y;
      this.width = sticker.width;
      this.height = sticker.height;
      this.marginX = sticker.marginX;
      this.marginY = sticker.marginY;
      this.text = sticker.text;
      this.userText = sticker.userText;
      this.decimals = sticker.decimals;
      this.color = sticker.color;
      this.textColor = sticker.textColor;
      this.useHtml = sticker.getUseHtml();
      this.keepResult = sticker.keepResult;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#FFF86B";
    this.barHeight = Math.min(30, this.height / 3);
    this.ports.push(new Port(this, true, "I", 0, (this.height + this.barHeight) / 2, false));
  }

  getCopy(): Block {
    let copy = new Sticker("Sticker #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.text = this.text;
    copy.decimals = this.decimals;
    copy.color = this.color;
    copy.textColor = this.textColor;
    copy.marginX = this.marginX;
    copy.marginY = this.marginY;
    copy.keepResult = this.keepResult;
    copy.setUseHtml(this.getUseHtml());
    copy.setUserText(this.userText);
    copy.locateHtmlOverlay();
    return copy;
  }

  destroy(): void {
    if (this.htmlOverlay !== undefined) {
      let parent = document.getElementById("block-view-wrapper");
      if (parent.contains(this.htmlOverlay)) parent.removeChild(this.htmlOverlay);
    }
  }

  setKeepResult(keepResult: boolean): void {
    this.keepResult = keepResult;
  }

  getKeepResult(): boolean {
    return this.keepResult;
  }

  setUseHtml(useHtml: boolean): void {
    if (useHtml) {
      if (this.htmlOverlay === undefined) {
        this.htmlOverlay = document.createElement("div");
        this.htmlOverlay.tabIndex = 0;
        this.htmlOverlay.style.overflowY = "auto";
        this.htmlOverlay.style.position = "absolute";
        this.htmlOverlay.style.fontFamily = "Arial";
        this.htmlOverlay.style.fontSize = "12px";
        this.htmlOverlay.addEventListener("mousedown", this.overlayMouseDown.bind(this), false);
        this.htmlOverlay.addEventListener('contextmenu', this.overlayOpenContextMenu.bind(this), false);
        this.htmlOverlay.addEventListener("keyup", this.overlayKeyUp.bind(this), false);
      }
      document.getElementById("block-view-wrapper").append(this.htmlOverlay);
      this.htmlOverlay.style.color = this.textColor;
    } else {
      if (this.htmlOverlay !== undefined) {
        document.getElementById("block-view-wrapper").removeChild(this.htmlOverlay);
        this.htmlOverlay = undefined;
      }
    }
  }

  getUseHtml(): boolean {
    return this.htmlOverlay !== undefined;
  }

  private overlayMouseDown(e: MouseEvent): void {
    if (this.htmlOverlay !== undefined) {
      closeAllContextMenus();
      if (flowchart.blockView.getSelectedBlock() !== null) {
        flowchart.blockView.getSelectedBlock().setSelected(false);
      }
      this.setSelected(true);
      flowchart.blockView.setSelectedBlock(this);
      flowchart.blockView.clearResizeName();
      flowchart.blockView.requestDraw();
    }
  }

  private overlayOpenContextMenu(e: MouseEvent): void {
    if (this.htmlOverlay !== undefined) {
      if (Util.getSelectedText() === "") {
        flowchart.blockView.openContextMenu(e);
      }
      // if text is selected, use default
    }
  }

  private overlayKeyUp(e: KeyboardEvent): void {
    if (this.htmlOverlay !== undefined) {
      flowchart.blockView.keyUp(e);
    }
  }

  setUserText(userText: string): void {
    this.userText = userText;
    if (this.htmlOverlay !== undefined && this.userText !== undefined) {
      this.htmlOverlay.innerHTML = userText;
    }
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

  locateHtmlOverlay(): void {
    this.setX(this.getX());
    this.setY(this.getY());
    this.setWidth(this.getWidth());
    this.setHeight(this.getHeight());
  }

  setX(x: number): void {
    super.setX(x);
    if (this.htmlOverlay !== undefined) {
      this.htmlOverlay.style.left = (this.x + this.marginX) + "px";
    }
  }

  setY(y: number): void {
    super.setY(y);
    if (this.htmlOverlay !== undefined) {
      this.htmlOverlay.style.top = (this.y + this.barHeight + this.marginY) + "px";
    }
  }

  setWidth(width: number): void {
    super.setWidth(width);
    if (this.htmlOverlay !== undefined) {
      this.htmlOverlay.style.width = (this.width - 2 * this.marginX) + "px";
    }
  }

  setHeight(height: number): void {
    super.setHeight(height);
    if (this.htmlOverlay !== undefined) {
      this.htmlOverlay.style.height = (this.height - this.barHeight - 2 * this.marginY) + "px";
    }
  }

  translateBy(dx: number, dy: number): void {
    super.translateBy(dx, dy);
    if (this.htmlOverlay !== undefined) {
      this.htmlOverlay.style.left = (this.x + this.marginX) + "px";
      this.htmlOverlay.style.top = (this.y + this.barHeight + this.marginY) + "px";
    }
  }

  setRect(rect: Rectangle): void {
    super.setRect(rect);
    if (this.htmlOverlay !== undefined) {
      this.htmlOverlay.style.left = (this.x + this.marginX) + "px";
      this.htmlOverlay.style.top = (this.y + this.barHeight + this.marginY) + "px";
      this.htmlOverlay.style.width = (this.width - 2 * this.marginX) + "px";
      this.htmlOverlay.style.height = (this.height - this.barHeight - 2 * this.marginY) + "px";
    }
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
      ctx.fillStyle = this.textColor;
      let name2 = this.arrayLength !== undefined ? this.name + " (" + this.arrayLength + ")" : this.name;
      let titleWidth = ctx.measureText(name2).width;
      ctx.fillText(name2, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
    }

    // draw the text area
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.fillHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    if (this.htmlOverlay) {
      if (this.text != undefined) {
        this.htmlOverlay.style.fontFamily = "Courier New";
        if (this.isArray) {
          let lines = this.text.split(",");
          let htmlLines = "<p style='line-height: 1.2; margin: 0; padding: 0;'>";
          for (let i = 0; i < lines.length; i++) {
            if (i % 2 === 0) {
              htmlLines += "<mark style='background-color: lightgreen; color:" + this.textColor + "'>" + lines[i] + "</mark>";
            } else {
              htmlLines += lines[i];
            }
            if (i < lines.length - 1) {
              htmlLines += "<br>";
            }
          }
          this.htmlOverlay.innerHTML = htmlLines;
        } else {
          this.htmlOverlay.innerHTML = this.text;
        }
      }
    } else {
      ctx.fillStyle = this.textColor;
      if (this.text != undefined) {
        ctx.font = "12px Courier New";
        if (this.isArray) {
          let lineHeight = ctx.measureText("M").width * 2;
          let lines = this.text.split(",");
          for (let i = 0; i < lines.length; ++i) {
            let yi = this.y + this.barHeight + 10 + i * lineHeight;
            if (yi < this.y + this.height - lineHeight / 2) {
              if (i % 2 == 0) {
                ctx.fillStyle = "lightgreen";
                ctx.beginPath();
                ctx.rect(this.x + 1, yi - lineHeight, this.width - 2, lineHeight + 4);
                ctx.fill();
              }
              ctx.fillStyle = "black";
              ctx.fillText(lines[i], this.x + 10, yi);
            } else {
              break;
            }
          }
        } else {
          ctx.fillText(this.text, this.x + 10, this.y + this.barHeight + 20);
        }
      } else if (this.userText != undefined) {
        ctx.font = Util.getOS() == "Android" ? "13px Noto Serif" : "14px Times New Roman";
        let lineHeight = ctx.measureText("M").width * 1.2;
        let lines = this.userText.split("\n");
        ctx.fillStyle = this.textColor;
        for (let i = 0; i < lines.length; ++i) {
          let yi = this.y + this.barHeight + 20 + i * lineHeight;
          if (yi < this.y + this.height - lineHeight / 2) {
            ctx.fillText(lines[i], this.x + 10, yi);
          } else {
            break;
          }
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
      this.isArray = Array.isArray(v);
      if (this.isArray) {
        this.arrayLength = v.length;
        this.text = "";
        for (let i of v) {
          if (Array.isArray(i)) {
            for (let j of i) {
              try {
                this.text += j.toFixed(this.decimals) + " ";
              } catch (e) {
                this.text += i + " "; // value is a boolean or string
              }
            }
            if (i.indexOf(v) < v.length - 1) this.text += ",";
          } else {
            if (i instanceof Complex) {
              this.text += i.toFixed(this.decimals) + ",";
            } else {
              try {
                this.text += i.toFixed(this.decimals) + ",";
              } catch (e) {
                this.text += i + ","; // value is a boolean or string
              }
            }
          }
        }
        this.text = this.text.substring(0, this.text.length - 1);
      } else {
        if (this.keepResult) {
          this.isArray = true;
          if (this.text === undefined) this.text = "";
          if (v instanceof Complex) {
            this.text += v.toFixed(this.decimals) + ",";
          } else if (v instanceof MyVector) {
            this.text += v.toFixed(this.decimals) + ",";
          } else {
            try {
              this.text += v.toFixed(this.decimals) + ",";
            } catch (e) {
              this.text += v + ","; // value is a boolean or string
            }
          }
        } else {
          if (v instanceof Complex) {
            this.text = v.toFixed(this.decimals);
          } else if (v instanceof MyVector) {
            this.text = v.toFixed(this.decimals);
          } else if (v instanceof MyMatrix) {
            this.text = v.toFixed(this.decimals);
            this.isArray = true;
          } else if (v instanceof BoundaryCondition) {
            this.text = v.toString();
            this.isArray = true;
          } else {
            try {
              this.text = v.toFixed(this.decimals);
            } catch (e) {
              this.text = "" + v; // value is a boolean or string
            }
          }
        }
      }
    } else {
      if (!this.keepResult) {
        this.text = undefined;
      }
    }
  }

  refreshView(): void {
    super.refreshView();
    this.barHeight = Math.min(30, this.height / 3);
    //this.updateModel();
    this.ports[0].setY((this.height + this.barHeight) / 2);
  }

  erase(): void {
    this.text = "";
  }

}
