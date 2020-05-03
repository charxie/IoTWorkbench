/*
 * @author Charles Xie
 */
export class UnivariateDescriptiveStatistics {

  private values: number[];

  constructor(values: number[]) {
    this.values = values;
  }

  public mode(): number[] {
    let modes = [], count = [], number, maxIndex = 0;
    for (let i = 0; i < this.values.length; i++) {
      number = this.values[i];
      count[number] = (count[number] || 0) + 1;
      if (count[number] > maxIndex) {
        maxIndex = count[number];
      }
    }
    for (let i in count) {
      if (count.hasOwnProperty(i)) {
        if (count[i] === maxIndex) {
          modes.push(Number(i));
        }
      }
    }
    return modes;
  }

  public medianAndRange(): number[] {
    let length = this.values.length;
    if (length <= 0) return undefined;
    let copy = [...this.values];
    copy.sort((a, b) => a - b);
    let m;
    if (length % 2 === 0) {
      m = (copy[length / 2 - 1] + copy[length / 2]) / 2;
    } else {
      m = copy[(length - 1) / 2];
    }
    return [m, copy[length - 1] - copy[0]];
  }

  public arithmeticMean(): number {
    if (this.values === undefined || this.values.length === 0) return undefined;
    let m = 0;
    for (let x of this.values) {
      m += x;
    }
    return m / this.values.length;
  }

  public geometricMean(): number {
    if (this.values === undefined || this.values.length === 0) return undefined;
    let m = 1;
    for (let x of this.values) {
      m *= x;
    }
    return Math.pow(m, 1 / this.values.length);
  }

  public harmonicMean(): number {
    if (this.values === undefined || this.values.length === 0) return undefined;
    let m = 0;
    for (let x of this.values) {
      m += 1 / x;
    }
    return this.values.length / m;
  }

}
