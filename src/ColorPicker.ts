/*
 * @author Charles Xie
 */

import {Util} from "./Util";

export class ColorPicker {

  private rgbaColor: string = "#ffffffff";
  private colorLabel: HTMLElement;
  private colorCode: HTMLInputElement;
  private colorBlock: HTMLCanvasElement;
  private colorStrip: HTMLCanvasElement; // this draws the hue of the color
  private ctx1: CanvasRenderingContext2D;
  private ctx2: CanvasRenderingContext2D;
  private savedBlockX: number = -10;
  private savedBlockY: number = -10;
  private savedStripY: number = -10;

  constructor() {
    this.colorBlock = document.getElementById('color-block') as HTMLCanvasElement;
    this.ctx1 = this.colorBlock.getContext('2d');
    this.colorStrip = document.getElementById('color-strip') as HTMLCanvasElement;
    this.ctx2 = this.colorStrip.getContext('2d');
    this.colorBlock.addEventListener("mousedown", this.mouseDownBlock.bind(this), false);
    this.colorBlock.addEventListener("mouseup", this.mouseUpBlock.bind(this), false);
    this.colorStrip.addEventListener("click", this.mouseClickStrip.bind(this), false);
    this.colorStrip.addEventListener("mousedown", this.mouseDownStrip.bind(this), false);
    this.colorStrip.addEventListener("mouseup", this.mouseUpStrip.bind(this), false);
  }

  public setColorLabel(colorLabel: HTMLElement) {
    this.colorLabel = colorLabel;
  }

  public setColorCode(colorCode: HTMLInputElement) {
    this.colorCode = colorCode;
  }

  public setSelectedColor(color: string): void {
    this.rgbaColor = color;
    let c = Util.hexToRgb(color);
    this.savedStripY = this.colorStrip.height * Util.rgbToHue(c.r, c.g, c.b) / 360;
    if (this.colorLabel) {
      this.colorLabel.style.backgroundColor = color;
    }
    if (this.colorCode) {
      this.colorCode.value = color;
      this.colorCode.select();
    }
  }

  // TODO: the position should be calculated by inverting the dual-axis shading used in fillGradient()
  // right now, we just use a brute-force method to search for the point that maps to the selected color
  public setSelectedPoint(): void {
    let c = Util.hexToRgb(this.rgbaColor);
    let imageData = this.ctx1.getImageData(0, 0, this.colorBlock.width, this.colorBlock.height).data;
    let n = imageData.length / 4;
    for (let i = 0; i < n; i++) {
      if (imageData[4 * i] == c.r && imageData[4 * i + 1] == c.g && imageData[4 * i + 2] == c.b) {
        this.savedBlockX = i % this.colorBlock.width;
        this.savedBlockY = i / this.colorBlock.width;
        this.draw();
        break;
      }
    }
  }

  public getSelectedColor(): string {
    return this.rgbaColor;
  }

  public draw(): void {
    // draw color block
    this.ctx1.clearRect(0, 0, this.colorBlock.width, this.colorBlock.height);
    this.ctx1.rect(0, 0, this.colorBlock.width, this.colorBlock.height);
    this.fillGradient();
    this.ctx1.strokeStyle = "white";
    this.ctx1.lineWidth = 2;
    this.ctx1.beginPath();
    this.ctx1.arc(this.savedBlockX, this.savedBlockY, 6, 0, 2 * Math.PI);
    this.ctx1.stroke();
    // draw color strip
    this.ctx2.clearRect(0, 0, this.colorStrip.width, this.colorStrip.height);
    this.ctx2.rect(0, 0, this.colorStrip.width, this.colorStrip.height);
    let gradient = this.ctx2.createLinearGradient(0, 0, 0, this.colorStrip.height);
    gradient.addColorStop(0, '#ff0000');
    gradient.addColorStop(1.0 / 6.0, '#ffff00');
    gradient.addColorStop(2.0 / 6.0, '#00ff00');
    gradient.addColorStop(3.0 / 6.0, '#00ffff');
    gradient.addColorStop(4.0 / 6.0, '#0000ff');
    gradient.addColorStop(5.0 / 6.0, '#ff00ff');
    gradient.addColorStop(1, '#ff0000');
    this.ctx2.fillStyle = gradient;
    this.ctx2.fill();
    this.ctx2.fillStyle = "white";
    this.ctx2.beginPath();
    this.ctx2.rect(0, this.savedStripY, this.colorStrip.width, 6);
    this.ctx2.fill();
    this.ctx2.strokeStyle = "black";
    this.ctx2.lineWidth = 2;
    this.ctx2.beginPath();
    this.ctx2.rect(0, this.savedStripY, this.colorStrip.width, 8);
    this.ctx2.stroke();
  }

  private fillGradient(): void {
    this.ctx1.fillStyle = Util.getHueColor(this.rgbaColor);
    this.ctx1.fillRect(0, 0, this.colorBlock.width, this.colorBlock.height);
    let grdWhite = this.ctx1.createLinearGradient(0, 0, this.colorBlock.width, 0);
    grdWhite.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grdWhite.addColorStop(1, 'rgba(255, 255, 255, 0)');
    this.ctx1.fillStyle = grdWhite;
    this.ctx1.fillRect(0, 0, this.colorBlock.width, this.colorBlock.height);
    let grdBlack = this.ctx1.createLinearGradient(0, 0, 0, this.colorBlock.height);
    grdBlack.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grdBlack.addColorStop(1, 'rgba(0, 0, 0, 1)');
    this.ctx1.fillStyle = grdBlack;
    this.ctx1.fillRect(0, 0, this.colorBlock.width, this.colorBlock.height);
  }

  private mouseDownStrip(e: MouseEvent): void {
    e.stopPropagation();
  }

  private mouseUpStrip(e: MouseEvent): void {
    e.stopPropagation();
  }

  private mouseClickStrip(e: MouseEvent): void {
    this.savedStripY = e.offsetY;
    let imageData = this.ctx2.getImageData(e.offsetX, e.offsetY, 1, 1).data;
    this.rgbaColor = Util.rgbToHex(imageData[0], imageData[1], imageData[2]);
    this.draw();
    e.stopPropagation();
  }

  private mouseDownBlock(e: MouseEvent): void {
    this.changeColor(e);
    e.stopPropagation();
  }

  private mouseUpBlock(e: MouseEvent): void {
    this.savedBlockX = e.offsetX;
    this.savedBlockY = e.offsetY;
    this.draw();
    e.stopPropagation();
  }

  private changeColor(e: MouseEvent): void {
    let imageData = this.ctx1.getImageData(e.offsetX, e.offsetY, 1, 1).data;
    this.rgbaColor = Util.rgbToHex(imageData[0], imageData[1], imageData[2]);
    if (this.colorLabel) {
      this.colorLabel.style.backgroundColor = this.rgbaColor;
    }
    if (this.colorCode) {
      this.colorCode.value = this.rgbaColor;
    }
  }

}
