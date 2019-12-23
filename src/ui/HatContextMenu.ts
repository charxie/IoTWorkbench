/*
 * @author Charles Xie
 */
import {Hat} from "../components/Hat";
import {system} from "../Main";
import {ComponentContextMenu} from "./ComponentContextMenu";
import $ from "jquery";

export abstract class HatContextMenu extends ComponentContextMenu {

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
      $(function () {
        console.log("xxx");
      });
      if (confirm("Are you sure you want to delete " + this.hat.uid + "?")) {
        this.hat.attach(null);
        system.removeHat(this.hat);
      }
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
