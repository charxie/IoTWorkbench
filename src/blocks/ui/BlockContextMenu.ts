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
    let deleteButton = document.getElementById(this.id + "-delete-button");
    deleteButton.addEventListener("click", this.deleteButtonClick.bind(this), false);
    let propertiesButton = document.getElementById(this.id + "-properties-button");
    propertiesButton.addEventListener("click", this.propertiesButtonClick.bind(this), false);
  }

  protected deleteButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block) {
      let that = this;
      $("#modal-dialog").html("<div style='font-size: 90%;'>Are you sure you want to delete " + this.block.getUid() + "?</div>");
      $("#modal-dialog").dialog({
        resizable: false,
        modal: true,
        title: "Delete",
        height: 200,
        width: 300,
        buttons: {
          'OK': function () {
            flowchart.removeBlock(that.block.getUid());
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
