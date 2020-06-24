/*
 * @author Charles Xie
 */

export class MyComplex {

  public re: number = 0;
  public im: number = 0;

  constructor(re: number, im: number) {
    this.set(re, im);
  }

  public set(re: number, im: number) {
    this.re = re;
    this.im = im;
  }

  public clone(): MyComplex {
    return new MyComplex(this.re, this.im);
  }

  public scale(s: number): MyComplex {
    return new MyComplex(s * this.re, s * this.im);
  }

  public shiftReal(x: number): MyComplex {
    return new MyComplex(this.re + x, this.im);
  }

  public shiftImaginary(x: number): MyComplex {
    return new MyComplex(this.re, this.im + x);
  }

  public abs(): number {
    return Math.hypot(this.re, this.im);
  }

  public absSquare(): number {
    return this.re * this.re + this.im * this.im;
  }

  public arg(): number {
    if (this.re === 0 && this.im == 0) return 0; // convention
    return Math.atan2(this.im, this.re);
  }

  public plus(c: MyComplex): MyComplex {
    return new MyComplex(this.re + c.re, this.im + c.im);
  }

  public minus(c: MyComplex): MyComplex {
    return new MyComplex(this.re - c.re, this.im - c.im);
  }

  public times(c: MyComplex): MyComplex {
    return new MyComplex(this.re * c.re - this.im * c.im, this.re * c.im + this.im * c.re);
  }

  public negate(): MyComplex {
    return new MyComplex(-this.re, -this.im);
  }

  public conjugate(): MyComplex {
    return new MyComplex(this.re, -this.im);
  }

  public reciprocal(): MyComplex {
    let scale = this.re * this.re + this.im * this.im;
    return new MyComplex(this.re / scale, -this.im / scale);
  }

  public divide(b: MyComplex): MyComplex {
    return this.times(b.reciprocal());
  }

  public exp(): MyComplex {
    return new MyComplex(Math.exp(this.re) * Math.cos(this.im), Math.exp(this.re) * Math.sin(this.im));
  }

  public sin(): MyComplex {
    return new MyComplex(Math.sin(this.re) * Math.cosh(this.im), Math.cos(this.re) * Math.sinh(this.im));
  }

  public cos(): MyComplex {
    return new MyComplex(Math.cos(this.re) * Math.cosh(this.im), -Math.sin(this.re) * Math.sinh(this.im));
  }

  public tan(): MyComplex {
    return this.sin().divide(this.cos());
  }

  // The two square roots of a+bi are (x+yi) and -(x+yi) with y = sqrt((r - a)/2) and x = b/(2y). This method returns the first one.
  public sqrt1(): MyComplex {
    let r = this.abs();
    let y = Math.sqrt((r - this.re) * 0.5);
    return new MyComplex(this.im * 0.5 / y, y);
  }

  // The two square roots of a+bi are (x+yi) and -(x+yi) with y = sqrt((r - a)/2) and x = b/(2y). This method returns the second one.
  public sqrt2(): MyComplex {
    let r = this.abs();
    let y = -Math.sqrt((r - this.re) * 0.5);
    return new MyComplex(this.im * 0.5 / y, y);
  }

  public static add(a: MyComplex, b: MyComplex): MyComplex {
    let real = a.re + b.re;
    let imag = a.im + b.im;
    return new MyComplex(real, imag);
  }

  public equals(x: MyComplex): boolean {
    if (x === undefined || x === null) return false;
    return (this.re === x.re) && (this.im === x.im);
  }

  public toFixed(fractionDigits: number): string {
    if (this.re === 0) {
      if (this.im === 0) return "0";
      if (this.im === 1) return "i";
      if (this.im === -1) return "-i";
      return this.im.toFixed(fractionDigits) + "i";
    }
    if (this.im === 0) return this.re.toFixed(fractionDigits) + "";
    if (this.im === 1) return this.re.toFixed(fractionDigits) + " + i";
    if (this.im === -1) return this.re.toFixed(fractionDigits) + " - i";
    if (this.im < 0) return this.re.toFixed(fractionDigits) + " - " + (-this.im.toFixed(fractionDigits)) + "i";
    return this.re.toFixed(fractionDigits) + " + " + this.im.toFixed(fractionDigits) + "i";
  }

}
