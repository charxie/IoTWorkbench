/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {BivariateFunctionBlock} from "../BivariateFunctionBlock";
import {Util} from "../../Util";

export class BivariateFunctionBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "bivariate-function-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Variable 1 Name (e.g. x):</td>
                  <td><input type="text" id="bivariate-function-block-variable1-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Variable 2 Name (e.g. y):</td>
                  <td><input type="text" id="bivariate-function-block-variable2-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Expression (e.g. sin(x+y)):</td>
                  <td><input type="text" id="bivariate-function-block-expression-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Output Array:</td>
                  <td>
                    <input type="radio" name="output-array" id="bivariate-function-block-output-1d-radio-button" checked> 1D
                    <input type="radio" name="output-array" id="bivariate-function-block-output-2d-radio-button"> 2D
                    <input type="radio" name="output-array" id="bivariate-function-block-output-xyz-radio-button"> XYZ
                  </td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="bivariate-function-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="bivariate-function-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof BivariateFunctionBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let variable1NameField = document.getElementById("bivariate-function-block-variable1-name-field") as HTMLInputElement;
      variable1NameField.value = block.getVariable1Name() ? block.getVariable1Name() : "x";
      let variable2NameField = document.getElementById("bivariate-function-block-variable2-name-field") as HTMLInputElement;
      variable2NameField.value = block.getVariable2Name() ? block.getVariable2Name() : "y";
      let expressionField = document.getElementById("bivariate-function-block-expression-field") as HTMLInputElement;
      expressionField.value = block.getExpression() ? block.getExpression() : "x+y";
      let output1DRadioButton = document.getElementById("bivariate-function-block-output-1d-radio-button") as HTMLInputElement;
      output1DRadioButton.checked = block.getOutputArrayType() === "1D";
      let output2DRadioButton = document.getElementById("bivariate-function-block-output-2d-radio-button") as HTMLInputElement;
      output2DRadioButton.checked = block.getOutputArrayType() === "2D";
      let outputXyzRadioButton = document.getElementById("bivariate-function-block-output-xyz-radio-button") as HTMLInputElement;
      outputXyzRadioButton.checked = block.getOutputArrayType() === "XYZ";
      let widthField = document.getElementById("bivariate-function-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("bivariate-function-block-height-field") as HTMLInputElement;
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
        block.setVariable1Name(variable1NameField.value);
        block.setVariable2Name(variable2NameField.value);
        block.setExpression(expressionField.value);
        block.useDeclaredFunctions();
        try {
          flowchart.updateResultsForBlock(block);
        } catch (err) {
          success = false;
          message = expressionField.value + " is not a valid expression";
        }
        // finish up
        if (success) {
          if (output1DRadioButton.checked) block.setOutputArrayType("1D");
          else if (output2DRadioButton.checked) block.setOutputArrayType("2D");
          else if (outputXyzRadioButton.checked) block.setOutputArrayType("XYZ");
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
      variable1NameField.addEventListener("keyup", enterKeyUp);
      variable2NameField.addEventListener("keyup", enterKeyUp);
      expressionField.addEventListener("keyup", enterKeyUp);
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
