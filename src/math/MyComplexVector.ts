/*
 * @author Charles Xie
 */

import {MyComplex} from "./MyComplex";

export class MyComplexVector {

  private values: MyComplex[];

  public constructor(n: number) {
    this.values = new Array(n);
  }

  public copy(): MyComplexVector {
    let v = new MyComplexVector(this.values.length);
    v.values = [...this.values];
    return v;
  }

  public length(): number {
    let s = 0;
    for (let x of this.values) {
      s += x.absSquare();
    }
    return Math.sqrt(s);
  }

  public normalize(): MyComplexVector {
    let length = this.length();
    if (length === 0) return null;
    let p = new MyComplexVector(this.values.length);
    length = 1 / length;
    for (let i = 0; i < p.size(); i++) {
      p.values[i] = this.values[i].scale(length);
    }
    return p;
  }

  public add(v: MyComplexVector): MyComplexVector {
    let n = Math.min(this.values.length, v.values.length);
    let p = new MyComplexVector(n);
    for (let i = 0; i < n; i++) {
      p.values[i] = this.values[i].plus(v.values[i]);
    }
    return p;
  }

  public subtract(v: MyComplexVector): MyComplexVector {
    let n = Math.min(this.values.length, v.values.length);
    let p = new MyComplexVector(n);
    for (let i = 0; i < n; i++) {
      p.values[i] = this.values[i].minus(v.values[i]);
    }
    return p;
  }

  public negate(): MyComplexVector {
    let p = new MyComplexVector(this.values.length);
    for (let i = 0; i < p.size(); i++) {
      p.values[i] = this.values[i].negate();
    }
    return p;
  }

  public scale(x: number): MyComplexVector {
    let p = new MyComplexVector(this.values.length);
    for (let i = 0; i < p.size(); i++) {
      p.values[i] = this.values[i].scale(x);
    }
    return p;
  }

  public shiftReal(x: number): MyComplexVector {
    let p = new MyComplexVector(this.values.length);
    for (let i = 0; i < p.size(); i++) {
      p.values[i] = this.values[i].shiftReal(x);
    }
    return p;
  }

  public shiftImaginary(x: number): MyComplexVector {
    let p = new MyComplexVector(this.values.length);
    for (let i = 0; i < p.size(); i++) {
      p.values[i] = this.values[i].shiftImaginary(x);
    }
    return p;
  }

  public setValue(index: number, value: MyComplex) {
    this.values[index] = value;
  }

  public getValue(index: number): MyComplex {
    return this.values[index];
  }

  public setValues(values: MyComplex[]): void {
    this.values = values;
  }

  public getValues(): MyComplex[] {
    return this.values;
  }

  public size(): number {
    return this.values.length;
  }

  public toString(): string {
    return JSON.stringify(this.values);
  }

  public toFixed(fractionDigits: number): string {
    let s: string = "";
    for (let x of this.values) {
      s += x.toFixed(fractionDigits) + " ";
    }
    return s.substring(0, s.length - 1);
  }

}
