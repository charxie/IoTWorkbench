/*
 * Microcontroller unit (MCU)
 *
 * @author Charles Xie
 */

import {Board} from "./Board";

export abstract class Mcu extends Board {

  static State = class {
    uid: string;
    x: number;
    y: number;

    constructor(mcu: Mcu) {
      this.uid = mcu.uid;
      this.x = mcu.getX();
      this.y = mcu.getY();
    }
  };

}
