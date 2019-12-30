/*
 * This draws a line from the input sensor data stream (time series).
 *
 * @author Charles Xie
 */

import {Sensor} from "../components/Sensor";
import {Movable} from "../Movable";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {system} from "../Main";

export class LineChart implements Movable {

  name: string;
  minimumValue: number = 0;
  maximumValue: number = 1;
  autoscale: boolean = true;
  xAxisLabel: string = "Time (s)";
  yAxisLabel: string = "Temperature (°C)";
  graphWindowColor: string = "white";
  titleBarColor: string = "lightgray";
  handle: Rectangle;
  readonly canvas: HTMLCanvasElement;
  sensor: Sensor;

  private visible: boolean;
  private margin = {
    left: <number>40,
    right: <number>25,
    top: <number>40,
    bottom: <number>40
  };
  private readonly titleBarHeight = 24;
  private closeButton = new Rectangle(0, 0, 14, 14);
  private clearButton = new Rectangle(0, 0, 14, 14);
  private selectedButton: Rectangle;
  readonly uid: string;

  public static State = class {
    uid: string;
    visible: boolean;
    x: number;
    y: number;

    constructor(lineChart: LineChart) {
      this.uid = lineChart.sensor.name + " @" + lineChart.sensor.board.getUid();
      this.visible = lineChart.visible;
      this.x = lineChart.getX();
      this.y = lineChart.getY();
    }
  };

  constructor(elementId: string, uid: string, sensor: Sensor) {
    this.name = sensor.name + " Graph";
    this.uid = uid;
    this.canvas = document.getElementById(elementId) as HTMLCanvasElement;
    this.sensor = sensor;
    this.yAxisLabel = sensor.name + " (" + sensor.unit + ")";
    this.handle = new Rectangle(0, 0, this.canvas.width, this.titleBarHeight);
    this.closeButton.x = this.canvas.width - this.closeButton.width - 4;
    this.closeButton.y += 4;
    this.clearButton.x = this.canvas.width - 2 * (this.clearButton.width + 4);
    this.clearButton.y += 4;
  }

  update(): void {
  }

  public getUid(): string {
    return this.uid;
  }

  public setVisible(visible: boolean): void {
    this.canvas.style.display = visible ? "block" : "none";
    this.visible = visible;
  }

  public isVisible(): boolean {
    return this.visible;
  }

  public onHandle(x: number, y: number): boolean {
    return this.handle.contains(x, y);
  }

  public draw(): void {

    this.canvas.addEventListener('click', this.onMouseClick, false);
    this.canvas.addEventListener('dblclick', this.onMouseDoubleClick, false);
    this.canvas.addEventListener('mousemove', this.onMouseMove, false);
    this.canvas.addEventListener('mouseleave', this.onMouseLeave, false);
    this.canvas.addEventListener('touchmove', this.onTouchMove, false);
    this.canvas.addEventListener('contextmenu', this.openContextMenu, false);

    let ctx = this.canvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.sensor.data) {
      this.drawGraphWindow(ctx);
      this.drawAxisLabels(ctx);
      if (this.sensor.data.length > 1) {
        this.drawLineCharts(ctx);
      }
    }
    this.drawTitleBar(ctx);
    this.drawToolTips(ctx);

  }

  private drawLineCharts(ctx: CanvasRenderingContext2D): void {

    // detect minimum and maximum of y values
    let min = Number.MAX_VALUE;
    let max = -min;
    if (this.autoscale) {
      for (let i = 0; i < this.sensor.data.length; i++) {
        if (this.sensor.data[i] > max) {
          max = this.sensor.data[i];
        }
        if (this.sensor.data[i] < min) {
          min = this.sensor.data[i];
        }
      }
    } else {
      min = this.minimumValue;
      max = this.maximumValue;
    }

    // determine the graph window
    let graphWindowWidth = this.canvas.width - this.margin.left - this.margin.right;
    let graphWindowHeight = this.canvas.height - this.margin.bottom - this.margin.top;
    let dx = graphWindowWidth / (this.sensor.data.length - 1);
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
    let tmpY = yOffset + (this.sensor.data[0] - min) * dy;
    ctx.moveTo(tmpX, horizontalAxisY - tmpY);
    ctx.fillText("0", tmpX - 4, horizontalAxisY + 10);
    for (let i = 1; i < this.sensor.data.length; i++) {
      tmpX = this.margin.left + dx * i;
      tmpY = yOffset + (this.sensor.data[i] - min) * dy;
      ctx.lineTo(tmpX, horizontalAxisY - tmpY);
    }
    ctx.stroke();

    // draw symbols on top of the line
    for (let i = 0; i < this.sensor.data.length; i++) {
      tmpX = this.margin.left + dx * i;
      tmpY = yOffset + (this.sensor.data[i] - min) * dy;
      ctx.beginPath();
      ctx.arc(tmpX, horizontalAxisY - tmpY, 3, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.stroke();
    }

    // draw x-axis tick marks
    let timeLength = this.sensor.data.length * this.sensor.collectionInterval;
    let spacing = Math.pow(10, Util.countDigits(Math.round(timeLength)) - 1);
    for (let i = 0; i < this.sensor.data.length; i++) {
      let j = i * this.sensor.collectionInterval;
      if (Math.abs(j - Math.floor(j)) < 0.0001) { // only plot at whole seconds
        if (j % spacing == 0 || timeLength < 10) {
          tmpX = this.margin.left + dx * i;
          ctx.beginPath();
          ctx.moveTo(tmpX, horizontalAxisY);
          ctx.lineTo(tmpX, horizontalAxisY - 4);
          ctx.stroke();
          ctx.fillText(j.toString(), tmpX - 4, horizontalAxisY + 10);
        }
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

  }

  private drawAxisLabels(ctx: CanvasRenderingContext2D): void {
    let graphWindowWidth = this.canvas.width - this.margin.left - this.margin.right;
    let horizontalAxisY = this.canvas.height - this.margin.bottom;
    ctx.font = "15px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(this.xAxisLabel, this.margin.left + graphWindowWidth / 2 - ctx.measureText(this.xAxisLabel).width / 2, horizontalAxisY + 30);
    ctx.save();
    ctx.translate(20, this.canvas.height / 2 + ctx.measureText(this.yAxisLabel).width / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(this.yAxisLabel, 0, 0);
    ctx.restore();
  }

  private drawGraphWindow(ctx: CanvasRenderingContext2D): void {
    let canvas = this.canvas;
    let margin = this.margin;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(margin.left, margin.top, canvas.width - margin.left - margin.right, canvas.height - margin.top - margin.bottom);
    ctx.stroke();
    ctx.fillStyle = this.graphWindowColor;
    ctx.fillRect(margin.left, margin.top, canvas.width - margin.left - margin.right, canvas.height - margin.top - margin.bottom);
  }

  private drawTitleBar(ctx: CanvasRenderingContext2D): void {
    // draw bar
    ctx.fillStyle = this.titleBarColor;
    ctx.fillRect(0, 0, this.canvas.width, 24);
    ctx.fillStyle = "black";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 24);
    ctx.lineTo(this.canvas.width, this.titleBarHeight);
    ctx.stroke();
    this.drawButton(ctx, this.closeButton);
    this.drawButton(ctx, this.clearButton);
  }

  private drawButton(ctx: CanvasRenderingContext2D, button: Rectangle): void {
    ctx.beginPath();
    ctx.rect(button.x, button.y, button.width, button.height);
    ctx.stroke();
    ctx.lineWidth = 0.5;
    if (button == this.closeButton) {
      ctx.moveTo(button.x + 2, button.y + 2);
      ctx.lineTo(button.x + button.width - 2, button.y + button.height - 2);
      ctx.moveTo(button.x + button.width - 2, button.y + 2);
      ctx.lineTo(button.x + 2, button.y + button.height - 2);
    } else if (button == this.clearButton) {
      ctx.moveTo(button.x + 2, button.getCenterY());
      ctx.lineTo(button.x + button.width - 2, button.getCenterY());
    }
    ctx.stroke();
  }

  private drawToolTips(ctx: CanvasRenderingContext2D): void {
    switch (this.selectedButton) {
      case this.closeButton:
        ctx.drawTooltip(this.closeButton.getCenterX() - 20, this.closeButton.getCenterY() + 20, 20, 8, 10, "Close", true);
        break;
      case this.clearButton:
        ctx.drawTooltip(this.clearButton.getCenterX() - 20, this.clearButton.getCenterY() + 20, 20, 8, 10, "Clear", true);
        break;
    }
  }

  private onMouseMove = (e: MouseEvent): void => {
    e.preventDefault();
    let rect = this.canvas.getBoundingClientRect();
    let x = e.clientX - rect.x;
    let y = e.clientY - rect.y;
    let ctx = this.canvas.getContext('2d');
    this.selectedButton = null;
    if (this.closeButton.contains(x, y)) {
      this.canvas.style.cursor = "pointer";
      this.selectedButton = this.closeButton;
    } else if (this.clearButton.contains(x, y)) {
      this.canvas.style.cursor = "pointer";
      this.selectedButton = this.clearButton;
    } else if (this.handle.contains(x, y)) {
      this.canvas.style.cursor = "move";
    } else {
      this.canvas.style.cursor = "default";
    }
    this.draw();
  };

  private onMouseLeave = (e: MouseEvent): void => {
    e.preventDefault();
    this.draw();
  };

  private onTouchMove = (e: TouchEvent): void => {
    e.preventDefault();
  };

  private onMouseClick = (e: MouseEvent): void => {
    e.preventDefault();
    let rect = this.canvas.getBoundingClientRect();
    let x = e.clientX - rect.x;
    let y = e.clientY - rect.y;
    if (this.closeButton.contains(x, y)) {
      this.setVisible(false);
      system.storeLineChartStates();
    } else if (this.clearButton.contains(x, y)) {
      this.sensor.data.length = 0;
    } else {
      this.bringForward();
    }
  };

  private onMouseDoubleClick = (e: MouseEvent): void => {
    e.preventDefault();
  };

  private openContextMenu = (e: MouseEvent): void => {
    e.preventDefault();
    let menu = document.getElementById("linechart-context-menu") as HTMLMenuElement;
    menu.style.left = e.clientX + "px";
    menu.style.top = (e.clientY - document.getElementById("tabs").getBoundingClientRect().bottom) + "px";
    menu.classList.add("show-menu");
  };

  public bringForward(): void {
    this.canvas.style.zIndex = (parseInt(this.canvas.style.zIndex) + 2).toString();
  }

  public getX(): number {
    return this.canvas.offsetLeft;
  }

  public setX(x: number): void {
    this.canvas.style.left = x + "px";
  }

  public getY(): number {
    return this.canvas.offsetTop;
  }

  public setY(y: number): void {
    this.canvas.style.top = y + "px";
  }

  public getWidth(): number {
    return this.canvas.width;
  }

  public getHeight(): number {
    return this.canvas.height;
  }

  // detect if (x, y) is inside this chart
  public contains(x: number, y: number): boolean {
    return x > this.canvas.offsetLeft && x < this.canvas.offsetLeft + this.canvas.width && y > this.canvas.offsetTop && y < this.canvas.offsetTop + this.canvas.height;
  }

}
