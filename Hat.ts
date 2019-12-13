/*
 * Hardware attached on top (HAT)
 *
 * @author Charles Xie
 */

import {Board} from "./src/Board";
import {RaspberryPi} from "./src/RaspberryPi";

export abstract class Hat extends Board {

  public raspberryPi: RaspberryPi;

  public attach(raspberryPi: RaspberryPi): void {
    this.raspberryPi = raspberryPi;
  }

}
