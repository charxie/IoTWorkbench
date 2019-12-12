/*
 * @author Charles Xie
 */

import {Board} from "./Board";

// @ts-ignore
import raspberryPiImage from "./img/raspberry-pi.png";

export class RaspberryPi extends Board {

  private boardImage: HTMLImageElement;

  constructor(canvasId: string) {
    super(canvasId);

    this.canvas.addEventListener("mousedown", this.mouseDown, false);
    this.canvas.addEventListener("mouseup", this.mouseUp, false);
    this.canvas.addEventListener("mousemove", this.mouseMove, false);
    this.canvas.addEventListener('contextmenu', this.openContextMenu, false);

    this.boardImage = new Image();
    this.boardImage.src = raspberryPiImage;

    this.updateFromFirebase();
  }

  public draw(): void {
    let context = this.canvas.getContext('2d');
    context.drawImage(this.boardImage, 0, 0);
    this.drawToolTips();
  }

  private openContextMenu = (e: MouseEvent): void => {
    e.preventDefault();
    let menu = document.getElementById("raspberry-pi-context-menu") as HTMLMenuElement;
    menu.style.left = e.clientX + "px";
    menu.style.top = e.clientY + "px";
    menu.classList.add("show-menu");
  };

  private mouseDown = (e: MouseEvent): void => {
    e.preventDefault();
  };

  private mouseUp = (e: MouseEvent): void => {
    e.preventDefault();
  };

  private mouseMove = (e: MouseEvent): void => {
    e.preventDefault();
  };

  drawToolTips(): void {
    // TODO
  }

  updateFirebase(value): void {
    // TODO
  }

  updateFromFirebase(): void {
    // TODO
  }

}
