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
    let propertiesButton = document.getElementById(this.id + "-properties-button");
    propertiesButton.addEventListener("click", this.propertiesButtonClick.bind(this), false);
  }

  protected copyButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    flowchart.copiedBlock = this.block;
  }

  protected deleteButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block) {
      let block = this.block;
      let message = "<div style='font-size: 90%;'>Are you sure you want to delete " + block.getUid() + "?</div>";
      $("#modal-dialog").html(message).dialog({
        resizable: false,
        modal: true,
        title: "Delete",
        height: 200,
        width: 300,
        buttons: {
          'OK': function () {
            flowchart.removeBlock(block.getUid());
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

  protected abstract getPropertiesUI(): string;

  protected abstract propertiesButtonClick(e: MouseEvent): void;

}
