/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {BundledFunctionsBlock} from "../BundledFunctionsBlock";

export class BundledFunctionsBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "bundled-functions-block-context-menu";
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
                <button type="button" class="menu-btn" id="${this.id}-properties-button"><i class="fas fa-cog"></i><span class="menu-text">Properties</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    super.addListeners();
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Input Name (e.g., x):</td>
                  <td><input type="text" id="bundled-functions-block-input-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Expressions:<div style="font-size: 70%">(e.g., ["cos(x)", "sin(x)", "tan(x)"])</div></td>
                  <td><textarea id="bundled-functions-block-expressions-field" rows="5" style="width: 100%"></textarea></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="bundled-functions-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="bundled-functions-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof BundledFunctionsBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let inputNameInputElement = document.getElementById("bundled-functions-block-input-name-field") as HTMLInputElement;
      inputNameInputElement.value = block.getInputName() ? block.getInputName().toString() : "t";
      let expressionsInputElement = document.getElementById("bundled-functions-block-expressions-field") as HTMLTextAreaElement;
      expressionsInputElement.value = JSON.stringify(block.getExpressions());
      let widthInputElement = document.getElementById("bundled-functions-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("bundled-functions-block-height-field") as HTMLInputElement;
      heightInputElement.value = block.getHeight().toString();
      const okFunction = function () {
        block.setInputName(inputNameInputElement.value);
        let success = true;
        let message;
        // set expressions
        if (JSON.stringify(block.getExpressions()) != expressionsInputElement.value) {
          try {
            block.setExpressions(JSON.parse(expressionsInputElement.value));
          } catch (err) {
            console.log(err.stack);
            success = false;
            message = expressionsInputElement.value + " is not a valid array.";
          }
          try {
            flowchart.updateResultsForBlock(block);
          } catch (err) {
            success = false;
            message = JSON.stringify(expressionsInputElement.value) + " are not valid expressions.";
          }
        }
        // set width
        let w = parseInt(widthInputElement.value);
        if (isNumber(w)) {
          block.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthInputElement.value + " is not a valid width.";
        }
        // set height
        let h = parseInt(heightInputElement.value);
        if (isNumber(h)) {
          block.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightInputElement.value + " is not a valid height.";
        }
        // finish
        if (success) {
          block.refreshView();
          flowchart.blockView.requestDraw();
          flowchart.storeBlockStates();
          flowchart.storeConnectorStates();
          d.dialog('close');
        } else {
          Util.showErrorMessage(message);
        }
      };
      const enterKeyUp = function (e) {
        if (e.key == "Enter") {
          okFunction();
        }
      };
      inputNameInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 350,
        width: 400,
        buttons: {
          'OK': okFunction,
          'Cancel': function () {
            d.dialog('close');
          }
        }
      });
    }
  }

}
