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
      let variablesField = document.getElementById("steady-state-fdm-solver-block-variables-field") as HTMLInputElement;
      variablesField.value = block.getVariables() ? JSON.stringify(block.getVariables()) : "['x', 'y']";
      let equationsField = document.getElementById("steady-state-fdm-solver-block-equations-field") as HTMLTextAreaElement;
      equationsField.value = JSON.stringify(block.getEquations()).replaceAll(',', ',\n');
      let relaxationStepsField = document.getElementById("steady-state-fdm-solver-block-relaxation-steps-field") as HTMLInputElement;
      relaxationStepsField.value = block.getRelaxationSteps().toString();
      let relaxationFactorField = document.getElementById("steady-state-fdm-solver-block-relaxation-factor-field") as HTMLInputElement;
      relaxationFactorField.value = block.getRelaxationFactor().toString();
      let widthField = document.getElementById("steady-state-fdm-solver-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("steady-state-fdm-solver-block-height-field") as HTMLInputElement;
      heightField.value = Math.round(block.getHeight()).toString();
      const okFunction = () => {
        let success = true;
        let message;
        // set relaxation steps
        let relaxationSteps = parseInt(relaxationStepsField.value);
        if (isNumber(relaxationSteps)) {
          block.setRelaxationSteps(Math.max(5, relaxationSteps));
        } else {
          success = false;
          message = relaxationStepsField.value + " is not a valid relaxation step";
        }
        // set relaxation factor
        let relaxationFactor = parseFloat(relaxationFactorField.value);
        if (isNumber(relaxationFactor)) {
          block.setRelaxationFactor(Math.min(1.99, Math.max(0.1, relaxationFactor)));
        } else {
          success = false;
          message = relaxationFactorField.value + " is not a valid relaxation factor";
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
        // set variables
        if (JSON.stringify(block.getVariables()) !== variablesField.value) {
          try {
            block.setVariables(JSON.parse(variablesField.value));
          } catch (err) {
            console.log(err.stack);
            success = false;
            message = equationsField.value + " is not a valid array for variables";
          }
        }
        // set equations
        if (JSON.stringify(block.getEquations()) !== equationsField.value) {
          try {
            block.setEquations(JSON.parse(equationsField.value));
            block.findCoefficients();
            block.useDeclaredFunctions();
          } catch (err) {
            console.log(err.stack);
            success = false;
            message = equationsField.value + " is not a valid array for equations";
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
      variablesField.addEventListener("keyup", enterKeyUp);
      relaxationStepsField.addEventListener("keyup", enterKeyUp);
      relaxationFactorField.addEventListener("keyup", enterKeyUp);
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
