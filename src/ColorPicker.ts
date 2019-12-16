/*
 * @author Charles Xie
 */

import {Util} from "./Util";

export class ColorPicker {

  rgbaColor: string;
  colorLabel: HTMLElement;

  private colorBlock: HTMLCanvasElement;
  private colorStrip: HTMLCanvasElement;
  private ctx1: CanvasRenderingContext2D;
  private ctx2: CanvasRenderingContext2D;
  private x: number = 0;
  private y: number = 0;
  private drag: boolean = false;

  constructor() {
    this.colorBlock = document.getElementById('color-block') as HTMLCanvasElement;
    this.ctx1 = this.colorBlock.getContext('2d');
    this.colorStrip = document.getElementById('color-strip') as HTMLCanvasElement;
    this.ctx2 = this.colorStrip.getContext('2d');
    this.colorBlock.addEventListener("mousedown", this.mousedown.bind(this), false);
    this.colorBlock.addEventListener("mouseup", this.mouseup.bind(this), false);
    this.colorBlock.addEventListener("mousemove", this.mousemove.bind(this), false);
    this.colorStrip.addEventListener("click", this.click.bind(this), false);
  }

  public draw(): void {
    this.rgbaColor = "#ff0000";
    this.ctx1.rect(0, 0, this.colorBlock.width, this.colorBlock.height);
    this.fillGradient();
    this.ctx2.rect(0, 0, this.colorStrip.width, this.colorStrip.height);
    let grd1 = this.ctx2.createLinearGradient(0, 0, 0, this.colorBlock.height);
    grd1.addColorStop(0, 'rgba(255, 0, 0, 1)');
    grd1.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    grd1.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    grd1.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    grd1.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    grd1.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    grd1.addColorStop(1, 'rgba(255, 0, 0, 1)');
    this.ctx2.fillStyle = grd1;
    this.ctx2.fill();
  }

  private fillGradient(): void {
    this.ctx1.fillStyle = this.rgbaColor;
    this.ctx1.fillRect(0, 0, this.colorBlock.width, this.colorBlock.height);
    let grdWhite = this.ctx2.createLinearGradient(0, 0, this.colorBlock.width, 0);
    grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
    grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
    this.ctx1.fillStyle = grdWhite;
    this.ctx1.fillRect(0, 0, this.colorBlock.width, this.colorBlock.height);
    let grdBlack = this.ctx2.createLinearGradient(0, 0, 0, this.colorBlock.height);
    grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
    grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
    this.ctx1.fillStyle = grdBlack;
    this.ctx1.fillRect(0, 0, this.colorBlock.width, this.colorBlock.height);
  }

  private click(e: MouseEvent): void {
    this.x = e.offsetX;
    this.y = e.offsetY;
    let imageData = this.ctx2.getImageData(this.x, this.y, 1, 1).data;
    //this.rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    this.rgbaColor = Util.rgbToHex(imageData[0], imageData[1], imageData[2]);
    this.fillGradient();
  }

  private mousedown(e: MouseEvent): void {
    this.drag = true;
    this.changeColor(e);
  }

  private mousemove(e: MouseEvent): void {
    if (this.drag) {
      this.changeColor(e);
    }
  }

  private mouseup(e: MouseEvent): void {
    this.drag = false;
  }

  private changeColor(e: MouseEvent): void {
    this.x = e.offsetX;
    this.y = e.offsetY;
    var imageData = this.ctx1.getImageData(this.x, this.y, 1, 1).data;
    //this.rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    this.rgbaColor = Util.rgbToHex(imageData[0], imageData[1], imageData[2]);
    if (this.colorLabel) {
      this.colorLabel.style.backgroundColor = this.rgbaColor;
    }
  }

}
