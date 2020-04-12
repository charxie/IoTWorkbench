/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {flowchart} from "../Main";
import {Util} from "../Util";
import {Port} from "./Port";
import {DataArray} from "./DataArray";
import {CsvLoader} from "./loaders/CsvLoader";

export class DataBlock extends Block {

  private dataArray: DataArray[]; // an array of data such as CSV
  private content: string; // a string of data such as PDB
  private format: string = "CSV";
  private barHeight: number;
  private portO: Port[];
  private image;
  private margin: number = 8;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly data: number[][];
    readonly content: string;
    readonly format: string;
    readonly imageSrc: string;

    constructor(block: DataBlock) {
      this.name = block.name;
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.format = block.format;
      if (block.dataArray !== undefined) {
        this.data = new Array(block.dataArray.length);
        for (let i = 0; i < this.data.length; i++) {
          this.data[i] = block.dataArray[i].data.slice();
        }
      }
      this.content = block.content;
      this.imageSrc = block.image !== undefined ? block.image.src : undefined; // base64 image data
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.symbol = "Data";
    this.color = "#A2A4C4";
    this.source = true;
    this.barHeight = Math.min(30, this.height / 3);
  }

  private setOutputPorts(): void {
    if (this.dataArray !== undefined) {
      if (this.portO === undefined || this.portO.length !== this.dataArray.length) {
        if (this.portO) {
          for (let p of this.portO) { // disconnect all the port connectors as the ports will be recreated
            flowchart.removeAllConnectors(p);
          }
          for (let p of this.portO) {
            this.ports.pop();
          }
        }
        this.portO = new Array(this.dataArray.length);
        let dh = (this.height - this.barHeight) / (this.dataArray.length + 1);
        const firstPortName = "A";
        for (let i = 0; i < this.dataArray.length; i++) {
          this.portO[i] = new Port(this, false, String.fromCharCode(firstPortName.charCodeAt(0) + i), this.width, this.barHeight + (i + 1) * dh, true);
          this.ports.push(this.portO[i]);
        }
      }
    } else if (this.content !== undefined) {
      if (this.portO === undefined || this.portO.length !== 1) {
        if (this.portO) {
          for (let p of this.portO) { // disconnect all the port connectors as the ports will be recreated
            flowchart.removeAllConnectors(p);
          }
          for (let p of this.portO) {
            this.ports.pop();
          }
        }
        this.portO = new Array(1);
        let dh = (this.height - this.barHeight) / 2;
        this.portO[0] = new Port(this, false, "O", this.width, this.barHeight + dh, true);
        this.ports.push(this.portO[0]);
      }
    }
  }

  getCopy(): Block {
    let b = new DataBlock("Data Block #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    if (this.dataArray !== undefined) {
      b.dataArray = new Array(this.dataArray.length);
      for (let i = 0; i < this.dataArray.length; i++) {
        b.dataArray[i] = new DataArray(0);
        b.dataArray[i].data = this.dataArray[i].data.slice();
      }
    }
    b.content = this.content;
    b.format = this.format;
    b.image = this.image;
    return b;
  }

  setImageSrc(imageSrc: string) {
    if (this.image === undefined) this.image = new Image();
    this.image.src = imageSrc;
  }

  getImageSrc(): string {
    if (this.image === undefined) return undefined;
    return this.image.src;
  }

  setFormat(format: string): void {
    this.format = format;
  }

  getFormat(): string {
    return this.format;
  }

  setData(data: number[][]): void {
    if (data !== undefined) {
      let ncol = data.length;
      let nrow = data[0].length;
      this.dataArray = new Array(ncol);
      for (let i = 0; i < ncol; i++) {
        this.dataArray[i] = new DataArray(nrow);
        for (let j = 0; j < nrow; j++) {
          this.dataArray[i].data[j] = data[i][j];
        }
      }
      this.setOutputPorts();
    }
  }

  setDataInput(data: string): void {
    if (data !== undefined) {
      let csv = new CsvLoader().parse(data);
      let ncol = csv[0].length;
      let nrow = csv.length;
      this.dataArray = new Array(ncol);
      for (let i = 0; i < ncol; i++) {
        this.dataArray[i] = new DataArray(nrow);
        for (let j = 0; j < nrow; j++) {
          this.dataArray[i].data[j] = parseFloat(csv[j][i]);
        }
      }
      this.setOutputPorts();
    } else {
      this.dataArray = undefined;
    }
  }

  setContent(content: string): void {
    this.content = content;
    this.setOutputPorts();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // draw the bar
    switch (flowchart.blockView.getBlockStyle()) {
      case "Shade":
        let shade = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.barHeight);
        shade.addColorStop(0, "white");
        shade.addColorStop(this.iconic ? 0.4 : 0.2, Util.adjust(this.color, 100));
        shade.addColorStop(1, this.color);
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

    // draw the title bar
    ctx.fillStyle = "#FFFFFF";
    ctx.fillHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    if (!this.iconic) {
      ctx.lineWidth = 0.75;
      ctx.font = "14px Arial";
      ctx.fillStyle = "gray";
      let titleWidth = ctx.measureText(this.name).width;
      ctx.fillText(this.name, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
    }

    ctx.save();
    if (this.iconic || this.image === undefined) {
      ctx.fillStyle = "black";
      ctx.font = this.iconic ? "10px Arial" : "16px Arial";
      let textWidth = ctx.measureText(this.symbol).width;
      ctx.translate(this.x + this.width / 2 - textWidth / 2, this.y + (this.height + this.barHeight) / 2 + 4);
      ctx.fillText(this.symbol, 0, 0);
    } else {
      let size = this.height - this.barHeight - 2 * this.margin;
      ctx.drawImage(this.image, this.x + this.margin, this.y + this.barHeight + this.margin, size * this.image.width / this.image.height, size);
    }
    ctx.restore();

    // draw the ports
    ctx.strokeStyle = "black";
    ctx.font = "bold 12px Times";
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

  destroy(): void {
  }

  refreshView(): void {
    super.refreshView();
    this.barHeight = Math.min(30, this.height / 3);
    if (this.portO !== undefined) {
      let dh = (this.height - this.barHeight) / (this.portO.length + 1);
      for (let i = 0; i < this.portO.length; i++) {
        this.portO[i].setX(this.width);
        this.portO[i].setY(this.barHeight + (i + 1) * dh);
      }
    }
  }

  updateModel(): void {
    if (this.portO !== undefined) {
      if (this.dataArray !== undefined) {
        for (let i = 0; i < this.portO.length; i++) {
          if (this.dataArray[i] !== undefined) {
            this.portO[i].setValue(this.dataArray[i].data);
          }
        }
        this.updateConnectors();
      } else if (this.content !== undefined) {
        this.portO[0].setValue("Format:" + this.format + "\n" + this.content);
        this.updateConnectors();
      }
    }
  }

}
