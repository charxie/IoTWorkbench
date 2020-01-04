/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";

export class ConditionalStatementBlock extends Block {

  private readonly portA: Port;
  private readonly portT: Port;
  private readonly portF: Port;

  constructor(uid: string, x: number, y: number, width: number, height: number, name: string, symbol: string) {
    super(uid, x, y, width, height);
    this.name = name;
    this.symbol = symbol;
    this.color = "#696969";
    this.portA = new Port(this, true, "A", 0, this.height / 2, false);
    this.portT = new Port(this, false, "T", this.width, this.height / 3, true);
    this.portF = new Port(this, false, "F", this.width, this.height * 2 / 3, true);
    this.ports.push(this.portA);
    this.ports.push(this.portT);
    this.ports.push(this.portF);
    this.margin = 15;
  }

  refreshView(): void {
    this.portA.setY(this.height / 2);
    this.portT.setX(this.width);
    this.portT.setY(this.height / 3);
    this.portF.setX(this.width);
    this.portF.setY(this.height * 2 / 3);
  }

  updateModel(): void {
    let a: boolean = this.portA.getValue() != 0;
    this.portT.setValue(a ? 1 : 0);
    this.portF.setValue(a ? 0 : 1);
    this.updateConnectors();
  }

}
