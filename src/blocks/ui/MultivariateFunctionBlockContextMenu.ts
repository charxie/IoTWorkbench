/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {TurnoutSwitch} from "../TurnoutSwitch";
import {SwitchStatementBlock} from "../SwitchStatementBlock";
import {MultivariateFunctionBlock} from "../MultivariateFunctionBlock";

export class MultivariateFunctionBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "multivariate-function-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Variables:<div style="font-size: 70%">(e.g., ["x", "y", "z"])</div></td>
                  <td><textarea id="multivariate-function-block-cases-area" rows="3" style="width: 100%"></textarea></td>
                </tr>
                <tr>
                  <td>Expression (e.g. x+y+z):</td>
                  <td><input type="text" id="multivariate-function-block-expression-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Inset Margin:</td>
                  <td><input type="text" id="multivariate-function-inset-margin-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="multivariate-function-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="multivariate-function-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof MultivariateFunctionBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let variablesArea = document.getElementById("multivariate-function-block-cases-area") as HTMLTextAreaElement;
      variablesArea.value = JSON.stringify(block.getVariables());
      let expressionField = document.getElementById("multivariate-function-block-expression-field") as HTMLInputElement;
      expressionField.value = block.getExpression() ? block.getExpression().toString() : "x+y+z";
      let insetMarginField = document.getElementById("multivariate-function-inset-margin-field") as HTMLInputElement;
      insetMarginField.value = block.getMarginX().toString();
      let widthField = document.getElementById("multivariate-function-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("multivariate-function-block-height-field") as HTMLInputElement;
      heightField.value = Math.round(block.getHeight()).toString();
      const okFunction = () => {
        let success = true;
        let message;
        // set inset margin
        let margin = parseInt(insetMarginField.value);
        if (isNumber(margin)) {
          block.setMarginX(Math.max(15, margin));
        } else {
          success = false;
          message = insetMarginField.value + " is not a valid margin";
        }
        // set variables
        if (JSON.stringify(block.getVariables()) != variablesArea.value) {
          try {
            block.setVariables(JSON.parse(variablesArea.value));
          } catch (err) {
            console.log(err.stack);
            success = false;
            message = variablesArea.value + " is not a valid array for variables";
          }
        }
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
      expressionField.addEventListener("keyup", enterKeyUp);
      insetMarginField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 400,
        width: 450,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
