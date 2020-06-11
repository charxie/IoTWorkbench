/**
 * The tridiagonal matrix algorithm (TDMA), also known as the Thomas algorithm, is a simplified form of Gaussian elimination that can be used to solve tridiagonal systems of equations. A tridiagonal system for n unknowns may be written as
 *
 * a[i]*x[i-1]+b[i]*x[i]+c[i]*x[i+1]=d[i], where a[0]=0 and c[n-1]=0.
 *
 * @author Charles Xie
 *
 */
import {MyComplex} from "./MyComplex";

export class Tdma {

  private Tdma() {
  }

  /*
   * Real number version. c and d are modified during the operation. All input arrays must be of the same size.
   *
   * @param a       the subdiagonal elements
   * @param b       the diagonal elements
   * @param c       the superdiagonal elements
   * @param d       the right-hand-side vector
   */
  public static solveReal(a: number[], b: number[], c: number[], d: number[]): number[] {
    let n = d.length;
    let temp;
    c[0] /= b[0];
    d[0] /= b[0];
    for (let i = 1; i < n; i++) {
      temp = 1.0 / (b[i] - c[i - 1] * a[i]);
      c[i] *= temp; // redundant at the last step as c[n-1]=0.
      d[i] = (d[i] - d[i - 1] * a[i]) * temp;
    }
    let x: number[] = new Array(n);
    x[n - 1] = d[n - 1];
    for (let i = n - 2; i >= 0; i--) {
      x[i] = d[i] - c[i] * x[i + 1];
    }
    return x;
  }

  /*
   * Complex number version. c and d are modified during the operation. All input arrays must be of the same size.
   *
   * @param a       the subdiagonal complex elements
   * @param b       the diagonal complex elements
   * @param c       the superdiagonal complex elements
   * @param d      the right-hand-side complex vector.
   * @return the solution
   */
  public static solveComplex(a: MyComplex[], b: MyComplex[], c: MyComplex[], d: MyComplex[]): MyComplex[] {
    let n = d.length;
    let temp: MyComplex;
    c[0] = c[0].divide(b[0]);
    d[0] = d[0].divide(b[0]);
    for (let i = 1; i < n; i++) {
      temp = b[i].minus(c[i - 1].times(a[i])).reciprocal();
      c[i] = c[i].times(temp); // redundant at the last step as c[n-1]=0.
      d[i] = d[i].minus(d[i - 1].times(a[i])).times(temp);
    }
    let x: MyComplex[] = new Array(n);
    x[n - 1] = d[n - 1];
    for (let i = n - 2; i >= 0; i--) {
      x[i] = d[i].minus(c[i].times(x[i + 1]));
    }
    return x;
  }

}
