/*
 * @author Charles Xie
 */

export class Random {

  // return a random number in a normal distribution with mean = 0 and variance = 1 using the Box-Muller transform.
  public static gaussian(): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  // return two random numbers in a normal distribution with mean = 0 and variance = 1 using the Box-Muller transform.
  public static twoGaussians(): number[] {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let r: number[] = new Array(2);
    let a = Math.sqrt(-2.0 * Math.log(u));
    let b = 2.0 * Math.PI * v;
    r[0] = a * Math.cos(b);
    r[1] = a * Math.sin(b);
    return r;
  }

}
