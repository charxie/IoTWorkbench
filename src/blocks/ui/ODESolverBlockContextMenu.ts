/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {ODESolverBlock} from "../ODESolverBlock";

export class ODESolverBlockContextMenu extends BlockContextMenu {

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
                  <td>Equations:<div style="font-size: 70%">(e.g., ["x'=x"])</div></td>
                  <td><textarea id="ode-solver-block-equations-field" rows="5" style="width: 100%"></textarea></td>
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
      let variableNameInputElement = document.getElementById("ode-solver-block-variable-name-field") as HTMLInputElement;
      variableNameInputElement.value = block.getVariableName() ? block.getVariableName() : "x";
      let equationsInputElement = document.getElementById("ode-solver-block-equations-field") as HTMLTextAreaElement;
      equationsInputElement.value = JSON.stringify(block.getEquations());
      let widthInputElement = document.getElementById("ode-solver-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("ode-solver-block-height-field") as HTMLInputElement;
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
        // set equations
        if (JSON.stringify(block.getEquations()) != equationsInputElement.value) {
          try {
            block.setEquations(JSON.parse(equationsInputElement.value));
            block.useDeclaredFunctions();
          } catch (err) {
            console.log(err.stack);
            success = false;
            message = equationsInputElement.value + " is not a valid array.";
          }
          try {
            flowchart.updateResultsForBlock(block);
          } catch (err) {
            success = false;
            message = JSON.stringify(equationsInputElement.value) + " are not valid equations.";
          }
        }
        // finish up
        if (success) {
          block.setMethod(methodSelectElement.value);
          block.setVariableName(variableNameInputElement.value);
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
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 430,
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
