/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Block} from "./Block";
import {flowchart, isNumber} from "../Main";
import {LabeledData} from "./LabeledData";
import {MyVector} from "../math/MyVector";

export class KNNClassifierBlock extends Block {

  private k: number = 1;
  private weighted: boolean = false;
  private distanceType: string = "Euclidean";
  private labels: string[] = [];
  private portI: Port;
  private portK: Port;
  private portA: Port[] = [];
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
    readonly labels: string[] = [];

    constructor(block: KNNClassifierBlock) {
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.k = block.k;
      this.weighted = block.weighted;
      this.distanceType = block.distanceType;
      this.numberOfInputs = block.portA.length;
      this.labels = [...block.labels];
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "KNN";
    this.name = "KNN Classifier Block";
    this.color = "#BCEA73";
    this.portI = new Port(this, true, "I", 0, this.height / 5, false);
    this.portK = new Port(this, true, "K", 0, this.height / 5 * 2, false);
    this.portA.push(new Port(this, true, "A", 0, this.height / 5 * 3, false));
    this.portA.push(new Port(this, true, "B", 0, this.height / 5 * 4, false));
    this.portO = new Port(this, false, "O", this.width, this.height / 2, true);
    this.ports.push(this.portI);
    this.ports.push(this.portK);
    this.ports.push(this.portA[0]);
    this.ports.push(this.portA[1]);
    this.ports.push(this.portO);
    this.labels.push("A");
    this.labels.push("B");
    this.marginX = 20;
  }

  setNumberOfInputs(numberOfInputs: number): void {
    if (this.portA.length !== numberOfInputs) {
      if (this.portA) {
        for (let p of this.portA) { // disconnect all the port connectors as the ports will be recreated
          flowchart.removeAllConnectors(p);
        }
        for (let p of this.portA) {
          this.ports.removeItem(p);
        }
      }
      this.portA = new Array(numberOfInputs);
      this.labels.length = 0;
      let dh = this.height / (numberOfInputs + 3);
      let firstPortName = "A";
      let k = firstPortName.charCodeAt(0);
      for (let i = 0; i < numberOfInputs; i++) {
        let id = String.fromCharCode(k++);
        if (id === "I" || id === "K" || id === "O") id = String.fromCharCode(k++);
        this.portA[i] = new Port(this, true, id, 0, (i + 2) * dh, false);
        this.ports.push(this.portA[i]);
        this.labels.push(this.portA[i].getUid());
      }
    }
  }

  getNumberOfInputs(): number {
    return this.portA.length;
  }

  getInputPorts(): Port[] {
    return this.portA;
  }

  setLabel(i: number, label: string): void {
    this.labels[i] = label;
  }

  getLabel(i: number): string {
    return this.labels[i];
  }

  setLabels(labels: string[]): void {
    this.labels = [...labels];
  }

  getLabels(): string[] {
    return [...this.labels];
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
    let copy = new KNNClassifierBlock("KNN Classifier Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    copy.setNumberOfInputs(this.getNumberOfInputs());
    copy.setK(this.k);
    copy.setWeighted(this.weighted);
    copy.setDistanceType(this.distanceType);
    copy.labels = [...this.labels];
    return copy;
  }

  destroy() {
  }

  refreshView(): void {
    super.refreshView();
    this.portO.setX(this.width);
    this.portO.setY(this.height / 2);
    let dh = this.height / (this.portA.length + 3);
    this.portI.setY(dh);
    this.portK.setY(2 * dh);
    for (let i = 0; i < this.portA.length; i++) {
      this.portA[i].setY((i + 3) * dh);
    }
  }

  updateModel(): void {
    let kin = this.portK.getValue();
    if (kin !== undefined) this.k = kin;
    let input = this.portI.getValue();
    if (input === undefined) return;
    let arr: LabeledData[] = [];
    for (let p of this.portA) {
      let v = p.getValue();
      if (v !== undefined) {
        if (Array.isArray(v)) {
          for (let x of v) {
            arr.push(new LabeledData(x, p.getUid()));
          }
        } else {
          if (isNumber(v)) {
            arr.push(new LabeledData(v, p.getUid()));
          }
        }
      }
    }
    arr.sort((a, b) => {
      if (Array.isArray(a.data) && Array.isArray(b.data)) {
        if (Array.isArray(input) && input[0].constructor === Array) { // 2D array from an array input
          let n = Math.min(input[0].length, a.data.length, b.data.length);
          let di;
          let da = 0;
          let db = 0;
          for (let i = 0; i < n; i++) {
            di = input[0][i] - a.data[i];
            da += di * di;
            di = input[0][i] - b.data[i];
            db += di * di;
          }
          return da - db;
        } else if (input instanceof MyVector) { // vector
          let n = Math.min(input.size(), a.data.length, b.data.length);
          let di;
          let da = 0;
          let db = 0;
          for (let i = 0; i < n; i++) {
            di = input.getValue(i) - a.data[i];
            da += di * di;
            di = input.getValue(i) - b.data[i];
            db += di * di;
          }
          return da - db;
        } else if (Array.isArray(input)) { // 1D array
          let n = Math.min(input.length, a.data.length, b.data.length);
          let di;
          let da = 0;
          let db = 0;
          for (let i = 0; i < n; i++) {
            di = input[i] - a.data[i];
            da += di * di;
            di = input[i] - b.data[i];
            db += di * di;
          }
          return da - db;
        }
      } else {
        if (isNumber(input) && isNumber(a.data) && isNumber(b.data)) {
          return Math.abs(input - a.data) - Math.abs(input - b.data);
        }
      }
      throw new Error("Cannot sort");
    });
    let count = new Array(this.portA.length);
    let k = Math.min(this.k, arr.length);
    for (let i = 0; i < count.length; i++) {
      count[i] = 0;
      for (let j = 0; j < k; j++) {
        if (arr[j].label === this.portA[i].getUid()) {
          if (this.weighted) {
            let weight = 0;
            if (Array.isArray(arr[j].data)) {
              if (Array.isArray(input)) {
                let n = Math.min(arr[j].data.length, input.length);
                let di;
                for (let q = 0; q < n; q++) {
                  di = arr[j].data[q] - input[q];
                  weight += di * di;
                }
                weight = Math.sqrt(weight);
              } else if (input instanceof MyVector) {
                let n = Math.min(arr[j].data.length, input.size());
                let di;
                for (let q = 0; q < n; q++) {
                  di = arr[j].data[q] - input.getValue(q);
                  weight += di * di;
                }
                weight = Math.sqrt(weight);
              }
            } else {
              if (isNumber(arr[j].data) && isNumber(input)) {
                weight = Math.abs(arr[j].data - input);
              }
            }
            if (Math.abs(weight) < 0.000001) {
              weight = 1000000;
            } else {
              weight = 1 / weight;
            }
            count[i] += weight;
          } else {
            count[i]++;
          }
        }
      }
    }
    let max = Math.max(...count);
    let result;
    for (let i = 0; i < count.length; i++) {
      if (count[i] === max) {
        result = this.labels[i];
        break;
      }
    }
    this.portO.setValue(result);
    this.updateConnectors();
  }

}
