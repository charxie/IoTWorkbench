/*
 * Hardware attached on top (HAT) for Raspberry Pi, equivalent to shields for Arduino
 *
 * @author Charles Xie
 */

import {Board} from "./Board";
import {RaspberryPi} from "./RaspberryPi";
import {Rectangle} from "../math/Rectangle";
import {system} from "../Main";
import $ from "jquery";

export abstract class Hat extends Board {

  raspberryPi: RaspberryPi;

  tryAttach(): void {
    let i = this.whichRaspberryPi();
    if (i >= 0) {
      let pi = <RaspberryPi>system.mcus[i];
      if (pi.hat) {
        let that = this;
        $("#modal-dialog").html("<div style='font-size: 90%;'>" + pi.uid +" already has a HAT: "+ pi.hat.uid+".</div>");
        $("#modal-dialog").dialog({
          resizable: false,
          modal: true,
          title: "Attach HAT",
          height: 200,
          width: 300,
          buttons: {
            'OK': function () {
              $(this).dialog('close');
            }
          }
        });
      } else {
        this.attach(pi);
      }
    }
  }

  attach(raspberryPi: RaspberryPi): void {
    if (raspberryPi != null) {
      raspberryPi.hat = this;
    } else {
      if (this.raspberryPi != null) {
        this.raspberryPi.hat = null;
      }
    }
    this.raspberryPi = raspberryPi;
    if (raspberryPi != null) {
      this.setX(raspberryPi.getX());
      this.setY(raspberryPi.getY());
      localStorage.setItem("Attachment: " + this.getUid(), raspberryPi.uid);
      this.updateFromFirebase();
    } else {
      localStorage.removeItem("Attachment: " + this.getUid());
      this.turnoff();
    }
  }

  whichRaspberryPi(): number {
    let r1 = new Rectangle(this.getX(), this.getY(), this.getWidth(), this.getHeight());
    for (let i = system.mcus.length - 1; i >= 0; i--) {
      let mcu = system.mcus[i];
      if (mcu instanceof RaspberryPi) {
        let a = 20;
        if (r1.intersectRect(new Rectangle(mcu.getX() + a, mcu.getY() + a, mcu.getWidth() - 2 * a, mcu.getHeight() - 2 * a))) {
          return i;
        }
      }
    }
    return -1;
  }

}
