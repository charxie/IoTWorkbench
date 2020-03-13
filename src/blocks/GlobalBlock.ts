/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";

export abstract class GlobalBlock extends Block {

  protected showValue: boolean = false;

  getShowValue(): boolean {
    return this.showValue;
  }

  setShowValue(showValue: boolean) {
    this.showValue = showValue;
  }

  abstract getOutputPort(): Port;

}
