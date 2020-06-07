/*
 * @author Charles Xie
 */

export class StationaryStateSolver {

  // this converter is used because we set the Planck constant / 2pi to be 1 in our differential equation.
  public static readonly MASS_UNIT_CONVERTER: number = 16.6 / 1.0545726;

  // this converter is used because we set the Planck constant / 2pi to be 1 in our differential equation.
  public static readonly ENERGY_UNIT_CONVERTER: number = 1.6 / 1.0545726;

  constructor() {
  }

}
