/*
 * @author Charles Xie
 */

export class Complex {

  public re: number;
  public im: number;

  constructor(re: number, im: number) {
    this.set(re, im);
  }

  public set(re: number, im: number) {
    this.re = re;
    this.im = im;
  }

  public toFixed(fractionDigits: number): string {
    if (this.im == 0) return this.re.toFixed(fractionDigits) + "";
    if (this.re == 0) return this.im.toFixed(fractionDigits) + "i";
    if (this.im < 0) return this.re.toFixed(fractionDigits) + " - " + (-this.im.toFixed(fractionDigits)) + "i";
    return this.re.toFixed(fractionDigits) + " + " + this.im.toFixed(fractionDigits) + "i";
  }

  public abs(): number {
    return Math.hypot(this.re, this.im);
  }

  public phase(): number {
    return Math.atan2(this.im, this.re);
  }

  public plus(c: Complex): Complex {
    return new Complex(this.re + c.re, this.im + c.im);
  }

  public minus(c: Complex): Complex {
    return new Complex(this.re - c.re, this.im - c.im);
  }

  public times(c: Complex): Complex {
    return new Complex(this.re * c.re - this.im * c.im, this.re * c.im + this.im * c.re);
  }

  public scale(s: number): Complex {
    return new Complex(s * this.re, s * this.im);
  }

  public conjugate(): Complex {
    return new Complex(this.re, -this.im);
  }

  public reciprocal(): Complex {
    let scale = this.re * this.re + this.im * this.im;
    return new Complex(this.re / scale, -this.im / scale);
  }

  public divides(b: Complex): Complex {
    return this.times(b.reciprocal());
  }

  public exp(): Complex {
    return new Complex(Math.exp(this.re) * Math.cos(this.im), Math.exp(this.re) * Math.sin(this.im));
  }

  public sin(): Complex {
    return new Complex(Math.sin(this.re) * Math.cosh(this.im), Math.cos(this.re) * Math.sinh(this.im));
  }

  public cos(): Complex {
    return new Complex(Math.cos(this.re) * Math.cosh(this.im), -Math.sin(this.re) * Math.sinh(this.im));
  }

  public tan(): Complex {
    return this.sin().divides(this.cos());
  }

  public static add(a: Complex, b: Complex): Complex {
    let real = a.re + b.re;
    let imag = a.im + b.im;
    return new Complex(real, imag);
  }

  public equals(x: Complex): boolean {
    if (x === undefined || x === null) return false;
    return (this.re === x.re) && (this.im === x.im);
  }

}
