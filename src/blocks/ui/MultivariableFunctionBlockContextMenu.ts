/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {TurnoutSwitch} from "../TurnoutSwitch";
import {SwitchStatementBlock} from "../SwitchStatementBlock";
import {MultivariableFunctionBlock} from "../MultivariableFunctionBlock";

export class MultivariableFunctionBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "multivariable-function-block-context-menu";
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
                <button type="button" class="menu-btn" id="${this.id}-rotate-button"><i class="fas fa-sync"></i><span class="menu-text">Rotate 90°</span></button>
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
                  <td>Variables:<div style="font-size: 70%">(e.g., ["x", "y", "z"])</div></td>
                  <td><textarea id="multivariable-function-block-cases-field" rows="5" style="width: 100%"></textarea></td>
                </tr>
                <tr>
                  <td>Expression (e.g. x+y+z):</td>
                  <td><input type="text" id="multivariable-function-block-expression-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="multivariable-function-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="multivariable-function-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof MultivariableFunctionBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let variablesInputElement = document.getElementById("multivariable-function-block-cases-field") as HTMLTextAreaElement;
      variablesInputElement.value = JSON.stringify(block.getVariables());
      let expressionInputElement = document.getElementById("multivariable-function-block-expression-field") as HTMLInputElement;
      expressionInputElement.value = block.getExpression() ? block.getExpression().toString() : "x+y+z";
      let widthInputElement = document.getElementById("multivariable-function-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("multivariable-function-block-height-field") as HTMLInputElement;
      heightInputElement.value = block.getHeight().toString();
      const okFunction = function () {
        let success = true;
        let message;
        // set variables
        if (JSON.stringify(block.getVariables()) != variablesInputElement.value) {
          try {
            block.setVariables(JSON.parse(variablesInputElement.value));
          } catch (err) {
            console.log(err.stack);
            success = false;
            message = variablesInputElement.value + " is not a valid array for variables";
          }
        }
        // set expression
        block.setExpression(expressionInputElement.value);
        try {
          flowchart.updateResults();
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
          flowchart.draw();
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
      expressionInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 400,
        width: 450,
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
