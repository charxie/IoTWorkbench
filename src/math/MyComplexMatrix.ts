/*
 * @author Charles Xie
 */

import {math} from "../Main";
import {MyComplex} from "./MyComplex";
import {MyComplexVector} from "./MyComplexVector";

export class MyComplexMatrix {

  private values: MyComplex[][];

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

  public transpose(): MyComplexMatrix {
    let that = this;
    let t = new MyComplexMatrix(this.getRows(), this.getColumns());
    t.setValues(Object.keys(this.values[0]).map(function (c) {
      return that.values.map(function (r) {
        return r[c];
      });
    }));
    return t;
  }

  public add(m: MyComplexMatrix): MyComplexMatrix {
    let result = new MyComplexMatrix(this.getRows(), this.getColumns());
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        result.values[i][j] = this.values[i][j].plus(m.values[i][j]);
      }
    }
    return result;
  }

  public subtract(m: MyComplexMatrix): MyComplexMatrix {
    let result = new MyComplexMatrix(this.getRows(), this.getColumns());
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        result.values[i][j] = this.values[i][j].minus(m.values[i][j]);
      }
    }
    return result;
  }

  public negate(): MyComplexMatrix {
    let result = new MyComplexMatrix(this.getRows(), this.getColumns());
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        result.values[i][j] = this.values[i][j].negate();
      }
    }
    return result;
  }

  public scale(s: number): MyComplexMatrix {
    let result = new MyComplexMatrix(this.getRows(), this.getColumns());
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        result.values[i][j] = this.values[i][j].scale(s);
      }
    }
    return result;
  }

  public shiftReal(s: number): MyComplexMatrix {
    let result = new MyComplexMatrix(this.getRows(), this.getColumns());
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        result.values[i][j] = this.values[i][j].shiftReal(s);
      }
    }
    return result;
  }

  public shiftImaginary(s: number): MyComplexMatrix {
    let result = new MyComplexMatrix(this.getRows(), this.getColumns());
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        result.values[i][j] = this.values[i][j].shiftImaginary(s);
      }
    }
    return result;
  }

  public multiply(m: MyComplexMatrix): MyComplexMatrix {
    let result = new MyComplexMatrix(this.getRows(), this.getColumns());
    result.setValues(math.multiply(this.values, m.values));
    return result;
  }

  public multiplyVector(v: MyComplexVector): MyComplexVector {
    let result = new MyComplexVector(v.size());
    let tmp = math.multiply(this.values, v.getValues());
    for (let i = 0; i < tmp.length; i++) {
      result.setValue(i, JSON.parse(JSON.stringify(tmp[i])));
    }
    return result;
  }

  public setValues(values: MyComplex[][]) {
    this.values = values;
  }

  public getValues(): MyComplex[][] {
    return this.values;
  }

  public setValue(row: number, col: number, value: MyComplex): void {
    this.values[row][col] = value;
  }

  public getValue(row: number, col: number): MyComplex {
    return this.values[row][col];
  }

  public setRowValuesByVector(row: number, v: MyComplexVector): void {
    for (let col = 0; col < this.getColumns(); col++) {
      if (v.getValue(col) !== undefined) {
        this.values[row][col] = v.getValue(col);
      }
    }
  }

  public setRowValuesByArray(row: number, v: MyComplex[]): void {
    for (let col = 0; col < this.getColumns(); col++) {
      if (v[col] !== undefined) {
        this.values[row][col] = v[col];
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
        if (t === "-0") t = "0";
        else if (t === "-0." + zeros) t = "0." + zeros; // get rid of this negative sign if this number is rounded to zero
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
