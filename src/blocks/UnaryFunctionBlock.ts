/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {FunctionBlock} from "./FunctionBlock";
import {math} from "../Main";

export class UnaryFunctionBlock extends FunctionBlock {

  private readonly portX: Port;
  private readonly portR: Port;

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "F(X)";
    this.name = "Unary Function Block";
    this.color = "#FF6347";
    this.portX = new Port(this, true, "X", 0, this.height / 2, false);
    this.portR = new Port(this, false, "R", this.width, this.height / 2, true);
    this.ports.push(this.portX);
    this.ports.push(this.portR);
    this.margin = 15;
  }

  refreshView(): void {
    this.portX.setY(this.height / 2);
    this.portR.setX(this.width);
    this.portR.setY(this.height / 2);
  }

  updateModel(): void {
    if (this.expression) {
      const node = math.parse(this.expression);
      const code = node.compile();
      let scope = {
        x: this.portX.getValue()
      };
      this.portR.setValue(code.evaluate(scope));
    } else {
      this.portR.setValue(NaN);
    }
    this.updateConnectors();
  }

}
