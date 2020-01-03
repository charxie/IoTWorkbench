/*
 * @author Charles Xie
 */

import $ from "jquery";
import {Slider} from "../Slider";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart} from "../../Main";

export class SliderContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "slider-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 140px; z-index: 10000">
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

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="slider-name-field"></td>
                </tr>
                <tr>
                  <td>Minimum:</td>
                  <td><input type="text" id="slider-minimum-field"></td>
                </tr>
                <tr>
                  <td>Maximum:</td>
                  <td><input type="text" id="slider-maximum-field"></td>
                </tr>
                <tr>
                  <td>Steps:</td>
                  <td><input type="text" id="slider-steps-field"></td>
                </tr>
                <tr>
                  <td>Value:</td>
                  <td><input type="text" id="slider-value-field"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="slider-width-field"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="slider-height-field"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block) {
      let slider = <Slider>this.block;
      $("#modal-dialog").html(this.getPropertiesUI());
      let nameInputElement = document.getElementById("slider-name-field") as HTMLInputElement;
      nameInputElement.value = slider.getName();
      let minimumInputElement = document.getElementById("slider-minimum-field") as HTMLInputElement;
      minimumInputElement.value = slider.getMinimum().toString();
      let maximumInputElement = document.getElementById("slider-maximum-field") as HTMLInputElement;
      maximumInputElement.value = slider.getMaximum().toString();
      let stepsInputElement = document.getElementById("slider-steps-field") as HTMLInputElement;
      stepsInputElement.value = slider.getSteps().toString();
      let valueInputElement = document.getElementById("slider-value-field") as HTMLInputElement;
      valueInputElement.value = slider.getValue().toFixed(3);
      let widthInputElement = document.getElementById("slider-width-field") as HTMLInputElement;
      widthInputElement.value = slider.getWidth().toString();
      let heightInputElement = document.getElementById("slider-height-field") as HTMLInputElement;
      heightInputElement.value = slider.getHeight().toString();
      $("#modal-dialog").dialog({
        resizable: false,
        modal: true,
        title: slider.getUid(),
        height: 450,
        width: 300,
        buttons: {
          'OK': function () {
            slider.setName(nameInputElement.value);
            slider.setMinimum(parseFloat(minimumInputElement.value));
            slider.setMaximum(parseFloat(maximumInputElement.value));
            slider.setSteps(parseInt(stepsInputElement.value));
            slider.setValue(parseFloat(valueInputElement.value));
            slider.setWidth(parseInt(widthInputElement.value));
            slider.setHeight(parseInt(heightInputElement.value));
            slider.refreshView();
            flowchart.storeBlockStates();
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
