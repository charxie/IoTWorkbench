/*
 * @author Charles Xie
 */

import clustering from "clusters";
import {Port} from "./Port";
import {Block} from "./Block";
import {flowchart} from "../Main";

export class ClusteringBlock extends Block {

  private numberOfIterations: number = 100;
  private method: string = "K-Means";
  private portI: Port;
  private portC: Port;
  private portO: Port[] = [];

  static State = class {
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly method: string;
    readonly numberOfOutputs: number;
    readonly numberOfIterations: number;

    constructor(block: ClusteringBlock) {
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.method = block.method;
      this.numberOfOutputs = block.portO.length;
      this.numberOfIterations = block.numberOfIterations;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "Clustering";
    this.name = "Clustering Block";
    this.color = "#CEAB37";
    this.portI = new Port(this, true, "IN", 0, this.height / 2, false);
    this.portC = new Port(this, false, "CT", this.width, this.height / 4, true);
    this.portO.push(new Port(this, false, "OA", this.width, this.height / 2, true));
    this.portO.push(new Port(this, false, "OB", this.width, this.height / 4 * 3, true));
    this.ports.push(this.portI);
    this.ports.push(this.portC);
    this.ports.push(this.portO[0]);
    this.ports.push(this.portO[1]);
    this.marginX = 25;
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
      let dh = this.height / (numberOfOutputs + 2);
      let firstPortName = "A";
      let k = firstPortName.charCodeAt(0);
      for (let i = 0; i < numberOfOutputs; i++) {
        let id = "O" + String.fromCharCode(k++);
        this.portO[i] = new Port(this, false, id, this.width, (i + 2) * dh, true);
        this.ports.push(this.portO[i]);
      }
    }
  }

  getNumberOfOutputs(): number {
    return this.portO.length;
  }

  setNumberOfIterations(numberOfIterations: number): void {
    this.numberOfIterations = numberOfIterations;
  }

  getNumberOfIterations(): number {
    return this.numberOfIterations;
  }

  setMethod(method: string): void {
    this.method = method;
  }

  getMethod(): string {
    return this.method;
  }

  getCopy(): Block {
    let block = new ClusteringBlock("Clustering Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    block.setNumberOfOutputs(this.getNumberOfOutputs());
    block.method = this.method;
    block.numberOfIterations = this.numberOfIterations;
    return block;
  }

  destroy() {
  }

  refreshView(): void {
    super.refreshView();
    this.portI.setY(this.height / 2);
    let dh = this.height / (this.portO.length + 2);
    this.portC.setX(this.width);
    this.portC.setY(dh);
    for (let i = 0; i < this.portO.length; i++) {
      this.portO[i].setX(this.width);
      this.portO[i].setY((i + 2) * dh);
    }
  }

  updateModel(): void {
    let v = this.portI.getValue();
    if (Array.isArray(v) && v.length > 1 && Array.isArray(v[0])) {
      switch (this.method) {
        case "K-Means":
          clustering.k(this.portO.length);
          clustering.iterations(this.numberOfIterations);
          clustering.data(v);
          let clusters = clustering.clusters();
          let centroids = [];
          for (let i = 0; i < clusters.length; i++) {
            this.portO[i].setValue(clusters[i].points);
            centroids.push(clusters[i].centroid);
          }
          this.portC.setValue(centroids);
          break;
      }
      this.updateConnectors();
    }
  }

}
