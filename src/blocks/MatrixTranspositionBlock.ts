/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {MyMatrix} from "../math/MyMatrix";
import {MyComplexMatrix} from "../math/MyComplexMatrix";
import {Util} from "../Util";

export class MatrixTranspositionBlock extends Block {

  private conjugate: boolean = false;
  private readonly portI: Port;
  private readonly portO: Port;

  static State = class {
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly conjugate: boolean;

    constructor(block: MatrixTranspositionBlock) {
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.conjugate = block.conjugate;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = "Matrix Transposition Block";
    this.symbol = "Mᵀ";
    this.color = "#C00";
    this.portI = new Port(this, true, "I", 0, this.height / 2, false);
    this.portO = new Port(this, false, "O", this.width, this.height / 2, true);
    this.ports.push(this.portI);
    this.ports.push(this.portO);
  }

  getCopy(): Block {
    let copy = new MatrixTranspositionBlock(this.name + " #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    copy.setConjugate(this.conjugate);
    return copy;
  }

  destroy(): void {
  }

  setConjugate(conjugate: boolean): void {
    this.conjugate = conjugate;
    this.symbol = conjugate ? "Mᴴ" : "Mᵀ";
  }

  isConjugate(): boolean {
    return this.conjugate;
  }

  refreshView(): void {
    super.refreshView();
    this.portI.setY(this.height / 2);
    this.portO.setX(this.width);
    this.portO.setY(this.height / 2);
  }

  updateModel(): void {
    let x = this.portI.getValue();
    if (x instanceof MyMatrix || x instanceof MyComplexMatrix) {
      this.portO.setValue(x.transpose());
    } else if (Array.isArray(x) && Array.isArray(x[0])) {
      if (Util.isComplex(x)) {
        let m = new MyComplexMatrix(x.length, x[0].length);
        m.setValues(x);
        this.portO.setValue(this.conjugate ? m.conjugateTranspose() : m.transpose());
      } else {
        let m = new MyMatrix(x.length, x[0].length);
        m.setValues(x);
        this.portO.setValue(m.transpose());
      }
    } else {
      this.portO.setValue(undefined);
    }
    this.updateConnectors();
  }

}
