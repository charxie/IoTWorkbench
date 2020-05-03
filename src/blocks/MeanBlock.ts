/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Vector} from "../math/Vector";
import {UnivariateDescriptiveStatistics} from "../math/UnivariateDescriptiveStatistics";

export class MeanBlock extends Block {

  private type: string = "Arithmetic";
  private readonly portI: Port;
  private readonly portO: Port;

  static State = class {
    readonly symbol: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly type: string;

    constructor(block: MeanBlock) {
      this.symbol = block.symbol;
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.type = block.type;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = "Mean Block";
    this.symbol = "⟨x⟩";
    this.color = "#0CF";
    this.portI = new Port(this, true, "I", 0, this.height / 2, false);
    this.portO = new Port(this, false, "O", this.width, this.height / 2, true);
    this.ports.push(this.portI);
    this.ports.push(this.portO);
  }

  getCopy(): Block {
    let b = new MeanBlock(this.name + " #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    b.type = this.type;
    return b;
  }

  destroy(): void {
  }

  setType(type: string): void {
    this.type = type;
  }

  getType(): string {
    return this.type;
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
      let uds = new UnivariateDescriptiveStatistics(x.getValues());
      switch (this.type) {
        case "Arithmetic":
          this.portO.setValue(uds.arithmeticMean());
          break;
        case "Geometric":
          this.portO.setValue(uds.geometricMean());
          break;
        case "Harmonic":
          this.portO.setValue(uds.harmonicMean());
          break;
      }
    } else {
      if (Array.isArray(x)) {
        let uds = new UnivariateDescriptiveStatistics(x);
        switch (this.type) {
          case "Arithmetic":
            this.portO.setValue(uds.arithmeticMean());
            break;
          case "Geometric":
            this.portO.setValue(uds.geometricMean());
            break;
          case "Harmonic":
            this.portO.setValue(uds.harmonicMean());
            break;
        }
      } else {
        this.portO.setValue(x);
      }
    }
    this.updateConnectors();
  }

}
