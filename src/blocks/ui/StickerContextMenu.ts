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
    return `<menu id="${this.id}" class="menu" style="width: 140px; z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-copy-button"><i class="fas fa-copy"></i><span class="menu-text">Copy</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-delete-button"><i class="fas fa-trash"></i><span class="menu-text">Delete</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-code-button"><i class="fas fa-code"></i><span class="menu-text">Code</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-properties-button"><i class="fas fa-cog"></i><span class="menu-text">Properties</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    super.addListeners();
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="sticker-name-field"></td>
                </tr>
                <tr>
                  <td>Decimals:</td>
                  <td><input type="text" id="sticker-decimals-field"></td>
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

  protected propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block) {
      let sticker = <Sticker>this.block;
      $("#modal-dialog").html(this.getPropertiesUI());
      let nameInputElement = document.getElementById("sticker-name-field") as HTMLInputElement;
      nameInputElement.value = sticker.getName();
      let decimalsInputElement = document.getElementById("sticker-decimals-field") as HTMLInputElement;
      decimalsInputElement.value = sticker.getDecimals() ? sticker.getDecimals().toString() : "3";
      let widthInputElement = document.getElementById("sticker-width-field") as HTMLInputElement;
      widthInputElement.value = sticker.getWidth().toString();
      let heightInputElement = document.getElementById("sticker-height-field") as HTMLInputElement;
      heightInputElement.value = sticker.getHeight().toString();
      $("#modal-dialog").dialog({
        resizable: false,
        modal: true,
        title: sticker.getUid(),
        height: 400,
        width: 300,
        buttons: {
          'OK': function () {
            sticker.setName(nameInputElement.value);
            sticker.setDecimals(parseInt(decimalsInputElement.value));
            sticker.setWidth(parseInt(widthInputElement.value));
            sticker.setHeight(parseInt(heightInputElement.value));
            sticker.refreshView();
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
