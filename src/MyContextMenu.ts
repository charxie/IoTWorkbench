/*
 * @author Charles Xie
 */

import $ from "jquery";

export abstract class MyContextMenu {

  protected id: string;

  abstract getUi(): string;

  abstract addListeners(): void;

  render(selectorId: string): void {
    let element = document.getElementById(selectorId);
    element.innerHTML = this.getUi();
  }

  showErrorMessage(err): void {
    $("#error-dialog").html("<div style='font-size: 90%;'>" + err + "</div>").dialog({
      resizable: false,
      modal: true,
      title: "Error",
      height: 200,
      width: 200,
      buttons: {
        'OK': function () {
          $(this).dialog('close');
        }
      }
    });
  }

}
