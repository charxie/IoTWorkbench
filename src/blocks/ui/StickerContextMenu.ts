/*
 * @author Charles Xie
 */

import $ from "jquery";
import {Slider} from "../Slider";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart} from "../../Main";
import {Sticker} from "../Sticker";

export class StickerContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "sticker-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 120px; z-index: 10000">
              <li class="menu-item">
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
  }

  getSettingsUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>ID:</td>
                  <td>${this.block.getUid().substring(this.block.getUid().indexOf("#"))}</td>
                </tr>
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="sticker-name-field"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="sticker-width-field"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="sticker-height-field"></td>
                </tr>
              </table>
            </div>`;
  }

  settingsButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block) {
      let sticker = <Sticker>this.block;
      $("#modal-dialog").html(this.getSettingsUI());
      let e = document.getElementById("sticker-name-field") as HTMLInputElement;
      e.value = sticker.getName();
      e = document.getElementById("sticker-width-field") as HTMLInputElement;
      e.value = sticker.getWidth().toString();
      e = document.getElementById("sticker-height-field") as HTMLInputElement;
      e.value = sticker.getHeight().toString();
      $("#modal-dialog").dialog({
        resizable: false,
        modal: true,
        title: "Sticker Settings",
        height: 300,
        width: 400,
        buttons: {
          'OK': function () {
            let f = document.getElementById("sticker-name-field") as HTMLInputElement;
            sticker.setName(f.value);
            f = document.getElementById("sticker-width-field") as HTMLInputElement;
            sticker.setWidth(parseInt(f.value));
            f = document.getElementById("sticker-height-field") as HTMLInputElement;
            sticker.setHeight(parseInt(f.value));
            flowchart.storeBlockStates();
            flowchart.draw();
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
