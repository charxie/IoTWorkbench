/*
 * @author Charles Xie
  See https://en.wikipedia.org/wiki/Test_functions_for_optimization
 */

export class TestFunctions {

  static goldsteinPrice(x: number, y: number): number {
    return (1 + Math.pow(x + y + 1, 2) * (19 - 14 * x + 3 * x * x - 14 * y + 6 * x * x + 3 * y * y))
      * (30 + Math.pow(2 * x - 3 * y, 2) * (18 - 32 * x + 12 * x * x + 48 * y - 36 * x * y + 27 * y * y));
  }

}
