/*
 * An attachment of a HAT to a Raspberry Pi
 *
 * @author Charles Xie
 */

import {RaspberryPi} from "./RaspberryPi";
import {Hat} from "./Hat";

export class Attachment {

  raspberryPiId: string;
  hatId: string;

  constructor(raspberryPi: RaspberryPi, hat: Hat) {
    this.raspberryPiId = raspberryPi.uid;
    this.hatId = hat.uid;
  }

}
