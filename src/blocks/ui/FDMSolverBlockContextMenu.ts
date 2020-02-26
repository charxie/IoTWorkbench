/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {FDMSolverBlock} from "../FDMSolverBlock";

export class FDMSolverBlockContextMenu extends BlockContextMenu {

  private dialogWidth: number = 450;
  private dialogHeight: number = 450;

  constructor() {
    super();
    this.id = "fdm-solver-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Variables (e.g. ["t","x"]):</td>
                  <td><input type="text" id="fdm-solver-block-variables-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Equations:<div style="font-size: 70%">(e.g., ["Tt=Txx"])</div></td>
                  <td><textarea id="fdm-solver-block-equations-field" rows="6" style="width: 100%"></textarea></td>
                </tr>
                <tr>
                  <td>Method:</td>
                  <td>
                    <select id="fdm-solver-block-method-selector" style="width: 100%">
                      <option value="Explicit" selected>Explicit</option>
                      <option value="Implicit">Implicit</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="fdm-solver-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="fdm-solver-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof FDMSolverBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let methodSelectElement = document.getElementById("fdm-solver-block-method-selector") as HTMLSelectElement;
      methodSelectElement.value = block.getMethod();
      let variablesInputElement = document.getElementById("fdm-solver-block-variables-field") as HTMLInputElement;
      variablesInputElement.value = block.getVariables() ? JSON.stringify(block.getVariables()) : "['t', 'x']";
      let equationsInputElement = document.getElementById("fdm-solver-block-equations-field") as HTMLTextAreaElement;
      equationsInputElement.value = JSON.stringify(block.getEquations());
      let widthInputElement = document.getElementById("fdm-solver-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("fdm-solver-block-height-field") as HTMLInputElement;
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
