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

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof TurnoutSwitch) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let variableNameField = document.getElementById("turnout-switch-variable-name-field") as HTMLInputElement;
      variableNameField.value = block.getVariableName() ? block.getVariableName() : "x";
      let expressionField = document.getElementById("turnout-switch-expression-field") as HTMLInputElement;
      expressionField.value = block.getExpression() != undefined ? block.getExpression().toString() : "x>0";
      let widthField = document.getElementById("turnout-switch-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("turnout-switch-height-field") as HTMLInputElement;
      heightField.value = Math.round(block.getHeight()).toString();
      const okFunction = () => {
        let success = true;
        let message;
        block.setVariableName(variableNameField.value);
        block.setExpression(expressionField.value);
        block.useDeclaredFunctions();
        try {
          flowchart.updateResultsForBlock(block);
        } catch (err) {
          success = false;
          message = expressionField.value + " is not a valid expression";
        }
        // set width
        let w = parseInt(widthField.value);
        if (isNumber(w)) {
          block.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthField.value + " is not a valid width";
        }
        // set height
        let h = parseInt(heightField.value);
        if (isNumber(h)) {
          block.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightField.value + " is not a valid height";
        }
        // finish
        if (success) {
          block.refreshView();
          flowchart.blockView.requestDraw();
          flowchart.storeBlockStates();
          flowchart.storeConnectorStates();
          d.dialog('close');
        } else {
          Util.showInputError(message);
        }
      };
      const enterKeyUp = (e) => {
        if (e.key == "Enter") {
          okFunction();
        }
      };
      variableNameField.addEventListener("keyup", enterKeyUp);
      expressionField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 350,
        width: 390,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
