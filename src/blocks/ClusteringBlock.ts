/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Block} from "./Block";
import {flowchart} from "../Main";

export class ClusteringBlock extends Block {

  private method: string = "K-Mean";
  private portI: Port[] = [];
  private portO: Port[] = [];

  static State = class {
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly marginX: number;
    readonly method: string;
    readonly numberOfInputs: number;
    readonly numberOfOutputs: number;

    constructor(block: ClusteringBlock) {
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.marginX = block.marginX;
      this.method = block.method;
      this.numberOfInputs = block.portI.length;
      this.numberOfOutputs = block.portO.length;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "Clustering";
    this.name = "Clustering Block";
    this.color = "#CEAB37";
    this.portI.push(new Port(this, true, "IA", 0, this.height / 3, false));
    this.portI.push(new Port(this, true, "IB", 0, this.height / 3 * 2, false));
    this.portO.push(new Port(this, false, "OA", this.width, this.height / 3, true));
    this.portO.push(new Port(this, false, "OB", this.width, this.height / 3 * 2, true));
    this.ports.push(this.portI[0]);
    this.ports.push(this.portI[1]);
    this.ports.push(this.portO[0]);
    this.ports.push(this.portO[1]);
    this.marginX = 25;
  }

  setNumberOfInputs(numberOfInputPorts: number): void {
    if (this.portI.length !== numberOfInputPorts) {
      if (this.portI) {
        for (let p of this.portI) { // disconnect all the port connectors as the ports will be recreated
          flowchart.removeAllConnectors(p);
        }
        for (let p of this.portI) {
          this.ports.removeItem(p);
        }
      }
      this.portI = new Array(numberOfInputPorts);
      let dh = this.height / (numberOfInputPorts + 1);
      let firstPortName = "A";
      let k = firstPortName.charCodeAt(0);
      for (let i = 0; i < numberOfInputPorts; i++) {
        let id = "I" + String.fromCharCode(k++);
        this.portI[i] = new Port(this, true, id, 0, (i + 1) * dh, false);
        this.ports.push(this.portI[i]);
      }
    }
  }

  getNumberOfInputs(): number {
    return this.portI.length;
  }

  setNumberOfOutputs(numberOfOutputs: number): void {
    if (this.portO.length !== numberOfOutputs) {
      if (this.portO) {
        for (let p of this.portO) { // disconnect all the port connectors as the ports will be recreated
          flowchart.removeAllConnectors(p);
        }
        for (let p of this.portO) {
          this.ports.removeItem(p);
        }
      }
      this.portO = new Array(numberOfOutputs);
      let dh = this.height / (numberOfOutputs + 1);
      let firstPortName = "A";
      let k = firstPortName.charCodeAt(0);
      for (let i = 0; i < numberOfOutputs; i++) {
        let id = "O" + String.fromCharCode(k++);
        this.portO[i] = new Port(this, false, id, this.width, (i + 1) * dh, true);
        this.ports.push(this.portO[i]);
      }
    }
  }

  getNumberOfOutputs(): number {
    return this.portO.length;
  }

  setMethod(method: string): void {
    this.method = method;
  }

  getMethod(): string {
    return this.method;
  }

  getCopy(): Block {
    let block = new ClusteringBlock("Clustering Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    block.setNumberOfInputs(this.getNumberOfInputs());
    block.setNumberOfOutputs(this.getNumberOfOutputs());
    return block;
  }

  destroy() {
  }

  refreshView(): void {
    super.refreshView();
    let dh = this.height / (this.portI.length + 1);
    for (let i = 0; i < this.portI.length; i++) {
      this.portI[i].setX(0);
      this.portI[i].setY((i + 1) * dh);
    }
    dh = this.height / (this.portO.length + 1);
    for (let i = 0; i < this.portO.length; i++) {
      this.portO[i].setX(this.width);
      this.portO[i].setY((i + 1) * dh);
    }
  }

  updateModel(): void {
    this.updateConnectors();
  }

}
