/*
 * @author Charles Xie
 */

import {Boundary} from "./Boundary";

export class AbsorbingBoundary extends Boundary {

  private lengthPercentage: number = 0.1;
  private absorption: number = 0.001;

  constructor() {
    super();
    this.direction = 'x';
  }

  public setLengthPercentage(lengthPercentage: number): void {
    this.lengthPercentage = lengthPercentage;
  }

  public getLengthPercentage(): number {
    return this.lengthPercentage;
  }

  public setAbsorption(absorption: number): void {
    this.absorption = absorption;
  }

  public getAbsorption(): number {
    return this.absorption;
  }

}
