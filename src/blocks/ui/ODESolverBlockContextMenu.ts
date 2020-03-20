/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {ODESolverBlock} from "../ODESolverBlock";

export class ODESolverBlockContextMenu extends BlockContextMenu {

  private dialogWidth: number = 450;
  private dialogHeight: number = 450;

  constructor() {
    super();
    this.id = "ode-solver-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Variable Name (e.g. t):</td>
                  <td><input type="text" id="ode-solver-block-variable-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Equations:<div style="font-size: 70%">(The left-hand-side must be only<br>the first-order derivative of a function<br>to be solved and the rest goes to<br>the right-hand-side, e.g., ["x'=a*x"].
                  <br>Higher-order ODEs must be<br>decomposed into a system of<br>first-order ODEs.)</div></td>
                  <td><textarea id="ode-solver-block-equations-field" rows="6" style="width: 100%"></textarea></td>
                </tr>
                <tr>
                  <td>Method:</td>
                  <td>
                    <select id="ode-solver-block-method-selector" style="width: 100%">
                      <option value="Euler" selected>Euler</option>
                      <option value="RK4">Runge-Kutta (RK4)</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="ode-solver-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="ode-solver-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof ODESolverBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let methodSelectElement = document.getElementById("ode-solver-block-method-selector") as HTMLSelectElement;
      methodSelectElement.value = block.getMethod();
      let variableNameField = document.getElementById("ode-solver-block-variable-name-field") as HTMLInputElement;
      variableNameField.value = block.getVariableName() ? block.getVariableName() : "x";
      let equationsField = document.getElementById("ode-solver-block-equations-field") as HTMLTextAreaElement;
      equationsField.value = JSON.stringify(block.getEquations()).replaceAll(',', ',\n');
      let widthField = document.getElementById("ode-solver-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("ode-solver-block-height-field") as HTMLInputElement;
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
        // set equations
        if (JSON.stringify(block.getEquations()) != equationsField.value) {
          try {
            block.setEquations(JSON.parse(equationsField.value));
            block.useDeclaredFunctions();
          } catch (err) {
            console.log(err.stack);
            success = false;
            message = equationsField.value + " is not a valid array";
          }
          try {
            flowchart.updateResultsForBlock(block);
          } catch (err) {
            success = false;
            message = JSON.stringify(equationsField.value) + " are not valid equations";
          }
        }
        // finish up
        if (success) {
          block.setMethod(methodSelectElement.value);
          block.setVariableName(variableNameField.value);
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
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: true,
        modal: true,
        title: block.getUid(),
        height: this.dialogHeight,
        width: this.dialogWidth,
        resize: (e, ui) => {
          // @ts-ignore
          this.dialogWidth = ui.size.width;
          // @ts-ignore
          this.dialogHeight = ui.size.height;
        },
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
