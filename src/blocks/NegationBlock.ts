/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";

export class NegationBlock extends Block {

  private portX: Port;
  private portR: Port;

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = "NOT Block";
    this.symbol = "NOT";
    this.color = "#B8860B";
    this.portX = new Port(this, true, "X", 0, this.height / 2, false);
    this.portR = new Port(this, false, "R", this.width, this.height / 2, true);
    this.ports.push(this.portX);
    this.ports.push(this.portR);
    this.margin = 15;
  }

  refresh(): void {
    super.refresh();
    this.portX.setY(this.height / 2);
    this.portR.setX(this.width);
    this.portR.setY(this.height / 2);
  }

  update(): void {
    super.update();
  }

}
