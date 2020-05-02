/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Vector} from "../math/Vector";

export class MedianBlock extends Block {

  private readonly portI: Port;
  private readonly portO: Port;

  static State = class {
    readonly symbol: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: MedianBlock) {
      this.symbol = block.symbol;
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = "Median Block";
    this.symbol = "Med(x)";
    this.color = "#FC3";
    this.portI = new Port(this, true, "I", 0, this.height / 2, false);
    this.portO = new Port(this, false, "O", this.width, this.height / 2, true);
    this.ports.push(this.portI);
    this.ports.push(this.portO);
  }

  getCopy(): Block {
    return new MedianBlock(this.name + " #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
  }

  destroy(): void {
  }

  refreshView(): void {
    super.refreshView();
    this.portI.setY(this.height / 2);
    this.portO.setX(this.width);
    this.portO.setY(this.height / 2);
  }

  updateModel(): void {
    let x = this.portI.getValue();
    if (x instanceof Vector) {
      this.portO.setValue(x.median());
    } else {
      if (Array.isArray(x)) {
        this.portO.setValue(x.median());
      } else {
        this.portO.setValue(x);
      }
    }
    this.updateConnectors();
  }

}
