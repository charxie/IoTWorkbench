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

  public toString(): string {
    return JSON.stringify(this.values);
  }

  public toFixed(fractionDigits: number): string {
    let s: string = "(";
    for (let x of this.values) {
      s += x.toFixed(fractionDigits) + ", ";
    }
    return s.substring(0, s.length - 2) + ")";
  }

}
