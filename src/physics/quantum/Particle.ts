/*
 * @author Charles Xie
 */

export class Particle {

  // the mass of the particle in the unit of 1/1000 a. u. By default, it is the mass of the electron.
  private mass: number = 0.910938188 / 1.66;

  // the charge of the particle, By default, it is the charge of the electron.
  private charge: number = -1;

  public Particle() {
  }

  public setCharge(charge: number): void {
    this.charge = charge;
  }

  public getCharge(): number {
    return this.charge;
  }

  public setMass(mass: number): void {
    this.mass = mass;
  }

  public getMass(): number {
    return this.mass;
  }

}
