/*
 * The five-number summary is a set of descriptive statistics that provides information about a dataset.
 * See: https://en.wikipedia.org/wiki/Five-number_summary
 * @author Charles Xie
 */

export class FiveNumberSummary {

  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;

  constructor(min: number, q1: number, median: number, q3: number, max: number) {
    this.min = min;
    this.q1 = q1;
    this.median = median;
    this.q3 = q3;
    this.max = max;
  }

  copy(src: FiveNumberSummary): void {
    this.min = src.min;
    this.q1 = src.q1;
    this.median = src.median;
    this.q3 = src.q3;
    this.max = src.max;
  }

}
