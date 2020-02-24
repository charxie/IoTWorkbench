/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Block} from "./Block";
import {flowchart} from "../Main";
import {Random} from "../math/Random";

export class RandomNumberGeneratorBlock extends Block {

  private numberOfOutputs: number = 1;
  private type: string = "Uniform";
  private readonly portI: Port;
  private portO: Port[];

  static State = class {
    readonly uid: string;
    readonly name: string;
    readonly numberOfOutputs: number;
    readonly type: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: RandomNumberGeneratorBlock) {
      this.uid = block.uid;
      this.name = block.name;
      this.numberOfOutputs = block.numberOfOutputs;
      this.type = block.type;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "Rand";
    this.name = "Random Number Generator Block";
    this.type = "Uniform";
    this.color = "#99C";
    this.portI = new Port(this, true, "I", 0, this.height / 2, false);
    this.ports.push(this.portI);
    this.margin = 15;
    this.setOutputPorts();
  }

  private setOutputPorts(): void {
    if (this.portO === undefined || this.portO.length !== this.numberOfOutputs) {
      if (this.portO) {
        for (let p of this.portO) { // disconnect all the port connectors as the ports will be recreated
          flowchart.removeAllConnectors(p);
        }
        for (let p of this.portO) {
          this.ports.pop();
        }
      }
      this.portO = new Array(this.numberOfOutputs);
      let dh = this.height / (this.numberOfOutputs + 1);
      let nm = "A";
      for (let i = 0; i < this.numberOfOutputs; i++) {
        this.portO[i] = new Port(this, false, String.fromCharCode(nm.charCodeAt(0) + i), this.width, (i + 1) * dh, true);
        this.ports.push(this.portO[i]);
      }
    }
  }

  getCopy(): Block {
    let block = new RandomNumberGeneratorBlock("Random Number Generator Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    block.type = this.type;
    block.setNumberOfOutputs(this.numberOfOutputs);
    return block;
  }

  destroy(): void {
  }

  setName(name: string): void {
    super.setName(name);
    this.symbol = name;
  }

  setType(type: string): void {
    this.type = type;
  }

  getType(): string {
    return this.type;
  }

  setNumberOfOutputs(numberOfOutputs: number): void {
    this.numberOfOutputs = numberOfOutputs;
    this.setOutputPorts();
  }

  getNumberOfOutputs(): number {
    return this.numberOfOutputs;
  }

  refreshView(): void {
    super.refreshView();
    this.portI.setY(this.height / 2);
    let dh = this.height / (this.numberOfOutputs + 1);
    for (let i = 0; i < this.numberOfOutputs; i++) {
      this.portO[i].setX(this.width);
      this.portO[i].setY((i + 1) * dh);
    }
  }

  updateModel(): void {
    let x = this.portI.getValue();
    if (x !== undefined) {
      let n = this.portO.length;
      switch (this.type) {
        case "Uniform":
          for (let p of this.portO) {
            p.setValue(Math.random());
          }
          break;
        case "Gaussian":
          let even = (n % 2) == 0;
          if (even) {
            for (let i = 0; i < n / 2; i++) {
              let r = Random.twoGaussians();
              this.portO[2 * i].setValue(r[0]);
              this.portO[2 * i + 1].setValue(r[1]);
            }
          } else {
            this.portO[0].setValue(Random.gaussian());
            if (n > 1) {
              for (let i = 0; i < (n - 1) / 2; i++) {
                let r = Random.twoGaussians();
                this.portO[2 * i + 1].setValue(r[0]);
                this.portO[2 * i + 2].setValue(r[1]);
              }
            }
          }
          break;
      }
      this.updateConnectors();
    } else {
      for (let p of this.portO) {
        p.setValue(undefined);
      }
    }
  }

}
