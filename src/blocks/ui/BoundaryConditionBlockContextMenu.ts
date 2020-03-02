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
                  <td>Type:</td>
                  <td>
                    <select id="boundary-condition-block-type-selector" style="width: 100%">
                      <option value="Dirichlet" selected>Dirichlet</option>
                      <option value="Neumann">Neumann</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>North Value:</td>
                  <td><input type="text" id="boundary-condition-block-north-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>East Value:</td>
                  <td><input type="text" id="boundary-condition-block-east-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>South Value:</td>
                  <td><input type="text" id="boundary-condition-block-south-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>West Value:</td>
                  <td><input type="text" id="boundary-condition-block-west-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="boundary-condition-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="boundary-condition-block-height-field" style="width: 100%"></td>
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
      let typeSelectElement = document.getElementById("boundary-condition-block-type-selector") as HTMLSelectElement;
      typeSelectElement.value = block.getType();
      let northValueInputElement = document.getElementById("boundary-condition-block-north-value-field") as HTMLInputElement;
      northValueInputElement.value = block.getNorthValue() != undefined ? block.getNorthValue().toString() : "0";
      let eastValueInputElement = document.getElementById("boundary-condition-block-east-value-field") as HTMLInputElement;
      eastValueInputElement.value = block.getEastValue() != undefined ? block.getEastValue().toString() : "0";
      let southValueInputElement = document.getElementById("boundary-condition-block-south-value-field") as HTMLInputElement;
      southValueInputElement.value = block.getSouthValue() != undefined ? block.getSouthValue().toString() : "0";
      let westValueInputElement = document.getElementById("boundary-condition-block-west-value-field") as HTMLInputElement;
      westValueInputElement.value = block.getWestValue() != undefined ? block.getWestValue().toString() : "0";
      let widthInputElement = document.getElementById("boundary-condition-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("boundary-condition-block-height-field") as HTMLInputElement;
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
        // set north value
        let northValue = parseFloat(northValueInputElement.value);
        if (isNumber(northValue)) {
          block.setNorthValue(northValue);
        } else {
          success = false;
          message = northValueInputElement.value + " is not a valid number for north value.";
        }
        // set east value
        let eastValue = parseFloat(eastValueInputElement.value);
        if (isNumber(eastValue)) {
          block.setEastValue(eastValue);
        } else {
          success = false;
          message = eastValueInputElement.value + " is not a valid number for east value.";
        }
        // set south value
        let southValue = parseFloat(southValueInputElement.value);
        if (isNumber(southValue)) {
          block.setSouthValue(southValue);
        } else {
          success = false;
          message = southValueInputElement.value + " is not a valid number for south value.";
        }
        // set west value
        let westValue = parseFloat(westValueInputElement.value);
        if (isNumber(westValue)) {
          block.setWestValue(westValue);
        } else {
          success = false;
          message = westValueInputElement.value + " is not a valid number for west value.";
        }
        // finish
        if (success) {
          block.setType(typeSelectElement.value);
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
      const enterKeyUp = function (e) {
        if (e.key == "Enter") {
          okFunction();
        }
      };
      northValueInputElement.addEventListener("keyup", enterKeyUp);
      eastValueInputElement.addEventListener("keyup", enterKeyUp);
      southValueInputElement.addEventListener("keyup", enterKeyUp);
      westValueInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 430,
        width: 400,
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
