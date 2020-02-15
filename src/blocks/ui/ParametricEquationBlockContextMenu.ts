/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {ParametricEquationBlock} from "../ParametricEquationBlock";

export class ParametricEquationBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "parametric-equation-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Parameter Name (e.g., t):</td>
                  <td><input type="text" id="parametric-equation-block-parameter-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Expression for X (e.g., cos(t)):</td>
                  <td><input type="text" id="parametric-equation-block-expression-x-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Expression for Y (e.g. sin(t)):</td>
                  <td><input type="text" id="parametric-equation-block-expression-y-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="parametric-equation-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="parametric-equation-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof ParametricEquationBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let parameterNameInputElement = document.getElementById("parametric-equation-block-parameter-name-field") as HTMLInputElement;
      parameterNameInputElement.value = block.getParameterName() ? block.getParameterName().toString() : "t";
      let expressionXInputElement = document.getElementById("parametric-equation-block-expression-x-field") as HTMLInputElement;
      expressionXInputElement.value = block.getExpressionX() ? block.getExpressionX().toString() : "cos(t)";
      let expressionYInputElement = document.getElementById("parametric-equation-block-expression-y-field") as HTMLInputElement;
      expressionYInputElement.value = block.getExpressionY() ? block.getExpressionY().toString() : "sin(t)";
      let widthInputElement = document.getElementById("parametric-equation-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("parametric-equation-block-height-field") as HTMLInputElement;
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
        // set parameter name and expressions
        block.setParameterName(parameterNameInputElement.value);
        block.setExpressionX(expressionXInputElement.value);
        block.setExpressionY(expressionYInputElement.value);
        block.useDeclaredFunctions();
        try {
          flowchart.updateResultsForBlock(block);
        } catch (err) {
          success = false;
          message = expressionXInputElement.value + ", " + expressionYInputElement.value + " are not valid expressions.";
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
      parameterNameInputElement.addEventListener("keyup", enterKeyUp);
      expressionXInputElement.addEventListener("keyup", enterKeyUp);
      expressionYInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 360,
        width: 500,
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
