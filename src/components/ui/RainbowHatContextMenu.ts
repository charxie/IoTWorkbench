/*
 * @author Charles Xie
 */

import $ from "jquery";
import {HatContextMenu} from "./HatContextMenu";
import {RainbowHat} from "../RainbowHat";

export class RainbowHatContextMenu extends HatContextMenu {

  constructor() {
    super();
    this.id = "rainbow-hat-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 120px; z-index: 10000">
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
                <button type="button" class="menu-btn" id="${this.id}-code-button"><i class="fas fa-code"></i><span class="menu-text">Code</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-settings-button"><i class="fas fa-cog"></i><span class="menu-text">Settings</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    super.addListeners();
    let codeButton = document.getElementById(this.id + "-code-button");
    codeButton.addEventListener("click", this.codeButtonClick.bind(this), false);
    let settingsButton = document.getElementById(this.id + "-settings-button");
    settingsButton.addEventListener("click", this.settingsButtonClick.bind(this), false);
  }

  private getSettingsUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>ID:</td>
                  <td>${this.hat.uid.substring(this.hat.uid.indexOf("#"))}</td>
                </tr>
                <tr>
                  <td>State Key:</td>
                  <td><input type="text" id="rainbow-hat-state-id-field"></td>
                </tr>
              </table>
            </div>`;
  }

  settingsButtonClick(e: MouseEvent): void {
    if (this.hat) {
      $("#modal-dialog").html(this.getSettingsUI());
      let stateIdField = document.getElementById("rainbow-hat-state-id-field") as HTMLInputElement;
      stateIdField.value = (<RainbowHat>this.hat).stateId;
      $("#modal-dialog").dialog({
        resizable: false,
        modal: true,
        title: "Rainbow HAT Settings",
        height: 400,
        width: 400,
        buttons: {
          'OK': function () {
            $(this).dialog('close');
          },
          'Cancel': function () {
            $(this).dialog('close');
          }
        }
      });
    }
  }

  private getCodeUI(): string {
    let r = <RainbowHat>this.hat;
    let rgbLedHtml: string = "";
    for (let i = 0; i < r.rgbLedLights.length; i++) {
      rgbLedHtml += "<tr><td>RGB LED Light</td><td>" + r.rgbLedLights[i].name + "</td><td>" + r.rgbLedLights[i].color + "</td></tr>";
    }
    return `<div style="font-size: 90%; overflow-y: auto;">
              <table class="w3-table-all w3-left w3-hoverable">
                <thead>
                  <tr class="w3-gray">
                  <th>Component</th>
                  <th>Name</th>
                  <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Momentary Button A</td>
                    <td>${r.buttonA.name}</td>
                    <td>${r.buttonA.on}</td>
                  </tr>
                  <tr>
                    <td>Momentary Button B</td>
                    <td>${r.buttonB.name}</td>
                    <td>${r.buttonB.on}</td>
                  </tr>
                  <tr>
                    <td>Momentary Button C</td>
                    <td>${r.buttonC.name}</td>
                    <td>${r.buttonC.on}</td>
                  </tr>
                  <tr>
                    <td>Red LED Light</td>
                    <td>${r.redLedLight.name}</td>
                    <td>${r.redLedLight.on}</td>
                  </tr>
                  <tr>
                    <td>Green LED Light</td>
                    <td>${r.greenLedLight.name}</td>
                    <td>${r.greenLedLight.on}</td>
                  </tr>
                  <tr>
                    <td>Blue LED Light</td>
                    <td>${r.blueLedLight.name}</td>
                    <td>${r.blueLedLight.on}</td>
                  </tr>
                  <tr>
                    <td>Temperature Sensor</td>
                    <td>${r.temperatureSensor.name}</td>
                    <td>${r.temperatureSensor.data.length > 0 ? r.temperatureSensor.data[r.temperatureSensor.data.length - 1].toFixed(2) : "NA"}</td>
                  </tr>
                  <tr>
                    <td>Barometric Pressure Sensor</td>
                    <td>${r.barometricPressureSensor.name}</td>
                    <td>${r.barometricPressureSensor.data.length > 0 ? r.barometricPressureSensor.data[r.barometricPressureSensor.data.length - 1].toFixed(2) : "NA"}</td>
                  </tr>` + rgbLedHtml + `
                </tbody>
              </table>
            </div>`;
  }

  codeButtonClick(e: MouseEvent): void {
    if (this.hat) {
      $("#modal-dialog").html(this.getCodeUI());
      $("#modal-dialog").dialog({
        resizable: false,
        modal: true,
        title: "Rainbow HAT Variables",
        height: 400,
        width: 600,
        buttons: {
          'Close': function () {
            $(this).dialog('close');
          },
        }
      });
    }
  }

}
