/*
 * @author Charles Xie
 */

import {Util} from "./Util";

export class ColorPicker {

  private rgbaColor: string = "#ffffffff";
  private colorLabel: HTMLElement;
  private colorBlock: HTMLCanvasElement;
  private colorStrip: HTMLCanvasElement;
  private ctx1: CanvasRenderingContext2D;
  private ctx2: CanvasRenderingContext2D;
  private savedBlockX: number = -10;
  private savedBlockY: number = -10;
  private savedStripY: number = -10;
  private drag: boolean = false;

  constructor() {
    this.colorBlock = document.getElementById('color-block') as HTMLCanvasElement;
    this.ctx1 = this.colorBlock.getContext('2d');
    this.colorStrip = document.getElementById('color-strip') as HTMLCanvasElement;
    this.ctx2 = this.colorStrip.getContext('2d');
    this.colorBlock.addEventListener("mousedown", this.mousedown.bind(this), false);
    this.colorBlock.addEventListener("mouseup", this.mouseup.bind(this), false);
    this.colorBlock.addEventListener("mousemove", this.mousemove.bind(this), false);
    this.colorStrip.addEventListener("click", this.clickStrip.bind(this), false);
  }

  public setColorLabel(colorLabel: HTMLElement) {
    this.colorLabel = colorLabel;
  }

  public setSelectedColor(color: string): void {
    this.rgbaColor = color;
    this.colorLabel.style.backgroundColor = color;
  }

  public getSelectedColor(): string {
    return this.rgbaColor;
  }

  public draw(): void {
    // draw color block
    this.ctx1.rect(0, 0, this.colorBlock.width, this.colorBlock.height);
    this.fillGradient();
    this.ctx1.strokeStyle = "black";
    this.ctx1.lineWidth = 2;
    this.ctx1.beginPath();
    this.ctx1.arc(this.savedBlockX, this.savedBlockY, 5, 0, 2 * Math.PI);
    this.ctx1.stroke();
    // draw color strip
    this.ctx2.rect(0, 0, this.colorStrip.width, this.colorStrip.height);
    let gradient = this.ctx2.createLinearGradient(0, 0, 0, this.colorStrip.height);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
    gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');
    this.ctx2.fillStyle = gradient;
    this.ctx2.fill();
    this.ctx2.strokeStyle = "black";
    this.ctx2.lineWidth = 2;
    this.ctx2.beginPath();
    this.ctx2.rect(0, this.savedStripY, this.colorStrip.width, 4);
    this.ctx2.stroke();
  }

  private fillGradient(): void {
    this.ctx1.fillStyle = this.rgbaColor;
    this.ctx1.fillRect(0, 0, this.colorBlock.width, this.colorBlock.height);
    let grdWhite = this.ctx2.createLinearGradient(0, 0, this.colorBlock.width, 0);
    grdWhite.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grdWhite.addColorStop(1, 'rgba(255, 255, 255, 0)');
    this.ctx1.fillStyle = grdWhite;
    this.ctx1.fillRect(0, 0, this.colorBlock.width, this.colorBlock.height);
    let grdBlack = this.ctx2.createLinearGradient(0, 0, 0, this.colorBlock.height);
    grdBlack.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grdBlack.addColorStop(1, 'rgba(0, 0, 0, 1)');
    this.ctx1.fillStyle = grdBlack;
    this.ctx1.fillRect(0, 0, this.colorBlock.width, this.colorBlock.height);
  }

  private clickStrip(e: MouseEvent): void {
    this.savedStripY = e.offsetY;
    let imageData = this.ctx2.getImageData(e.offsetX, e.offsetY, 1, 1).data;
    //this.rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    this.rgbaColor = Util.rgbToHex(imageData[0], imageData[1], imageData[2]);
    this.draw();
  }

  private mousedown(e: MouseEvent): void {
    this.drag = true;
    this.changeColor(e);
  }

  private mousemove(e: MouseEvent): void {
    if (this.drag) {
      this.changeColor(e);
      this.savedBlockX = e.offsetX;
      this.savedBlockY = e.offsetY;
      this.draw();
    }
  }

  private mouseup(e: MouseEvent): void {
    this.drag = false;
    this.savedBlockX = e.offsetX;
    this.savedBlockY = e.offsetY;
    this.draw();
  }

  private changeColor(e: MouseEvent): void {
    let imageData = this.ctx1.getImageData(e.offsetX, e.offsetY, 1, 1).data;
    //this.rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    this.rgbaColor = Util.rgbToHex(imageData[0], imageData[1], imageData[2]);
    if (this.colorLabel) {
      this.colorLabel.style.backgroundColor = this.rgbaColor;
    }
  }

}
