/*
 * @author Charles Xie
 */

export abstract class Potential1D {

  protected xmin: number = -10;
  protected xmax: number = 10;
  protected values: number[];

  constructor(n: number, xmin: number, xmax: number) {
    this.values = new Array(n);
    this.xmin = xmin;
    this.xmax = xmax;
  }

  public getPotential(): number[] {
    return this.values;
  }

  public getValue(i: number): number {
    return this.values[i];
  }

  public getPoints(): number {
    return this.values.length;
  }

  public abstract getName(): string;

  public getVmin(): number {
    return Math.min(...this.values);
  }

  public getVmax(): number {
    return Math.max(...this.values);
  }

  public getXmin(): number {
    return this.xmin;
  }

  public getXmax(): number {
    return this.xmax;
  }

}
