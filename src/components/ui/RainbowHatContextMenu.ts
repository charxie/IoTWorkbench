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
      let d = $("#modal-dialog").html(this.getSettingsUI());
      let stateIdField = document.getElementById("rainbow-hat-state-id-field") as HTMLInputElement;
      stateIdField.value = (<RainbowHat>this.hat).stateId;
      d.dialog({
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

  propertiesButtonClick(e: MouseEvent): void {
    if (this.hat instanceof RainbowHat) {
      $("#modal-dialog").html(this.hat.getProperties()).dialog({
        resizable: false,
        modal: true,
        title: "Rainbow HAT Properties",
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
