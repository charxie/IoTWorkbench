/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {UnaryFunctionBlock} from "../UnaryFunctionBlock";
import {Util} from "../../Util";

export class UnivariateFunctionBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "univariate-function-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Variable Name (e.g. x):</td>
                  <td><input type="text" id="univariate-function-block-variable-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Expression (e.g. sin(x)):</td>
                  <td><input type="text" id="univariate-function-block-expression-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="univariate-function-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="univariate-function-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof UnaryFunctionBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let variableNameInputElement = document.getElementById("univariate-function-block-variable-name-field") as HTMLInputElement;
      variableNameInputElement.value = block.getVariableName() ? block.getVariableName() : "x";
      let expressionInputElement = document.getElementById("univariate-function-block-expression-field") as HTMLInputElement;
      expressionInputElement.value = block.getExpression() ? block.getExpression().toString() : "x";
      let widthInputElement = document.getElementById("univariate-function-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("univariate-function-block-height-field") as HTMLInputElement;
      heightInputElement.value = block.getHeight().toString();
      const okFunction = function () {
        let success = true;
        let message;
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
        block.setVariableName(variableNameInputElement.value);
        block.setExpression(expressionInputElement.value);
        block.useDeclaredFunctions();
        try {
          flowchart.updateResultsForBlock(block);
        } catch (err) {
          success = false;
          message = expressionInputElement.value + " is not a valid expression.";
        }
        // finish up
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
        height: 300,
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
