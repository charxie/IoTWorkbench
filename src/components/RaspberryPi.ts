/*
 * @author Charles Xie
 */

import {Hat} from "./Hat";
import {Mcu} from "./Mcu";
import {Rectangle} from "../math/Rectangle";
import {contextMenus, system} from "../Main"; // this is needed as we use augmented methods of canvas defined in Main.ts

// @ts-ignore
import raspberryPiImage from "../img/raspberry-pi.png";

export class RaspberryPi extends Mcu {

  hat: Hat;

  private boardImage: HTMLImageElement;
  private mouseOverObject: any;

  constructor(canvasId: string, uid: string) {
    super(canvasId);

    this.uid = uid;
    this.canvas.addEventListener("mousedown", this.mouseDown, false);
    this.canvas.addEventListener("mouseup", this.mouseUp, false);
    this.canvas.addEventListener("mousemove", this.mouseMove, false);
    this.canvas.addEventListener('contextmenu', this.openContextMenu, false);

    this.handles.push(new Rectangle(5, 5, 30, 30));
    this.handles.push(new Rectangle(390, 5, 30, 30));
    this.handles.push(new Rectangle(390, 245, 30, 30));
    this.handles.push(new Rectangle(5, 245, 30, 30));

    this.boardImage = new Image();
    this.boardImage.src = raspberryPiImage;
    this.setX(20);
    this.setY(20);

    this.updateFromFirebase();
  }

  public draw(): void {
    let ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 10;
    ctx.shadowColor = "rgb(96, 96, 96)";
    ctx.shadowBlur = 10;
    ctx.drawImage(this.boardImage, 0, 0);
    ctx.restore();
    this.drawToolTips();
  }

  private openContextMenu = (e: MouseEvent): void => {
    e.preventDefault();
    let menu = document.getElementById(contextMenus.raspberryPi.id) as HTMLMenuElement;
    menu.style.left = e.clientX + "px";
    menu.style.top = (e.clientY - document.getElementById("tabs").getBoundingClientRect().bottom) + "px";
    menu.classList.add("show-menu");
    contextMenus.raspberryPi.raspberryPi = this;
  };

  private mouseDown = (e: MouseEvent): void => {
  };

  private mouseUp = (e: MouseEvent): void => {
  };

  private mouseMove = (e: MouseEvent): void => {
    //e.preventDefault();
    let x = e.offsetX;
    let y = e.offsetY;
    if (this.handles[0].contains(x, y)) {
      this.mouseOverObject = this.handles[0];
      this.canvas.style.cursor = "move";
    } else if (this.handles[1].contains(x, y)) {
      this.mouseOverObject = this.handles[1];
      this.canvas.style.cursor = "move";
    } else if (this.handles[2].contains(x, y)) {
      this.mouseOverObject = this.handles[2];
      this.canvas.style.cursor = "move";
    } else if (this.handles[3].contains(x, y)) {
      this.mouseOverObject = this.handles[3];
      this.canvas.style.cursor = "move";
    } else {
      this.mouseOverObject = null;
      this.canvas.style.cursor = "default";
    }
    this.draw();
  };

  drawToolTips(): void {
    let context = this.canvas.getContext('2d');
    let x = 0;
    let y = -25;
    if (this.mouseOverObject == this.handles[0]) {
      this.drawHandle(this.mouseOverObject, context);
      x += this.handles[0].getXmax() + 20;
      y += this.handles[0].getYmax() + 30;
      context.drawTooltip(x, y, 20, 8, 10, 'Upper-left handle', true);
    } else if (this.mouseOverObject == this.handles[1]) {
      this.drawHandle(this.mouseOverObject, context);
      x += this.handles[1].getXmin() - 30;
      y += this.handles[1].getYmax() + 30;
      context.drawTooltip(x, y, 20, 8, 10, 'Upper-right handle', true);
    } else if (this.mouseOverObject == this.handles[2]) {
      this.drawHandle(this.mouseOverObject, context);
      x += this.handles[2].getXmin() - 30;
      y += this.handles[2].getYmin() - 5;
      context.drawTooltip(x, y, 20, 8, 10, 'Lower-right handle', true);
    } else if (this.mouseOverObject == this.handles[3]) {
      this.drawHandle(this.mouseOverObject, context);
      x += this.handles[3].getXmax() + 20;
      y += this.handles[3].getYmin() - 5;
      context.drawTooltip(x, y, 20, 8, 10, 'Lower-left handle', true);
    }
  }

  updateFirebase(value): void {
    // TODO
  }

  updateFromFirebase(): void {
    // TODO
  }

}
