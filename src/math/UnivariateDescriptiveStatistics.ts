/*
 * @author Charles Xie
 */
import {FiveNumberSummary} from "../blocks/FiveNumberSummary";

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

  // return the five-number summary at 0, 1/4, 1/2, 3/4, and 1
  public getFiveNumberSummary(): FiveNumberSummary {
    let length = this.values.length;
    if (length <= 0) return undefined;
    let copy = [...this.values];
    copy.sort((a, b) => a - b);
    let q2;
    if (length % 2 === 0) {
      q2 = (copy[length / 2 - 1] + copy[length / 2]) / 2;
    } else {
      q2 = copy[(length - 1) / 2];
    }
    let q1 = copy[Math.floor(length * 0.25) - 1];
    let q3 = copy[Math.floor(length * 0.75) - 1];
    return new FiveNumberSummary(copy[0], q1, q2, q3, copy[length - 1]);
  }

  // uncorrected
  public standardDeviation(mean: number): number {
    if (this.values.length <= 0) return undefined;
    if (this.values.length == 1) return 0;
    if (mean === undefined) mean = this.arithmeticMean();
    let dv;
    let sum = 0;
    for (let v of this.values) {
      dv = v - mean;
      sum += dv * dv;
    }
    return Math.sqrt(sum / this.values.length);
  }

  public skewness(mean: number, sd: number): number {
    if (this.values.length <= 0) return undefined;
    if (this.values.length == 1) return 0;
    if (mean === undefined) mean = this.arithmeticMean();
    if (sd === undefined) sd = this.standardDeviation(mean);
    let dv;
    let sum = 0;
    for (let v of this.values) {
      dv = v - mean;
      sum += dv * dv * dv;
    }
    return sum / (this.values.length * sd * sd * sd);
  }

  public kurtosis(mean: number, sd: number): number {
    if (this.values.length <= 0) return undefined;
    if (this.values.length == 1) return 0;
    if (mean === undefined) mean = this.arithmeticMean();
    if (sd === undefined) sd = this.standardDeviation(mean);
    let dv;
    let sum = 0;
    for (let v of this.values) {
      dv = v - mean;
      sum += dv * dv * dv * dv;
    }
    return sum / (this.values.length * sd * sd * sd * sd);
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
