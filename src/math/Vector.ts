/*
 * @author Charles Xie
 */

export class Vector {

  private values: number[];

  public constructor(n: number) {
    this.values = new Array(n);
  }

  public length(): number {
    let s = 0;
    for (let x of this.values) {
      s += x * x;
    }
    return Math.sqrt(s);
  }

  public normalize(): Vector {
    let length = this.length();
    if (length === 0) return null;
    let p = new Vector(this.values.length);
    for (let i = 0; i < p.size(); i++) {
      p.values[i] = this.values[i] / length;
    }
    return p;
  }

  public add(v: Vector): Vector {
    let n = Math.min(this.values.length, v.values.length);
    let p = new Vector(n);
    for (let i = 0; i < n; i++) {
      p.values[i] = this.values[i] + v.values[i];
    }
    return p;
  }

  public subtract(v: Vector): Vector {
    let n = Math.min(this.values.length, v.values.length);
    let p = new Vector(n);
    for (let i = 0; i < n; i++) {
      p.values[i] = this.values[i] - v.values[i];
    }
    return p;
  }

  public shift(x: number): Vector {
    let p = new Vector(this.values.length);
    for (let i = 0; i < p.size(); i++) {
      p.values[i] = this.values[i] + x;
    }
    return p;
  }

  public modulus(x: number): Vector {
    let p = new Vector(this.values.length);
    for (let i = 0; i < p.size(); i++) {
      p.values[i] = this.values[i] % x;
    }
    return p;
  }

  public negate(): Vector {
    let p = new Vector(this.values.length);
    for (let i = 0; i < p.size(); i++) {
      p.values[i] = -this.values[i];
    }
    return p;
  }

  public scale(x: number): Vector {
    let p = new Vector(this.values.length);
    for (let i = 0; i < p.size(); i++) {
      p.values[i] = this.values[i] * x;
    }
    return p;
  }

  public dot(v: Vector): number {
    let s = 0;
    let n = Math.min(this.values.length, v.values.length);
    for (let i = 0; i < n; i++) {
      s += this.values[i] * v.values[i];
    }
    return s;
  }

  public cross(v: Vector): Vector {
    if (this.values.length != 3 && v.values.length != 3) return null; // higher dimension not supported
    let p = new Vector(3);
    p.values[0] = this.values[1] * v.values[2] - this.values[2] * v.values[1];
    p.values[1] = this.values[2] * v.values[0] - this.values[0] * v.values[2];
    p.values[2] = this.values[0] * v.values[1] - this.values[1] * v.values[0];
    return p;
  }

  public setValue(index: number, value: number) {
    this.values[index] = value;
  }

  public getValue(index: number) {
    return this.values[index];
  }

  public setValues(values: number[]): void {
    this.values = values;
  }

  public getValues(): number[] {
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
