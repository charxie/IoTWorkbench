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

  public transpose(): Matrix {
    let that = this;
    let t = new Matrix(this.getRows(), this.getColumns());
    t.setValues(Object.keys(this.values[0]).map(function (c) {
      return that.values.map(function (r) {
        return r[c];
      });
    }));
    return t;
  }

  public addMatrix(m: Matrix): Matrix {
    let result = new Matrix(this.getRows(), this.getColumns());
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        result.values[i][j] = this.values[i][j] + m.values[i][j];
      }
    }
    return result;
  }

  public subtractMatrix(m: Matrix): Matrix {
    let result = new Matrix(this.getRows(), this.getColumns());
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        result.values[i][j] = this.values[i][j] - m.values[i][j];
      }
    }
    return result;
  }

  public negateMatrix(): Matrix {
    let result = new Matrix(this.getRows(), this.getColumns());
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        result.values[i][j] = -this.values[i][j];
      }
    }
    return result;
  }

  public modulusMatrix(x: number): Matrix {
    let result = new Matrix(this.getRows(), this.getColumns());
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        result.values[i][j] = this.values[i][j] % x;
      }
    }
    return result;
  }

  public scaleMatrix(s: number): Matrix {
    let result = new Matrix(this.getRows(), this.getColumns());
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        result.values[i][j] = this.values[i][j] * s;
      }
    }
    return result;
  }

  public shiftMatrix(s: number): Matrix {
    let result = new Matrix(this.getRows(), this.getColumns());
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        result.values[i][j] = this.values[i][j] + s;
      }
    }
    return result;
  }

  public multiplyMatrix(m: Matrix): Matrix {
    let result = new Matrix(this.getRows(), this.getColumns());
    result.setValues(math.multiply(this.values, m.values));
    return result;
  }

  public multiplyVector(v: Vector): Vector {
    let result = new Vector(v.size());
    let tmp = math.multiply(this.values, v.getValues());
    for (let i = 0; i < tmp.length; i++) {
      result.setValue(i, JSON.parse(JSON.stringify(tmp[i])));
    }
    return result;
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
    let t: string;
    let zeros = "";
    for (let i = 0; i < fractionDigits; i++) {
      zeros += "0";
    }
    for (let x of this.values) {
      for (let y of x) {
        t = y.toFixed(fractionDigits);
        if (t === "-0." + zeros) t = "0." + zeros; // get rid of this negative sign if this number is rounded to zero
        s += t + " ";
      }
      s = s.substring(0, s.length - 1) + ",";
    }
    return s.substring(0, s.length - 1);
  }

  public toString(): string {
    return JSON.stringify(this.values);
  }

}
