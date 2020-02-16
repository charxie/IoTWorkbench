/*
 * @author Charles Xie
 */

export class Vector {

  private values: number[];

  public constructor(n: number) {
    this.values = new Array(n);
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

  public length(): number {
    return this.values.length;
  }

  public getCopy(): Vector {
    let v = new Vector(this.values.length);
    v.values = this.values.slice();
    return v;
  }

  public toString(): string {
    return JSON.stringify(this.values);
  }

}
