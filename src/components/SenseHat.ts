/*
 * Digital twin for the Sense HAT
 *
 * @author Charles Xie
 */

import {Hat} from "./Hat";
import {Rectangle} from "../math/Rectangle";
import {contextMenus} from "../Main";

// @ts-ignore
import senseHatImage from "../img/sense-hat.png";

export class SenseHat extends Hat {

  private mouseOverObject: any;
  private boardImage: HTMLImageElement;

  constructor(canvasId: string, uid: string) {
    super(canvasId);

    this.uid = uid;
    this.canvas.addEventListener("mousedown", this.mouseDown, false);
    this.canvas.addEventListener("mouseup", this.mouseUp, false);
    this.canvas.addEventListener("mousemove", this.mouseMove, false);
    this.canvas.addEventListener('contextmenu', this.openContextMenu, false);

    this.handles.push(new Rectangle(5, 5, 30, 30));
    this.handles.push(new Rectangle(280, 5, 30, 30));
    this.handles.push(new Rectangle(280, 240, 30, 30));
    this.handles.push(new Rectangle(5, 240, 30, 30));

    this.boardImage = new Image();
    this.boardImage.src = senseHatImage;
    this.setY(20);

    this.updateFromFirebase();
  }

  public draw(): void {
    let ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    ctx.shadowOffsetX = 8;
    ctx.shadowOffsetY = 8;
    ctx.shadowColor = "rgb(96, 96, 96)";
    ctx.shadowBlur = 8;
    ctx.drawImage(this.boardImage, 0, 0);
    ctx.restore();
    this.drawToolTips();
  }

  private openContextMenu = (e: MouseEvent): void => {
    e.preventDefault();
    let rect = this.canvas.getBoundingClientRect();
    let dx = e.clientX - rect.x;
    let dy = e.clientY - rect.y;
    contextMenus.senseHat.hat = this;
    let menu = document.getElementById(contextMenus.senseHat.id) as HTMLMenuElement;
    menu.style.left = e.clientX + "px";
    menu.style.top = (e.clientY - document.getElementById("tabs").getBoundingClientRect().bottom) + "px";
    menu.classList.add("show-menu");
    let attachMenuItem = document.getElementById("sense-hat-attach-menu-item") as HTMLElement;
    let detachMenuItem = document.getElementById("sense-hat-detach-menu-item") as HTMLElement;
    if (this.raspberryPi != null) {
      attachMenuItem.className = "menu-item disabled";
      detachMenuItem.className = "menu-item";
    } else {
      let i = this.whichRaspberryPi();
      attachMenuItem.className = i >= 0 ? "menu-item" : "menu-item disabled";
      detachMenuItem.className = "menu-item disabled";
    }
  };

  private mouseDown = (e: MouseEvent): void => {
  };

  private mouseUp = (e: MouseEvent): void => {
  };

  private mouseMove = (e: MouseEvent): void => {

    e.preventDefault();

    let rect = this.canvas.getBoundingClientRect();
    let dx = e.clientX - rect.x;
    let dy = e.clientY - rect.y;

    if (this.handles[0].contains(dx, dy)) {
      this.mouseOverObject = this.handles[0];
      this.canvas.style.cursor = "move";
    } else if (this.handles[1].contains(dx, dy)) {
      this.mouseOverObject = this.handles[1];
      this.canvas.style.cursor = "move";
    } else if (this.handles[2].contains(dx, dy)) {
      this.mouseOverObject = this.handles[2];
      this.canvas.style.cursor = "move";
    } else if (this.handles[3].contains(dx, dy)) {
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
  }

  // by default, sensors transmit data every second. This can be adjusted through Firebase.
  updateFromFirebase(): void {
  }

}
