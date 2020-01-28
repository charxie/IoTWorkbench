/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {TurnoutSwitch} from "../TurnoutSwitch";

export class TurnoutSwitchContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "turnout-switch-context-menu";
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
                  <td>Variable Name (e.g. x):</td>
                  <td><input type="text" id="turnout-switch-variable-name-field" style="width: 150px"></td>
                </tr>
                <tr>
                  <td>Inequality or Boolean:</td>
                  <td><input type="text" id="turnout-switch-expression-field" style="width: 150px"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="turnout-switch-width-field" style="width: 150px"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="turnout-switch-height-field" style="width: 150px"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof TurnoutSwitch) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let variableNameInputElement = document.getElementById("turnout-switch-variable-name-field") as HTMLInputElement;
      variableNameInputElement.value = block.getVariableName() ? block.getVariableName() : "x";
      let expressionInputElement = document.getElementById("turnout-switch-expression-field") as HTMLInputElement;
      expressionInputElement.value = block.getExpression() != undefined ? block.getExpression().toString() : "x>0";
      let widthInputElement = document.getElementById("turnout-switch-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("turnout-switch-height-field") as HTMLInputElement;
      heightInputElement.value = block.getHeight().toString();
      const okFunction = function () {
        let success = true;
        let message;
        // set variable name
        block.setVariableName(variableNameInputElement.value);
        // set expression
        block.setExpression(expressionInputElement.value);
        try {
          flowchart.updateResultsForBlock(block);
        } catch (err) {
          success = false;
          message = expressionInputElement.value + " is not a valid expression.";
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
      variableNameInputElement.addEventListener("keyup", enterKeyUp);
      expressionInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 350,
        width: 390,
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
