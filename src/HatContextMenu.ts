/*
 * @author Charles Xie
 */
import {Hat} from "./components/Hat";
import {system} from "./Main";
import {RaspberryPi} from "./components/RaspberryPi";
import {ComponentContextMenu} from "./ComponentContextMenu";

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
      if (confirm("Are you sure you want to delete " + this.hat.uid + "?")) {
        system.removeHat(this.hat);
      }
    }
  }

  attachButtonClick(e: MouseEvent): void {
    e.preventDefault();
    let menu = document.getElementById(this.id) as HTMLMenuElement;
    menu.classList.remove("show-menu");
    let i = this.hat.whichRaspberryPi();
    if (i >= 0) {
      this.hat.attach(<RaspberryPi>system.mcus[i]);
    }
  }

  detachButtonClick(e: MouseEvent): void {
    e.preventDefault();
    let menu = document.getElementById(this.id) as HTMLMenuElement;
    menu.classList.remove("show-menu");
    this.hat.attach(null);
  }

}
