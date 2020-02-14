/*
 * @author Charles Xie
 */
import {Block} from "./Block";

export abstract class GlobalBlock extends Block {

  protected showValue: boolean = false;

  getShowValue(): boolean {
    return this.showValue;
  }

  setShowValue(showValue: boolean) {
    this.showValue = showValue;
  }

}
