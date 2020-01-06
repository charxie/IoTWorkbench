/*
 * @author Charles Xie
 */
import $ from "jquery";
import {system} from "../../Main";
import {Hat} from "../Hat";
import {MyContextMenu} from "../../MyContextMenu";

export abstract class HatContextMenu extends MyContextMenu {

  hat: Hat;

  addListeners(): void {
    let attachButton = document.getElementById(this.id + "-attach-button");
    attachButton.addEventListener("click", this.attachButtonClick.bind(this), false);
    let detachButton = document.getElementById(this.id + "-detach-button");
    detachButton.addEventListener("click", this.detachButtonClick.bind(this), false);
    let deleteButton = document.getElementById(this.id + "-delete-button");
    deleteButton.addEventListener("click", this.deleteButtonClick.bind(this), false);
  }

  deleteButtonClick(e: MouseEvent): void {
    if (this.hat) {
      let that = this;
      let d = $("#modal-dialog").html("<div style='font-size: 90%;'>Are you sure you want to delete " + this.hat.uid + "?</div>");
      d.dialog({
        resizable: false,
        modal: true,
        title: "Delete",
        height: 200,
        width: 300,
        buttons: {
          'OK': function () {
            that.hat.attach(null);
            system.removeHat(that.hat);
            $(this).dialog('close');
          },
          'Cancel': function () {
            $(this).dialog('close');
          }
        }
      });
    }
  }

  attachButtonClick(e: MouseEvent): void {
    //e.preventDefault();
    if (this.hat) {
      this.hat.tryAttach();
    }
  }

  detachButtonClick(e: MouseEvent): void {
    //e.preventDefault();
    if (this.hat) {
      this.hat.attach(null);
    }
  }

}
