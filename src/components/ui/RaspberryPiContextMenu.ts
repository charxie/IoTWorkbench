/*
 * @author Charles Xie
 */

import $ from "jquery";
import {isNumber, system} from "../../Main";
import {RaspberryPi} from "../RaspberryPi";
import {MyContextMenu} from "../../MyContextMenu";
import {Util} from "../../Util";

export class RaspberryPiContextMenu extends MyContextMenu {

  raspberryPi: RaspberryPi;

  constructor() {
    super();
    this.id = "raspberry-pi-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 120px; z-index: 10000">
              <li class="menu-item">
                <button type="button" id="${this.id}-delete-button" class="menu-btn"><i class="fas fa-trash"></i><span class="menu-text">Delete</span></button>
              </li>
              <li class="menu-item">
                <button type="button" id="${this.id}-settings-button" class="menu-btn"><i class="fas fa-cog"></i><span class="menu-text">Settings</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    let deleteButton = document.getElementById(this.id + "-delete-button");
    deleteButton.addEventListener("click", this.deleteButtonClick.bind(this), false);
    let settingsButton = document.getElementById(this.id + "-settings-button");
    settingsButton.addEventListener("click", this.settingsButtonClick.bind(this), false);
  }

  private getSettingsUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-hoverable">
                <tr>
                  <td>Upper-Left Point X:</td>
                  <td><input type="text" id="raspberry-pi-x-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Upper-Left Point Y:</td>
                  <td><input type="text" id="raspberry-pi-y-field" style="width: 120px"></td>
                </tr>
              </table>
            </div>`;
  }

  private settingsButtonClick(e: MouseEvent): void {
    if (this.raspberryPi) {
      const rpi = this.raspberryPi;
      const d = $("#modal-dialog").html(this.getSettingsUI());
      let xInputElement = document.getElementById("raspberry-pi-x-field") as HTMLInputElement;
      xInputElement.value = rpi.getX().toString();
      let yInputElement = document.getElementById("raspberry-pi-y-field") as HTMLInputElement;
      yInputElement.value = rpi.getY().toString();
      const okFunction = function () {
        let success = true;
        let message;
        // set x
        let x = parseInt(xInputElement.value);
        if (isNumber(x)) {
          rpi.setX(Math.max(20, x));
        } else {
          success = false;
          message = xInputElement.value + " is not a valid x";
        }
        // set y
        let y = parseInt(yInputElement.value);
        if (isNumber(y)) {
          rpi.setY(Math.max(20, y));
        } else {
          success = false;
          message = yInputElement.value + " is not a valid y";
        }
        // finish
        if (success) {
          rpi.draw();
          if (rpi.hat != null) {
            rpi.hat.setX(rpi.getX());
            rpi.hat.setY(rpi.getY());
            system.storeHatStates();
          }
          system.storeMcuStates();
          d.dialog('close');
        } else {
          Util.showInputError(message);
        }
      };
      const enterKeyUp = function (e) {
        if (e.key == "Enter") {
          okFunction();
        }
      };
      xInputElement.addEventListener("keyup", enterKeyUp);
      yInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: "Settings: " + rpi.getUid(),
        height: 300,
        width: 360,
        buttons: {
          'OK': okFunction,
          'Cancel': function () {
            d.dialog('close');
          }
        }
      });
    }
  }

  private deleteButtonClick(e: MouseEvent): void {
    if (this.raspberryPi) {
      let that = this;
      let d = $("#modal-dialog").html("<div style='font-size: 90%;'>Are you sure you want to delete " + this.raspberryPi.uid + "?</div>");
      d.dialog({
        resizable: false,
        modal: true,
        title: "Delete",
        height: 200,
        width: 300,
        buttons: {
          'OK': function () {
            that.raspberryPi.hat = null;
            system.removeRaspberryPi(that.raspberryPi);
            $(this).dialog('close');
          },
          'Cancel': function () {
            $(this).dialog('close');
          }
        }
      });
    }
  }

}
