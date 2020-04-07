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
                  <td>Parameter Name1 (e.g., t):</td>
                  <td><input type="text" id="parametric-equation-block-parameter-name1-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Parameter Name2 (e.g., v):</td>
                  <td><input type="text" id="parametric-equation-block-parameter-name2-field" style="width: 100%"></td>
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
                  <td>Expression for Z (e.g. 2*t):</td>
                  <td><input type="text" id="parametric-equation-block-expression-z-field" style="width: 100%"></td>
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
      let parameterName1Field = document.getElementById("parametric-equation-block-parameter-name1-field") as HTMLInputElement;
      parameterName1Field.value = block.getParameterName1() ? block.getParameterName1().toString() : "t";
      let parameterName2Field = document.getElementById("parametric-equation-block-parameter-name2-field") as HTMLInputElement;
      parameterName2Field.value = block.getParameterName2() ? block.getParameterName2().toString() : "";
      let expressionXField = document.getElementById("parametric-equation-block-expression-x-field") as HTMLInputElement;
      expressionXField.value = block.getExpressionX() ? block.getExpressionX() : "cos(t)";
      let expressionYField = document.getElementById("parametric-equation-block-expression-y-field") as HTMLInputElement;
      expressionYField.value = block.getExpressionY() ? block.getExpressionY() : "sin(t)";
      let expressionZField = document.getElementById("parametric-equation-block-expression-z-field") as HTMLInputElement;
      expressionZField.value = block.getExpressionZ() ? block.getExpressionZ() : "";
      let widthField = document.getElementById("parametric-equation-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("parametric-equation-block-height-field") as HTMLInputElement;
      heightField.value = Math.round(block.getHeight()).toString();
      const okFunction = () => {
        let success = true;
        let message;
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
        // set parameter name and expressions
        block.setParameterName1(parameterName1Field.value);
        block.setParameterName2(parameterName2Field.value);
        block.setExpressionX(expressionXField.value);
        block.setExpressionY(expressionYField.value);
        block.setExpressionZ(expressionZField.value);
        block.useDeclaredFunctions();
        try {
          flowchart.updateResultsForBlock(block);
        } catch (err) {
          success = false;
          message = expressionXField.value + ", " + expressionYField.value + " are not valid expressions";
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
      const enterKeyUp = (e) => {
        if (e.key == "Enter") {
          okFunction();
        }
      };
      parameterName1Field.addEventListener("keyup", enterKeyUp);
      parameterName2Field.addEventListener("keyup", enterKeyUp);
      expressionXField.addEventListener("keyup", enterKeyUp);
      expressionYField.addEventListener("keyup", enterKeyUp);
      expressionZField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 430,
        width: 500,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
