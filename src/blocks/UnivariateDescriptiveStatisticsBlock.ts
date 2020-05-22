/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {MyVector} from "../math/MyVector";
import {UnivariateDescriptiveStatistics} from "../math/UnivariateDescriptiveStatistics";

export class UnivariateDescriptiveStatisticsBlock extends Block {

  private readonly portI: Port;
  private readonly portMean: Port;
  private readonly portMedian: Port;
  private readonly portMode: Port;
  private readonly portRange: Port;
  private readonly portQ1: Port;
  private readonly portQ3: Port;
  private readonly portSD: Port;
  private readonly portSkewness: Port;
  private readonly portKurtosis: Port;

  static State = class {
    readonly symbol: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: UnivariateDescriptiveStatisticsBlock) {
      this.symbol = block.symbol;
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = "Univariate Descriptive Statistics Block";
    this.symbol = "UDS";
    this.color = "#FC3";
    this.portI = new Port(this, true, "IN", 0, this.height / 2, false);
    let n = 10;
    this.portMean = new Port(this, false, "ME", this.width, this.height / n, true);
    this.portMedian = new Port(this, false, "MD", this.width, this.height * 2 / n, true);
    this.portMode = new Port(this, false, "MO", this.width, this.height * 3 / n, true);
    this.portRange = new Port(this, false, "RG", this.width, this.height * 4 / n, true);
    this.portQ1 = new Port(this, false, "Q1", this.width, this.height * 5 / n, true);
    this.portQ3 = new Port(this, false, "Q3", this.width, this.height * 6 / n, true);
    this.portSD = new Port(this, false, "SD", this.width, this.height * 7 / n, true);
    this.portSkewness = new Port(this, false, "SK", this.width, this.height * 8 / n, true);
    this.portKurtosis = new Port(this, false, "KU", this.width, this.height * 9 / n, true);
    this.ports.push(this.portI);
    this.ports.push(this.portMean);
    this.ports.push(this.portMedian);
    this.ports.push(this.portMode);
    this.ports.push(this.portRange);
    this.ports.push(this.portQ1);
    this.ports.push(this.portQ3);
    this.ports.push(this.portSD);
    this.ports.push(this.portSkewness);
    this.ports.push(this.portKurtosis);
    this.marginX = 30; // margin X for inset
  }

  getCopy(): Block {
    return new UnivariateDescriptiveStatisticsBlock(this.name + " #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
  }

  destroy(): void {
  }

  refreshView(): void {
    super.refreshView();
    this.portI.setY(this.height / 2);
    let n = this.ports.length;
    for (let i = 1; i < n; i++) {
      this.ports[i].setX(this.width);
      this.ports[i].setY(this.height * i / n);
    }
  }

  updateModel(): void {
    let x = this.portI.getValue();
    if (x instanceof MyVector) {
      this.setPortValues(new UnivariateDescriptiveStatistics(x.getValues()));
    } else {
      if (Array.isArray(x)) {
        this.setPortValues(new UnivariateDescriptiveStatistics(x));
      } else {
        this.portMean.setValue(x);
        this.portMedian.setValue(x);
        this.portMode.setValue(x);
        this.portRange.setValue(0);
        this.portQ1.setValue(x);
        this.portQ3.setValue(x);
        this.portSD.setValue(0);
        this.portSkewness.setValue(0);
        this.portKurtosis.setValue(0);
      }
    }
    this.updateConnectors();
  }

  private setPortValues(uds: UnivariateDescriptiveStatistics): void {
    let fns = uds.getFiveNumberSummary();
    this.portMean.setValue(uds.arithmeticMean());
    this.portMedian.setValue(fns.median);
    this.portMode.setValue(uds.mode());
    this.portRange.setValue(fns.max - fns.min);
    this.portQ1.setValue(fns.q1);
    this.portQ3.setValue(fns.q3);
    this.portSD.setValue(uds.standardDeviation(this.portMean.getValue()));
    this.portSkewness.setValue(uds.skewness(this.portMean.getValue(), this.portSD.getValue()));
    this.portKurtosis.setValue(uds.kurtosis(this.portMean.getValue(), this.portSD.getValue()));
  }

}
