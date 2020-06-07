/*
 * @author Charles Xie
 */

export abstract class Potential1D {

  protected xmin: number = -10;
  protected xmax: number = 10;
  protected value: number[];

  constructor(n: number, xmin: number, xmax: number) {
    this.value = new Array(n);
    this.xmin = xmin;
    this.xmax = xmax;
  }

  public getPotential(): number[] {
    return this.value;
  }

  public abstract getName(): string;

  public getXmin(): number {
    return this.xmin;
  }

  public getXmax(): number {
    return this.xmax;
  }

}
