/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Block} from "./Block";
import {flowchart} from "../Main";

export class KNNClassifierBlock extends Block {

  private k: number = 1;
  private weighted: boolean = false;
  private distanceType: string = "Euclidean";
  private portI: Port[] = [];
  private portK: Port;
  private portO: Port;

  static State = class {
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly k: number;
    readonly weighted: boolean;
    readonly distanceType: string;
    readonly numberOfInputs: number;

    constructor(block: KNNClassifierBlock) {
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.k = block.k;
      this.weighted = block.weighted;
      this.distanceType = block.distanceType;
      this.numberOfInputs = block.portI.length;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "KNN";
    this.name = "KNN Classifier Block";
    this.color = "#BCEA73";
    this.portK = new Port(this, true, "K", 0, this.height / 4, false);
    this.portI.push(new Port(this, true, "A", 0, this.height / 2, false));
    this.portI.push(new Port(this, true, "B", 0, this.height / 4 * 3, false));
    this.portO = new Port(this, false, "O", this.width, this.height / 4, true);
    this.ports.push(this.portK);
    this.ports.push(this.portI[0]);
    this.ports.push(this.portI[1]);
    this.ports.push(this.portO);
  }

  setNumberOfInputs(numberOfInputs: number): void {
    if (this.portI.length !== numberOfInputs) {
      if (this.portI) {
        for (let p of this.portI) { // disconnect all the port connectors as the ports will be recreated
          flowchart.removeAllConnectors(p);
        }
        for (let p of this.portI) {
          this.ports.removeItem(p);
        }
      }
      this.portI = new Array(numberOfInputs);
      let dh = this.height / (numberOfInputs + 2);
      let firstPortName = "A";
      let k = firstPortName.charCodeAt(0);
      for (let i = 0; i < numberOfInputs; i++) {
        let id = String.fromCharCode(k++);
        if (id === "K" || id === "O") id = String.fromCharCode(k++);
        this.portI[i] = new Port(this, true, id, 0, (i + 2) * dh, false);
        this.ports.push(this.portI[i]);
      }
    }
  }

  getNumberOfInputs(): number {
    return this.portI.length;
  }

  setK(k: number): void {
    this.k = k;
  }

  getK(): number {
    return this.k;
  }

  setWeighted(weighted: boolean): void {
    this.weighted = weighted;
  }

  isWeighted(): boolean {
    return this.weighted;
  }

  setDistanceType(distanceType: string): void {
    this.distanceType = distanceType;
  }

  getDistanceType(): string {
    return this.distanceType;
  }

  getCopy(): Block {
    let block = new KNNClassifierBlock("KNN Classifier Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    block.setNumberOfInputs(this.getNumberOfInputs());
    block.setK(this.k);
    block.setWeighted(this.weighted);
    block.setDistanceType(this.distanceType);
    return block;
  }

  destroy() {
  }

  refreshView(): void {
    super.refreshView();
    this.portO.setX(this.width);
    this.portO.setY(this.height / 2);
    let dh = this.height / (this.portI.length + 2);
    this.portK.setY(dh);
    for (let i = 0; i < this.portI.length; i++) {
      this.portI[i].setY((i + 2) * dh);
    }
  }

  updateModel(): void {
    this.updateConnectors();
  }

}
