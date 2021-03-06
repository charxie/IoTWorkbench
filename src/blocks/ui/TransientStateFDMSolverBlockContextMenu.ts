/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {TransientStateFDMSolverBlock} from "../TransientStateFDMSolverBlock";

export class TransientStateFDMSolverBlockContextMenu extends BlockContextMenu {

  private dialogWidth: number = 450;
  private dialogHeight: number = 500;

  constructor() {
    super();
    this.id = "transient-state-fdm-solver-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Variables (e.g. ["t","x"]):</td>
                  <td><input type="text" id="transient-state-fdm-solver-block-variables-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Equations:<div style="font-size: 70%">(e.g., ["T_t=T_xx"])</div></td>
                  <td><textarea id="transient-state-fdm-solver-block-equations-field" rows="6" style="width: 100%"></textarea></td>
                </tr>
                <tr>
                  <td>Method:</td>
                  <td>
                    <select id="transient-state-fdm-solver-block-method-selector" style="width: 100%">
                      <option value="Explicit" selected>Explicit</option>
                      <option value="Implicit">Implicit</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Boundary:</td>
                  <td>
                    <select id="transient-state-fdm-solver-block-boundary-selector" style="width: 100%">
                      <option value="Dirichlet" selected>Dirichlet</option>
                      <option value="Neumann">Neumann</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="transient-state-fdm-solver-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="transient-state-fdm-solver-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof TransientStateFDMSolverBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let methodSelector = document.getElementById("transient-state-fdm-solver-block-method-selector") as HTMLSelectElement;
      methodSelector.value = block.getMethod();
      let boundarySelector = document.getElementById("transient-state-fdm-solver-block-boundary-selector") as HTMLSelectElement;
      boundarySelector.value = block.getBoundary();
      let variablesField = document.getElementById("transient-state-fdm-solver-block-variables-field") as HTMLInputElement;
      variablesField.value = block.getVariables() ? JSON.stringify(block.getVariables()) : "['t', 'x']";
      let equationsField = document.getElementById("transient-state-fdm-solver-block-equations-field") as HTMLTextAreaElement;
      equationsField.value = JSON.stringify(block.getEquations(), null, 2);
      let widthField = document.getElementById("transient-state-fdm-solver-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("transient-state-fdm-solver-block-height-field") as HTMLInputElement;
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
          block.setMethod(methodSelector.value);
          block.setBoundary(boundarySelector.value);
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
