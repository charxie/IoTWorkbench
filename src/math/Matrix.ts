/*
 * @author Charles Xie
 */

import {math} from "../Main";
import {Vector} from "./Vector";

export class Matrix {

  private values: number[][];

  public constructor(rows: number, cols: number) {
    this.values = new Array(rows);
    for (let i = 0; i < rows; i++) {
      this.values[i] = new Array(cols);
    }
  }

  public getRows(): number {
    return this.values.length;
  }

  public getColumns(): number {
    return this.values[0].length;
  }

  public det(): number {
    return math.det(this.values);
  }

  public inv(): Matrix {
    let result = math.inv(this.values) as number[][];
    let m = new Matrix(result.length, result[0].length);
    m.setValues(result);
    return m;
  }

  public setValues(values: number[][]) {
    this.values = values;
  }

  public getValues(): number[][] {
    return this.values;
  }

  public setValue(row: number, col: number, value: number) {
    this.values[row][col] = value;
  }

  public getValue(row: number, col: number) {
    return this.values[row][col];
  }

  public setRowValues(row: number, v: Vector): void {
    for (let col = 0; col < this.getColumns(); col++) {
      if (v.getValue(col) !== undefined) {
        this.values[row][col] = v.getValue(col);
      }
    }
  }

  public toFixed(fractionDigits: number): string {
    let s: string = "";
    for (let x of this.values) {
      for (let y of x) {
        s += y.toFixed(fractionDigits) + "   ";
      }
      s = s.substring(0, s.length - 3) + ",";
    }
    return s.substring(0, s.length - 1);
  }

  public toString(): string {
    return JSON.stringify(this.values);
  }

}
