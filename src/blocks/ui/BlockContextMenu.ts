/*
 * @author Charles Xie
 */

import $ from "jquery";
import {Block} from "../Block";
import {MyContextMenu} from "../../MyContextMenu";
import {closeAllContextMenus, flowchart} from "../../Main";

export abstract class BlockContextMenu extends MyContextMenu {

  protected block: Block;

  addListeners(): void {
    let copyButton = document.getElementById(this.id + "-copy-button");
    copyButton.addEventListener("click", this.copyButtonClick.bind(this), false);
    let deleteButton = document.getElementById(this.id + "-delete-button");
    deleteButton.addEventListener("click", this.deleteButtonClick.bind(this), false);
    let bringToFrontButton = document.getElementById(this.id + "-bring-to-front-button");
    if (bringToFrontButton) bringToFrontButton.addEventListener("click", this.bringToFrontButtonClick.bind(this), false);
    let bringForwardButton = document.getElementById(this.id + "-bring-forward-button");
    if (bringForwardButton) bringForwardButton.addEventListener("click", this.bringForwardButtonClick.bind(this), false);
    let sendBackwardButton = document.getElementById(this.id + "-send-backward-button");
    if (sendBackwardButton) sendBackwardButton.addEventListener("click", this.sendBackwardButtonClick.bind(this), false);
    let sendToBackButton = document.getElementById(this.id + "-send-to-back-button");
    if (sendToBackButton) sendToBackButton.addEventListener("click", this.sendToBackButtonClick.bind(this), false);
    let propertiesButton = document.getElementById(this.id + "-properties-button");
    propertiesButton.addEventListener("click", this.propertiesButtonClick.bind(this), false);
    let rotateButton = document.getElementById(this.id + "-rotate-button");
    if (rotateButton) {
      rotateButton.addEventListener("click", this.rotateButtonClick.bind(this), false);
    }
  }

  protected sendToBackButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    flowchart.sendToBack(this.block);
  }

  protected sendBackwardButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    flowchart.sendBackward(this.block);
  }

  protected bringForwardButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    flowchart.bringForward(this.block);
  }

  protected bringToFrontButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    flowchart.bringToFront(this.block);
  }

  protected copyButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    flowchart.blockView.setCopiedBlock(this.block);
  }

  protected deleteButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block) {
      flowchart.askToDeleteBlock(this.block);
    }
  }

  protected rotateButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block) {
      let block = this.block;
      let oldW = block.getWidth();
      let oldH = block.getHeight();
      block.setWidth(oldH);
      block.setHeight(oldW);
      block.refreshView();
      flowchart.blockView.requestDraw();
    }
  }

  protected abstract getPropertiesUI(): string;

  protected abstract propertiesButtonClick(e: MouseEvent): void;

  protected getLayerMenu(): string {
    return `<li class="menu-item submenu">
             <button type="button" class="menu-btn"><i class="fas fa-layer-group"></i><span class="menu-text">Layer</span></button>
             <menu class="menu" style="width: 160px;">
               <li class="menu-item">
                 <button type="button" class="menu-btn" id="${this.id}-bring-to-front-button"><i class="fas fa-fast-forward"></i><span class="menu-text">Bring to Front</span></button>
               </li>
               <li class="menu-item">
                 <button type="button" class="menu-btn" id="${this.id}-bring-forward-button"><i class="fas fa-forward"></i><span class="menu-text">Bring Forward</span></button>
               </li>
               <li class="menu-item">
                 <button type="button" class="menu-btn" id="${this.id}-send-backward-button"><i class="fas fa-backward"></i><span class="menu-text">Send Backward</span></button>
               </li>
               <li class="menu-item">
                 <button type="button" class="menu-btn" id="${this.id}-send-to-back-button"><i class="fas fa-fast-backward"></i><span class="menu-text">Send to Back</span></button>
               </li>
             </menu>
            </li>`;
  }

}
