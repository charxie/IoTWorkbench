/*
 * @author Charles Xie
 */

export class Matrix {

  private values: number[][];

  constructor(m: number, n: number) {
    this.values = new Array(m);
    for (let i = 0; i < m; i++) {
      this.values[i] = new Array(n);
    }
  }

  setValue(i: number, j: number, value: number) {
    this.values[i][j] = value;
  }

  getValue(i: number, j: number) {
    return this.values[i][j];
  }

  public toString(): string {
    return JSON.stringify(this.values);
  }

}
