/*
 * @author Charles Xie
  See https://en.wikipedia.org/wiki/Test_functions_for_optimization
 */

export class TestFunctions {

  static goldsteinPrice(x: number, y: number): number {
    return (1 + (x + y + 1) * (x + y + 1) * (19 - 14 * x + 3 * x * x - 14 * y + 6 * x * y + 3 * y * y))
      * (30 + (2 * x - 3 * y) * (2 * x - 3 * y) * (18 - 32 * x + 12 * x * x + 48 * y - 36 * x * y + 27 * y * y));
  }

  static beale(x: number, y: number): number {
    return (1.5 - x + x * y) * (1.5 - x + x * y) + (2.25 - x + x * y * y) * (2.25 - x + x * y * y) + (2.625 - x + x * y * y * y) * (2.625 - x + x * y * y * y);
  }

  static booth(x: number, y: number): number {
    return (x + 2 * y - 7) * (x + 2 * y - 7) + (2 * x + y - 5) * (2 * x + y - 5);
  }

}
