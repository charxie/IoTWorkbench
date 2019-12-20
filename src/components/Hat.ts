/*
 * Hardware attached on top (HAT) for Raspberry Pi, equivalent to shields for Arduino
 *
 * @author Charles Xie
 */

import {Board} from "./Board";
import {RaspberryPi} from "./RaspberryPi";

export abstract class Hat extends Board {

  public raspberryPi: RaspberryPi;

  public attach(raspberryPi: RaspberryPi): void {
    if (raspberryPi != null) {
      raspberryPi.hat = this;
    } else {
      if (this.raspberryPi != null) {
        this.raspberryPi.hat = null;
      }
    }
    this.raspberryPi = raspberryPi;
  }

}
