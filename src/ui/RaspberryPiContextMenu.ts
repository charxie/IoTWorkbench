/*
 * @author Charles Xie
 */

import {system} from "../Main";
import {RaspberryPi} from "../components/RaspberryPi";
import {ComponentContextMenu} from "./ComponentContextMenu";
import $ from "jquery";

export class RaspberryPiContextMenu extends ComponentContextMenu {

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
                  <td>ID:</td>
                  <td>${this.raspberryPi.uid.substring(this.raspberryPi.uid.indexOf("#"))}</td>
                </tr>
              </table>
            </div>`;
  }

  private settingsButtonClick(e: MouseEvent): void {
    if (this.raspberryPi) {
      $("#modal-dialog").html(this.getSettingsUI());
      $("#modal-dialog").dialog({
        resizable: false,
        modal: true,
        title: "Raspberry Pi Settings",
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

  private deleteButtonClick(e: MouseEvent): void {
    if (this.raspberryPi) {
      let that = this;
      $("#modal-dialog").html("<div style='font-size: 90%;'>Are you sure you want to delete " + this.raspberryPi.uid + "?</div>");
      $("#modal-dialog").dialog({
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
