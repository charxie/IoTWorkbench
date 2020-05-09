/*
 * @author Charles Xie
 */

import $ from "jquery";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Util} from "../../Util";
import {PngSaver} from "../../tools/PngSaver";
import {WordCloud} from "../WordCloud";

export class WordCloudContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "wordcloud-block-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 150px; z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-copy-button"><i class="fas fa-copy"></i><span class="menu-text">Copy</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-delete-button"><i class="fas fa-trash"></i><span class="menu-text">Delete</span></button>
              </li>
              <li class="menu-separator"></li>` + this.getLayerMenu() + `<li class="menu-separator"></li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-save-image-button"><i class="fas fa-camera"></i><span class="menu-text">Save Image</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-properties-button"><i class="fas fa-cog"></i><span class="menu-text">Properties</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    super.addListeners();
    let saveImageButton = document.getElementById(this.id + "-save-image-button");
    saveImageButton.addEventListener("click", this.saveImageButtonClick.bind(this), false);
  }

  private saveImageButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    PngSaver.saveAs((<WordCloud>this.block).toCanvas());
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td colspan="2"><input type="text" id="wordcloud-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Color Scheme:</td>
                  <td colspan="2">
                    <select id="wordcloud-color-scheme-selector" style="width: 100%">
                      <option value="Turbo">Turbo</option>
                      <option value="Reds">Reds</option>
                      <option value="Greens">Greens</option>
                      <option value="Blues">Blues</option>
                      <option value="Greys">Greys</option>
                      <option value="Oranges">Oranges</option>
                      <option value="Purples">Purples</option>
                      <option value="Warm">Warm</option>
                      <option value="Cool">Cool</option>
                      <option value="Magma">Magma</option>
                      <option value="Plasma">Plasma</option>
                      <option value="Inferno">Inferno</option>
                      <option value="Spectral">Spectral</option>
                      <option value="Cividis">Cividis</option>
                      <option value="Viridis">Viridis</option>
                      <option value="Rainbow">Rainbow</option>
                      <option value="Sinebow">Sinebow</option>
                      <option value="Cubehelix">Cubehelix</option>
                      <option value="RdYlBu">RdYlBu</option>
                      <option value="RdYlGn">RdYlGn</option>
                      <option value="RdGy">RdGy</option>
                      <option value="RdBu">RdBu</option>
                      <option value="PuOr">PuOr</option>
                      <option value="PiYG">PiYG</option>
                      <option value="PRGn">PRGn</option>
                      <option value="BrBG">BrBG</option>
                      <option value="BuGn">BuGn</option>
                      <option value="BuPu">BuPu</option>
                      <option value="GnBu">GnBu</option>
                      <option value="OrRd">OrRd</option>
                      <option value="PuBu">PuBu</option>
                      <option value="PuBuGn">PuBuGn</option>
                      <option value="PuRd" selected>PuRd</option>
                      <option value="RdPu">RdPu</option>
                      <option value="YlGn">YlGn</option>
                      <option value="YlGnBu">YlGnBu</option>
                      <option value="YlOrBr">YlOrBr</option>
                      <option value="YlOrRd">YlOrRd</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Window Color:</td>
                  <td><input type="color" id="wordcloud-window-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="wordcloud-window-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td colspan="2"><input type="text" id="wordcloud-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td colspan="2"><input type="text" id="wordcloud-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof WordCloud) {
      const g = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameField = document.getElementById("wordcloud-name-field") as HTMLInputElement;
      nameField.value = g.getName();
      let colorSchemeSelector = document.getElementById("wordcloud-color-scheme-selector") as HTMLSelectElement;
      colorSchemeSelector.value = g.getColorScheme();
      let windowColorField = document.getElementById("wordcloud-window-color-field") as HTMLInputElement;
      windowColorField.value = g.getViewWindowColor();
      let windowColorChooser = document.getElementById("wordcloud-window-color-chooser") as HTMLInputElement;
      Util.setColorPicker(windowColorChooser, g.getViewWindowColor());
      let widthField = document.getElementById("wordcloud-width-field") as HTMLInputElement;
      widthField.value = Math.round(g.getWidth()).toString();
      let heightField = document.getElementById("wordcloud-height-field") as HTMLInputElement;
      heightField.value = Math.round(g.getHeight()).toString();
      Util.hookupColorInputs(windowColorField, windowColorChooser);
      const okFunction = () => {
        let success = true;
        let message;
        // set width
        let w = parseInt(widthField.value);
        if (isNumber(w)) {
          g.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthField.value + " is not a valid width";
        }
        // set height
        let h = parseInt(heightField.value);
        if (isNumber(h)) {
          g.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightField.value + " is not a valid height";
        }
        // finish
        if (success) {
          g.setName(nameField.value);
          g.setColorScheme(colorSchemeSelector.value)
          g.setViewWindowColor(windowColorField.value);
          g.refreshView();
          flowchart.storeBlockStates();
          flowchart.blockView.requestDraw();
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
      nameField.addEventListener("keyup", enterKeyUp);
      windowColorField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: g.getUid(),
        height: 350,
        width: 450,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
