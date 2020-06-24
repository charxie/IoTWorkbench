/*
 * @author Charles Xie
 */

import {math} from "../Main";
import {MyComplex} from "./MyComplex";
import {MyComplexVector} from "./MyComplexVector";
import {MyMatrix} from "./MyMatrix";

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

  public conjugateTranspose(): MyComplexMatrix {
    let that = this;
    let t = new MyComplexMatrix(this.getRows(), this.getColumns());
    t.setValues(Object.keys(this.values[0]).map(function (c) {
      return that.values.map(function (r) {
        if (r[c] instanceof MyComplex) return r[c].conjugate();
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
    let m1r = this.getRealPart();
    let m1i = this.getImaginaryPart();
    let m2r = m.getRealPart();
    let m2i = m.getImaginaryPart();
    let m1rm2r = math.multiply(m1r.values, m2r.values); // real
    let m1im2i = math.multiply(m1i.values, m2i.values); // real
    let m1rm2i = math.multiply(m1r.values, m2i.values); // imaginary
    let m1im2r = math.multiply(m1i.values, m2r.values); // imaginary
    let result = new MyComplexMatrix(this.getRows(), this.getColumns());
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        result.setValue(i, j, new MyComplex(m1rm2r[i][j] - m1im2i[i][j], m1rm2i[i][j] + m1im2r[i][j]));
      }
    }
    return result;
  }

  public getRealPart(): MyMatrix {
    let r = new MyMatrix(this.getRows(), this.getColumns());
    let val;
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        val = this.values[i][j];
        r.setValue(i, j, val instanceof MyComplex ? val.re : val);
      }
    }
    return r;
  }

  public getImaginaryPart(): MyMatrix {
    let r = new MyMatrix(this.getRows(), this.getColumns());
    let val;
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        val = this.values[i][j];
        r.setValue(i, j, val instanceof MyComplex ? val.im : 0);
      }
    }
    return r;
  }

  public multiplyVector(v: MyComplexVector): MyComplexVector {
    let result = new MyComplexVector(v.size());
    let mr = this.getRealPart();
    let mi = this.getImaginaryPart();
    let vr = v.getRealPart();
    let vi = v.getImaginaryPart();
    let tmp = math.multiply(mr.getValues(), vr.getValues());
    for (let i = 0; i < tmp.length; i++) {
      result.setValue(i, new MyComplex(JSON.parse(JSON.stringify(tmp[i])), 0));
    }
    tmp = math.multiply(mi.getValues(), vi.getValues());
    for (let i = 0; i < tmp.length; i++) {
      result.setValue(i, new MyComplex(result.getValue(i).re - JSON.parse(JSON.stringify(tmp[i])), 0));
    }
    tmp = math.multiply(mr.getValues(), vi.getValues());
    for (let i = 0; i < tmp.length; i++) {
      result.setValue(i, new MyComplex(result.getValue(i).re, JSON.parse(JSON.stringify(tmp[i]))));
    }
    tmp = math.multiply(mi.getValues(), vr.getValues());
    for (let i = 0; i < tmp.length; i++) {
      result.setValue(i, new MyComplex(result.getValue(i).re, result.getValue(i).im + JSON.parse(JSON.stringify(tmp[i]))));
    }
    return result;
  }

  public setValues(values: MyComplex[][]) {
    this.values = values;
  }

  public setValuesAny(values: any[][]) {
    this.values = new Array(values.length);
    for (let i = 0; i < values.length; i++) {
      this.values[i] = new Array(values[i].length);
      for (let j = 0; j < values[i].length; j++) {
        if (values[i][j] instanceof MyComplex) {
          this.values[i][j] = values[i][j].clone();
        } else if (typeof values[i][j] === "number") {
          this.values[i][j] = new MyComplex(values[i][j], 0);
        }
      }
    }
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
