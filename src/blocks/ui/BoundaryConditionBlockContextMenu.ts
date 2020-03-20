/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {BoundaryConditionBlock} from "../BoundaryConditionBlock";

export class BoundaryConditionBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "boundary-condition-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>North:</td>
                  <td>
                    <select id="boundary-condition-block-north-type-selector" style="width: 100px">
                      <option value="None">None</option>
                      <option value="Dirichlet" selected>Dirichlet</option>
                      <option value="Neumann">Neumann</option>
                    </select>
                  </td>
                  <td><input type="text" id="boundary-condition-block-north-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>East:</td>
                  <td>
                    <select id="boundary-condition-block-east-type-selector" style="width: 100px">
                      <option value="None">None</option>
                      <option value="Dirichlet" selected>Dirichlet</option>
                      <option value="Neumann">Neumann</option>
                    </select>
                  </td>
                  <td><input type="text" id="boundary-condition-block-east-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>South:</td>
                  <td>
                    <select id="boundary-condition-block-south-type-selector" style="width: 100px">
                      <option value="None">None</option>
                      <option value="Dirichlet" selected>Dirichlet</option>
                      <option value="Neumann">Neumann</option>
                    </select>
                  </td>
                  <td><input type="text" id="boundary-condition-block-south-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>West:</td>
                  <td>
                    <select id="boundary-condition-block-west-type-selector" style="width: 100px">
                      <option value="None">None</option>
                      <option value="Dirichlet" selected>Dirichlet</option>
                      <option value="Neumann">Neumann</option>
                    </select>
                  </td>
                  <td><input type="text" id="boundary-condition-block-west-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td colspan="2"><input type="text" id="boundary-condition-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td colspan="2"><input type="text" id="boundary-condition-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof BoundaryConditionBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let northTypeSelector = document.getElementById("boundary-condition-block-north-type-selector") as HTMLSelectElement;
      northTypeSelector.value = block.boundaryCondition.north.type;
      let eastTypeSelector = document.getElementById("boundary-condition-block-east-type-selector") as HTMLSelectElement;
      eastTypeSelector.value = block.boundaryCondition.east.type;
      let southTypeSelector = document.getElementById("boundary-condition-block-south-type-selector") as HTMLSelectElement;
      southTypeSelector.value = block.boundaryCondition.south.type;
      let westTypeSelector = document.getElementById("boundary-condition-block-west-type-selector") as HTMLSelectElement;
      westTypeSelector.value = block.boundaryCondition.west.type;
      let northValueField = document.getElementById("boundary-condition-block-north-value-field") as HTMLInputElement;
      northValueField.value = block.boundaryCondition.north.value != undefined ? block.boundaryCondition.north.value.toString() : "0";
      let eastValueField = document.getElementById("boundary-condition-block-east-value-field") as HTMLInputElement;
      eastValueField.value = block.boundaryCondition.east.value != undefined ? block.boundaryCondition.east.value.toString() : "0";
      let southValueField = document.getElementById("boundary-condition-block-south-value-field") as HTMLInputElement;
      southValueField.value = block.boundaryCondition.south.value != undefined ? block.boundaryCondition.south.value.toString() : "0";
      let westValueField = document.getElementById("boundary-condition-block-west-value-field") as HTMLInputElement;
      westValueField.value = block.boundaryCondition.west.value != undefined ? block.boundaryCondition.west.value.toString() : "0";
      let widthField = document.getElementById("boundary-condition-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("boundary-condition-block-height-field") as HTMLInputElement;
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
        // set north value
        let northValue = parseFloat(northValueField.value);
        if (isNumber(northValue)) {
          block.boundaryCondition.north.value = northValue;
        } else {
          success = false;
          message = northValueField.value + " is not a valid number for north value";
        }
        // set east value
        let eastValue = parseFloat(eastValueField.value);
        if (isNumber(eastValue)) {
          block.boundaryCondition.east.value = eastValue;
        } else {
          success = false;
          message = eastValueField.value + " is not a valid number for east value";
        }
        // set south value
        let southValue = parseFloat(southValueField.value);
        if (isNumber(southValue)) {
          block.boundaryCondition.south.value = southValue;
        } else {
          success = false;
          message = southValueField.value + " is not a valid number for south value";
        }
        // set west value
        let westValue = parseFloat(westValueField.value);
        if (isNumber(westValue)) {
          block.boundaryCondition.west.value = westValue;
        } else {
          success = false;
          message = westValueField.value + " is not a valid number for west value";
        }
        // finish
        if (success) {
          block.boundaryCondition.north.type = northTypeSelector.value;
          block.boundaryCondition.east.type = eastTypeSelector.value;
          block.boundaryCondition.south.type = southTypeSelector.value;
          block.boundaryCondition.west.type = westTypeSelector.value;
          block.refreshView();
          flowchart.updateResultsForBlock(block);
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
      northValueField.addEventListener("keyup", enterKeyUp);
      eastValueField.addEventListener("keyup", enterKeyUp);
      southValueField.addEventListener("keyup", enterKeyUp);
      westValueField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 400,
        width: 400,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
