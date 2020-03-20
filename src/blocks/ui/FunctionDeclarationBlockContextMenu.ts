/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {FunctionDeclarationBlock} from "../FunctionDeclarationBlock";

export class FunctionDeclarationBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "function-declaration-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Variable Name (e.g. x):</td>
                  <td><input type="text" id="function-declaration-block-variable-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Function Name (e.g., f):</td>
                  <td><input type="text" id="function-declaration-block-function-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Expression:</td>
                  <td><input type="text" id="function-declaration-block-expression-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="function-declaration-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="function-declaration-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof FunctionDeclarationBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let variableNamesField = document.getElementById("function-declaration-block-variable-name-field") as HTMLInputElement;
      variableNamesField.value = block.getVariableNames() !== undefined ? JSON.stringify(block.getVariableNames()) : "[x]";
      let functionNameField = document.getElementById("function-declaration-block-function-name-field") as HTMLInputElement;
      functionNameField.value = block.getFunctionName() ? block.getFunctionName() : "f";
      let expressionField = document.getElementById("function-declaration-block-expression-field") as HTMLInputElement;
      expressionField.value = block.getExpression() ? block.getExpression() : "x";
      let widthField = document.getElementById("function-declaration-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("function-declaration-block-height-field") as HTMLInputElement;
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
        // set function name and expression
        let redefine = false;
        let fun = functionNameField.value + "(" + variableNamesField.value + ")";
        if (functionNameField.value !== block.getFunctionName()) {
          if (flowchart.isFunctionNameDeclared(fun)) {
            success = false;
            message = "The function " + name + " is already declared";
          }
        } else {
          redefine = true;
        }
        let expression = expressionField.value;
        if (expression !== block.getExpression()) {
          if (!redefine && flowchart.isFunctionExpressionDeclared(fun, expression)) {
            success = false;
            message = "The function expression " + expression + " is already declared";
          }
        }
        // set variables
        if (JSON.stringify(block.getVariableNames()) !== variableNamesField.value) {
          try {
            block.setVariableNames(JSON.parse(variableNamesField.value));
          } catch (err) {
            console.log(err.stack);
            success = false;
            message = variableNamesField.value + " is not a valid array for variable names";
          }
        }
        // finish
        if (success) {
          block.setVariableNames(JSON.parse(variableNamesField.value));
          block.setFunctionName(functionNameField.value);
          block.setExpression(expression);
          flowchart.updateFunctionDeclaration(block);
          flowchart.useDeclaredFunctions();
          block.refreshView();
          flowchart.updateResults(); // global variable must update the results globally
          flowchart.storeBlockStates();
          flowchart.storeConnectorStates();
          flowchart.blockView.requestDraw();
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
      variableNamesField.addEventListener("keyup", enterKeyUp);
      functionNameField.addEventListener("keyup", enterKeyUp);
      expressionField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 360,
        width: 420,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
