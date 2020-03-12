/*
 * @author Charles Xie
 */

import $ from "jquery";
import {HatContextMenu} from "./HatContextMenu";
import {RainbowHat} from "../RainbowHat";
import {isNumber, system} from "../../Main";
import {Util} from "../../Util";

export class RainbowHatContextMenu extends HatContextMenu {

  constructor() {
    super();
    this.id = "rainbow-hat-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 150px; z-index: 10000">
              <li class="menu-item" id="rainbow-hat-attach-menu-item">
                <button type="button" class="menu-btn" id="${this.id}-attach-button"><i class="fas fa-angle-double-down"></i><span class="menu-text">Attach</span></button>
              </li>
              <li class="menu-item" id="rainbow-hat-detach-menu-item">
                <button type="button" class="menu-btn" id="${this.id}-detach-button"><i class="fas fa-angle-double-up"></i><span class="menu-text">Detach</span></button>
              </li>
              <li class="menu-item" id="rainbow-hat-delete-menu-item">
                <button type="button" class="menu-btn" id="${this.id}-delete-button"><i class="fas fa-trash"></i><span class="menu-text">Delete</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-properties-button"><i class="fas fa-list"></i><span class="menu-text">Properties</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-settings-button"><i class="fas fa-cog"></i><span class="menu-text">Settings</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    super.addListeners();
    let propertiesButton = document.getElementById(this.id + "-properties-button");
    propertiesButton.addEventListener("click", this.propertiesButtonClick.bind(this), false);
    let settingsButton = document.getElementById(this.id + "-settings-button");
    settingsButton.addEventListener("click", this.settingsButtonClick.bind(this), false);
  }

  private getSettingsUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>State Key:</td>
                  <td><input type="text" id="rainbow-hat-state-key-field" style="width: 150px"></td>
                </tr>
                <tr>
                  <td>Upper-Left Point X:</td>
                  <td><input type="text" id="rainbow-hat-x-field" style="width: 150px"></td>
                </tr>
                <tr>
                  <td>Upper-Left Point Y:</td>
                  <td><input type="text" id="rainbow-hat-y-field" style="width: 150px"></td>
                </tr>
              </table>
            </div>`;
  }

  settingsButtonClick(e: MouseEvent): void {
    if (this.hat instanceof RainbowHat) {
      let hat = this.hat;
      let d = $("#modal-dialog").html(this.getSettingsUI());
      let stateKeyField = document.getElementById("rainbow-hat-state-key-field") as HTMLInputElement;
      stateKeyField.value = hat.stateKey;
      let xInputElement = document.getElementById("rainbow-hat-x-field") as HTMLInputElement;
      xInputElement.value = hat.getX().toString();
      let yInputElement = document.getElementById("rainbow-hat-y-field") as HTMLInputElement;
      yInputElement.value = hat.getY().toString();
      const okFunction = function () {
        let success = true;
        let message;
        // set x
        let x = parseInt(xInputElement.value);
        if (isNumber(x)) {
          hat.setX(Math.max(20, x));
        } else {
          success = false;
          message = xInputElement.value + " is not a valid x";
        }
        // set y
        let y = parseInt(yInputElement.value);
        if (isNumber(y)) {
          hat.setY(Math.max(20, y));
        } else {
          success = false;
          message = yInputElement.value + " is not a valid y";
        }
        // finish
        if (success) {
          hat.draw();
          if (hat.raspberryPi != null) {
            hat.raspberryPi.setX(hat.getX());
            hat.raspberryPi.setY(hat.getY());
            system.storeMcuStates();
          }
          system.storeHatStates();
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
      stateKeyField.addEventListener("keyup", enterKeyUp);
      xInputElement.addEventListener("keyup", enterKeyUp);
      yInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: "Settings: " + hat.getUid(),
        height: 400,
        width: 400,
        buttons: {
          'OK': okFunction,
          'Cancel': function () {
            $(this).dialog('close');
          }
        }
      });
    }
  }

  propertiesButtonClick(e: MouseEvent): void {
    if (this.hat instanceof RainbowHat) {
      let hat = this.hat;
      $("#modal-dialog").html(this.hat.getProperties()).dialog({
        resizable: false,
        modal: true,
        title: "Properties: " + hat.getUid(),
        height: 500,
        width: 400,
        buttons: {
          'Close': function () {
            $(this).dialog('close');
          },
        }
      });
    }
  }

}
