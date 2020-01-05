/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";

export class SeriesBlock extends Block {

  private readonly portX: Port;
  private readonly portD: Port;
  private readonly portN: Port;
  private readonly portS: Port;

  constructor(uid: string, x: number, y: number, width: number, height: number, name: string, symbol: string) {
    super(uid, x, y, width, height);
    this.name = name;
    this.symbol = symbol;
    this.color = "#006400";
    this.portX = new Port(this, true, "X", 0, this.height / 4, false);
    this.portD = new Port(this, true, "D", 0, this.height / 2, false);
    this.portN = new Port(this, true, "N", 0, this.height * 3 / 4, false);
    this.portS = new Port(this, false, "S", this.width, this.height / 2, true);
    this.ports.push(this.portX);
    this.ports.push(this.portD);
    this.ports.push(this.portN);
    this.ports.push(this.portS);
    this.margin = 15;
    let output = [];
    for (let i = 0; i < 10; i++) {
      output.push(i);
    }
    this.portS.setValue(output);
  }

  refreshView(): void {
    this.portS.setX(this.width);
    this.portS.setY(this.height / 2);
    this.portX.setY(this.height / 4);
    this.portD.setY(this.height / 2);
    this.portN.setY(this.height * 3 / 4);
  }

  updateModel(): void {
    let x0 = this.portX.getValue();
    let dx = this.portD.getValue();
    let n = this.portN.getValue();
    if (x0 == undefined) x0 = 0;
    if (dx == undefined) dx = 1;
    if (n == undefined) n = 10;
    let output = [];
    for (let i = 0; i < n; i++) {
      output.push(x0 + dx * i);
    }
    this.portS.setValue(output);
    this.updateConnectors();
  }

}
