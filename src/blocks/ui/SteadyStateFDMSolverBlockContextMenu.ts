/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {SteadyStateFDMSolverBlock} from "../SteadyStateFDMSolverBlock";

export class SteadyStateFDMSolverBlockContextMenu extends BlockContextMenu {

  private dialogWidth: number = 450;
  private dialogHeight: number = 450;

  constructor() {
    super();
    this.id = "steady-state-fdm-solver-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Variables (e.g. ["x","y"]):</td>
                  <td><input type="text" id="steady-state-fdm-solver-block-variables-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Equations:<div style="font-size: 70%">(e.g., ["A*T_xx+2*B*T_xy+C*T_yy<br>+D*T_x+E*T_y+F*T+G=0"])</div></td>
                  <td><textarea id="steady-state-fdm-solver-block-equations-field" rows="6" style="width: 100%"></textarea></td>
                </tr>
                <tr>
                  <td>Method:</td>
                  <td>
                    <select id="steady-state-fdm-solver-block-method-selector" style="width: 100%">
                      <option value="Jacobi">Jacobi</option>
                      <option value="Gauss-Seidel" selected>Gauss-Seidel</option>
                      <option value="Successive Over-Relaxation">Successive Over-Relaxation</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Relaxation Steps:</td>
                  <td><input type="text" id="steady-state-fdm-solver-block-relaxation-steps-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Relaxation Factor (0, 2):</td>
                  <td><input type="text" id="steady-state-fdm-solver-block-relaxation-factor-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="steady-state-fdm-solver-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="steady-state-fdm-solver-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof SteadyStateFDMSolverBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let methodSelectElement = document.getElementById("steady-state-fdm-solver-block-method-selector") as HTMLSelectElement;
      methodSelectElement.value = block.getMethod();
      let variablesInputElement = document.getElementById("steady-state-fdm-solver-block-variables-field") as HTMLInputElement;
      variablesInputElement.value = block.getVariables() ? JSON.stringify(block.getVariables()) : "['x', 'y']";
      let equationsInputElement = document.getElementById("steady-state-fdm-solver-block-equations-field") as HTMLTextAreaElement;
      equationsInputElement.value = JSON.stringify(block.getEquations());
      let relaxationStepsInputElement = document.getElementById("steady-state-fdm-solver-block-relaxation-steps-field") as HTMLInputElement;
      relaxationStepsInputElement.value = block.getRelaxationSteps().toString();
      let relaxationFactorInputElement = document.getElementById("steady-state-fdm-solver-block-relaxation-factor-field") as HTMLInputElement;
      relaxationFactorInputElement.value = block.getRelaxationFactor().toString();
      let widthInputElement = document.getElementById("steady-state-fdm-solver-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("steady-state-fdm-solver-block-height-field") as HTMLInputElement;
      heightInputElement.value = block.getHeight().toString();
      const okFunction = function () {
        let success = true;
        let message;
        // set relaxation steps
        let relaxationSteps = parseInt(relaxationStepsInputElement.value);
        if (isNumber(relaxationSteps)) {
          block.setRelaxationSteps(Math.max(5, relaxationSteps));
        } else {
          success = false;
          message = relaxationStepsInputElement.value + " is not a valid relaxation step.";
        }
        // set relaxation factor
        let relaxationFactor = parseFloat(relaxationFactorInputElement.value);
        if (isNumber(relaxationFactor)) {
          block.setRelaxationFactor(Math.min(1.99, Math.max(0.1, relaxationFactor)));
        } else {
          success = false;
          message = relaxationFactorInputElement.value + " is not a valid relaxation factor.";
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
        // set variables
        if (JSON.stringify(block.getVariables()) !== variablesInputElement.value) {
          try {
            block.setVariables(JSON.parse(variablesInputElement.value));
          } catch (err) {
            console.log(err.stack);
            success = false;
            message = equationsInputElement.value + " is not a valid array for variables.";
          }
        }
        // set equations
        if (JSON.stringify(block.getEquations()) !== equationsInputElement.value) {
          try {
            block.setEquations(JSON.parse(equationsInputElement.value));
            block.useDeclaredFunctions();
          } catch (err) {
            console.log(err.stack);
            success = false;
            message = equationsInputElement.value + " is not a valid array for equations.";
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
      variablesInputElement.addEventListener("keyup", enterKeyUp);
      relaxationStepsInputElement.addEventListener("keyup", enterKeyUp);
      relaxationFactorInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      let that = this;
      d.dialog({
        resizable: true,
        modal: true,
        title: block.getUid(),
        height: that.dialogHeight,
        width: that.dialogWidth,
        resize: function (e, ui) {
          // @ts-ignore
          that.dialogWidth = ui.size.width;
          // @ts-ignore
          that.dialogHeight = ui.size.height;
        },
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
