/*
 * @author Charles Xie
 */

import {Board} from "./Board";
import {LedLight} from "./LedLight";
import {Button} from "./Button";
import {System} from "./System";
import {Sensor} from "./Sensor";
import {system} from "./Main";

export class Workbench {

  readonly canvas: HTMLCanvasElement;

  private gridSize: number = 20;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.canvas.addEventListener("mousedown", this.mouseDown, false);
    this.canvas.addEventListener("mouseup", this.mouseUp, false);
    this.canvas.addEventListener("mousemove", this.mouseMove, false);
    this.canvas.addEventListener('contextmenu', this.openContextMenu, false);
  }

  public draw(): void {
    let context = this.canvas.getContext('2d');
    this.drawGrid(context);
  }

  public drawGrid(context: CanvasRenderingContext2D): void {
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.beginPath();
    context.strokeStyle = "LightSkyBlue";
    for (let i = 1; i <= this.canvas.height / this.gridSize; i++) {
      context.moveTo(0, i * this.gridSize);
      context.lineTo(this.canvas.width, i * this.gridSize);
    }
    for (let i = 1; i <= this.canvas.width / this.gridSize; i++) {
      context.moveTo(i * this.gridSize, 0);
      context.lineTo(i * this.gridSize, this.canvas.height);
    }
    context.stroke();
    context.closePath();
    context.restore();
  }

  // detect if (x, y) is inside this workbench
  public contains(x: number, y: number): boolean {
    return x > this.canvas.offsetLeft && x < this.canvas.offsetLeft + this.canvas.width && y > this.canvas.offsetTop && y < this.canvas.offsetTop + this.canvas.height;
  }

  public getWidth(): number {
    return this.canvas.width;
  }

  public getHeight(): number {
    return this.canvas.height;
  }

  private mouseDown = (e: MouseEvent): void => {
    e.preventDefault();
    let rect = this.canvas.getBoundingClientRect();
    let dx = e.clientX - rect.x;
    let dy = e.clientY - rect.y;
  }

  private mouseUp = (e: MouseEvent): void => {
    e.preventDefault();
    let rect = this.canvas.getBoundingClientRect();
    let dx = e.clientX - rect.x;
    let dy = e.clientY - rect.y;
    let context = this.canvas.getContext("2d");
  }

  private mouseMove = (e: MouseEvent): void => {
    e.preventDefault();
    let rect = this.canvas.getBoundingClientRect();
    let dx = e.clientX - rect.x;
    let dy = e.clientY - rect.y;
    let context = this.canvas.getContext("2d");
  }

  private openContextMenu = (e: MouseEvent): void => {
    e.preventDefault();
    let menu = document.getElementById("workbench-context-menu") as HTMLMenuElement;
    menu.style.left = e.clientX + "px";
    menu.style.top = e.clientY + "px";
    menu.classList.add("show-menu");
  };

}
