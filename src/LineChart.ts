/*
 * This draws lines from input data.
 *
 * @author Charles Xie
 */

export class LineChart {

  name: string;
  data: number[];
  minimumValue: number = 0;
  maximumValue: number = 1;

  private canvas: HTMLCanvasElement;
  private visible: boolean;
  private margin = {
    left: <number>30,
    right: <number>20,
    top: <number>20,
    bottom: <number>30
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
    if (this.data) {
      this.drawGraphWindow(ctx);
      this.drawLineCharts(ctx);
    }

  }

  private drawLineCharts(ctx: CanvasRenderingContext2D) {
    let sum = 0;
    for (var i = 0; i < this.data.length; i++) {
      sum += this.data[i];
    }
    let graphWindowWidth = this.canvas.width - this.margin.left - this.margin.right;
    let graphWindowHeight = this.canvas.height - this.margin.bottom - this.margin.top;
    let dx = graphWindowWidth / (this.data.length - 1);
    let dy = 0.8 * graphWindowHeight / (this.maximumValue - this.minimumValue);

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.font = "8px Arial";
    ctx.fillStyle = 'black';
    ctx.beginPath();
    let horizontalAxisY = this.canvas.height - this.margin.bottom;
    let tmpX = this.margin.left;
    let tmpY = (this.data[0] - this.minimumValue) * dy;
    ctx.moveTo(tmpX, horizontalAxisY - tmpY);
    ctx.fillText("1", tmpX - 4, horizontalAxisY + 10);
    for (let i = 1; i < this.data.length; i++) {
      tmpX = this.margin.left + dx * i;
      tmpY = (this.data[i] - this.minimumValue) * dy;
      ctx.lineTo(tmpX, horizontalAxisY - tmpY);
      if ((i + 1) % 5 == 0 || this.data.length < 10) {
        ctx.fillText("" + (i + 1), tmpX - 4, horizontalAxisY + 10);
      }
    }
    ctx.stroke();

    ctx.fillStyle = 'red';
    for (let i = 0; i < this.data.length; i++) {
      tmpX = this.margin.left + dx * i;
      tmpY = (this.data[i] - this.minimumValue) * dy;
      ctx.beginPath();
      ctx.arc(tmpX, horizontalAxisY - tmpY, 2, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
    }

    ctx.font = "10px Arial";
    let xAxisLabel = 'Time (s)';
    ctx.fillText(xAxisLabel, this.margin.left + graphWindowWidth / 2 - ctx.measureText(xAxisLabel).width / 2, horizontalAxisY + 20);
    ctx.save();
    ctx.translate(15, this.canvas.height / 2 + 30);
    ctx.rotate(-Math.PI / 2);
    let yAxisLabel = "Temperature (°C)"
    ctx.fillText(yAxisLabel, 0, 0);
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
