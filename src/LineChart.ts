/*
 * This draws lines from input data.
 *
 * @author Charles Xie
 */

import {Util} from "./Util";

export class LineChart {

  name: string;
  data: number[];
  minimumValue: number = 0;
  maximumValue: number = 1;
  autoscale: boolean = true;
  xAxisLabel: string = "Time (s)";
  yAxisLabel: string = "Temperature (°C)";

  private canvas: HTMLCanvasElement;
  private visible: boolean;
  private margin = {
    left: <number>40,
    right: <number>20,
    top: <number>20,
    bottom: <number>40
  };

  constructor(elementId: string, name: string, data: number[], minimumValue: number, maximumValue: number) {
    this.canvas = document.getElementById(elementId) as HTMLCanvasElement;
    this.name = name;
    this.data = data;
    this.minimumValue = minimumValue;
    this.maximumValue = maximumValue;
  }

  public setVisible(visible: boolean): void {
    this.canvas.style.display = visible ? "block" : "none";
    this.visible = visible;
  }

  public isVisible(): boolean {
    return this.visible;
  }

  public draw() {

    this.canvas.addEventListener('click', this.onMouseClick, false);
    this.canvas.addEventListener('dblclick', this.onMouseDoubleClick, false);
    this.canvas.addEventListener('mousemove', this.onMouseMove, false);
    this.canvas.addEventListener('mouseleave', this.onMouseLeave, false);
    this.canvas.addEventListener('touchmove', this.onTouchMove, false);

    let ctx = this.canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.data && this.data.length > 1) {
      this.drawGraphWindow(ctx);
      this.drawLineCharts(ctx);
    }

  }

  private drawLineCharts(ctx: CanvasRenderingContext2D) {

    // detect minimum and maximum of y values
    let min = Number.MAX_VALUE;
    let max = -min;
    if (this.autoscale) {
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i] > max) {
          max = this.data[i];
        }
        if (this.data[i] < min) {
          min = this.data[i];
        }
      }
    } else {
      min = this.minimumValue;
      max = this.maximumValue;
    }

    // determine the graph window
    let graphWindowWidth = this.canvas.width - this.margin.left - this.margin.right;
    let graphWindowHeight = this.canvas.height - this.margin.bottom - this.margin.top;
    let dx = graphWindowWidth / (this.data.length - 1);
    let yOffset = 0.1 * graphWindowHeight;
    let dy = (graphWindowHeight - 2 * yOffset) / (max - min);

    // draw the data line
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.font = "10px Arial";
    ctx.fillStyle = "black";
    ctx.beginPath();
    let horizontalAxisY = this.canvas.height - this.margin.bottom;
    let tmpX = this.margin.left;
    let tmpY = yOffset + (this.data[0] - min) * dy;
    ctx.moveTo(tmpX, horizontalAxisY - tmpY);
    ctx.fillText("0", tmpX - 4, horizontalAxisY + 10);
    for (let i = 1; i < this.data.length; i++) {
      tmpX = this.margin.left + dx * i;
      tmpY = yOffset + (this.data[i] - min) * dy;
      ctx.lineTo(tmpX, horizontalAxisY - tmpY);
    }
    ctx.stroke();

    // draw symbols on top of the line
    for (let i = 0; i < this.data.length; i++) {
      tmpX = this.margin.left + dx * i;
      tmpY = yOffset + (this.data[i] - min) * dy;
      ctx.beginPath();
      ctx.arc(tmpX, horizontalAxisY - tmpY, 3, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.stroke();
    }

    // draw x-axis tick marks
    let interval = Math.pow(10, Util.countDigits(this.data.length) - 1);
    for (let i = 0; i < this.data.length; i++) {
      if (i % interval == 0 || this.data.length < 10) {
        tmpX = this.margin.left + dx * i;
        ctx.beginPath();
        ctx.moveTo(tmpX, horizontalAxisY);
        ctx.lineTo(tmpX, horizontalAxisY - 4);
        ctx.stroke();
        ctx.fillText("" + i, tmpX - 4, horizontalAxisY + 10);
      }
    }

    // draw y-axis tick marks
    tmpY = yOffset;
    let minString = min.toFixed(2);
    ctx.beginPath();
    ctx.moveTo(this.margin.left, horizontalAxisY - tmpY);
    ctx.lineTo(this.margin.left + 4, horizontalAxisY - tmpY);
    ctx.stroke();
    ctx.save();
    ctx.translate(this.margin.left - 10, horizontalAxisY - tmpY + ctx.measureText(minString).width / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(minString, 0, 0);
    ctx.restore();

    tmpY = yOffset + (max - min) * dy;
    let maxString = max.toFixed(2);
    ctx.beginPath();
    ctx.moveTo(this.margin.left, horizontalAxisY - tmpY);
    ctx.lineTo(this.margin.left + 4, horizontalAxisY - tmpY);
    ctx.stroke();
    ctx.save();
    ctx.translate(this.margin.left - 10, horizontalAxisY - tmpY + ctx.measureText(maxString).width / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(maxString, 0, 0);
    ctx.restore();

    // draw labels for x and y axis
    ctx.font = "16px Arial";
    ctx.fillText(this.xAxisLabel, this.margin.left + graphWindowWidth / 2 - ctx.measureText(this.xAxisLabel).width / 2, horizontalAxisY + 30);
    ctx.save();
    ctx.translate(20, this.canvas.height / 2 + ctx.measureText(this.yAxisLabel).width / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(this.yAxisLabel, 0, 0);
    ctx.restore();

  }

  private drawGraphWindow(ctx: CanvasRenderingContext2D) {
    let canvas = this.canvas;
    let margin = this.margin;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin.left, canvas.height - margin.bottom);
    ctx.lineTo(canvas.width - margin.right, canvas.height - margin.bottom);
    ctx.lineTo(canvas.width - margin.right, margin.top);
    ctx.lineTo(margin.left, margin.top);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(margin.left, margin.top, canvas.width - margin.left - margin.right, canvas.height - margin.top - margin.bottom);
  }

  private onMouseMove = (event: MouseEvent): void => {
    event.preventDefault();
    let rect = this.canvas.getBoundingClientRect();
    let x = event.clientX - rect.left - this.margin.left;
    let y = event.clientY - rect.top;
    this.draw();
  };

  private onMouseLeave = (event: MouseEvent): void => {
    event.preventDefault();
    this.draw();
  };

  private onTouchMove = (event: TouchEvent): void => {
    event.preventDefault();
  };

  private onMouseClick = (event: MouseEvent): void => {
    event.preventDefault();
  };

  private onMouseDoubleClick = (event: MouseEvent): void => {
    event.preventDefault();
  };

}
