/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Block} from "./Block";
import {DataArray} from "./DataArray";
import {Potential1D} from "../physics/quantum/qm1d/Potential1D";

export class QuantumStationaryState1DBlock extends Block {

  private potential: Potential1D;
  private energyLevels: number[];
  private waveFunctions: DataArray[];
  private readonly portVX: Port; // port for importing potential
  private readonly portEL: Port; // port for exporting energy levels
  private readonly portWF: Port; // port for exporting wave functions

  static State = class {
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: QuantumStationaryState1DBlock) {
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "Q1D";
    this.name = "Quantum Stationary State 1D Block";
    this.color = "#C0DCFA";
    this.portVX = new Port(this, true, "VX", 0, this.height / 2, false);
    this.ports.push(this.portVX);
    let dh = this.height / 3;
    this.portEL = new Port(this, false, "EL", this.width, dh, true);
    this.portWF = new Port(this, false, "WF", this.width, 2 * dh, true);
    this.ports.push(this.portEL);
    this.ports.push(this.portWF);
    this.marginX = 30;
  }

  getCopy(): Block {
    let block = new QuantumStationaryState1DBlock("Quantum Stationary State 1D Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    return block;
  }

  destroy() {
  }

  refreshView(): void {
    super.refreshView();
    this.portEL.setX(this.width);
    this.portWF.setX(this.width);
    this.portVX.setY(this.height / 2);
    let dh = this.height / 3;
    this.portEL.setY(dh);
    this.portWF.setY(2 * dh);
  }

  updateModel(): void {
    let vx = this.portVX.getValue();
    if (vx === undefined) return;
    if (vx) {

    }
  }

}
