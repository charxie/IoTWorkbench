/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {UnaryFunctionBlock} from "../UnaryFunctionBlock";

export class UnaryFunctionBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "unary-function-block-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 120px; z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-copy-button"><i class="fas fa-copy"></i><span class="menu-text">Copy</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-delete-button"><i class="fas fa-trash"></i><span class="menu-text">Delete</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-code-button"><i class="fas fa-code"></i><span class="menu-text">Code</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-properties-button"><i class="fas fa-cog"></i><span class="menu-text">Properties</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    super.addListeners();
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Expression (e.g. sin(x)):</td>
                  <td><input type="text" id="unary-function-block-expression-field"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="unary-function-block-width-field"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="unary-function-block-height-field"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof UnaryFunctionBlock) {
      let block = this.block;
      let d = $("#modal-dialog").html(this.getPropertiesUI());
      let expressionInputElement = document.getElementById("unary-function-block-expression-field") as HTMLInputElement;
      expressionInputElement.value = block.getExpression() ? block.getExpression().toString() : "x";
      let widthInputElement = document.getElementById("unary-function-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("unary-function-block-height-field") as HTMLInputElement;
      heightInputElement.value = block.getHeight().toString();
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 300,
        width: 400,
        buttons: {
          'OK': function () {
            block.setExpression(expressionInputElement.value);
            block.setWidth(parseInt(widthInputElement.value));
            block.setHeight(parseInt(heightInputElement.value));
            block.refreshView();
            flowchart.updateResults();
            flowchart.draw();
            $(this).dialog('close');
          },
          'Cancel': function () {
            $(this).dialog('close');
          }
        }
      });
    }
  }

}
