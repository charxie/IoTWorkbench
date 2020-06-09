/*
 * @author Charles Xie
 */

export abstract class Boundary {

  public static readonly DEFAULT_BOUNDARY_CONDITION = 0;
  public static readonly ABSORBING_BOUNDARY_CONDITION = 1;

  protected direction: string;

  public setDirection(direction: string): void {
    this.direction = direction;
  }

  public getDirection(): string {
    return this.direction;
  }

}
