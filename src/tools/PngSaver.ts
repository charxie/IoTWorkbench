/*
 * @author Charles Xie
 */

import $ from "jquery";
import {Util} from "../Util";

export class PngSaver {

  private static readonly inputFieldId: string = "save-png-file-name-field";

  private constructor() {
  }

  private static save(fileName: string, imgUrl: string): void {
    let a = document.createElement('a') as HTMLAnchorElement;
    a.download = fileName;
    a.href = imgUrl;
    a.click();
  };

  static saveAs(canvas): void {
    let that = this;
    let fileName = 'screenshot.png';
    let d = $('#modal-dialog').html(`<div style="font-family: Arial; line-height: 30px; font-size: 90%;">
        Save screenshot as:<br><input type="text" id="${this.inputFieldId}" style="width: 260px;" value="${fileName}"></div>`);
    let inputElement = document.getElementById(that.inputFieldId) as HTMLInputElement;
    Util.selectField(inputElement, 0, inputElement.value.indexOf("."));
    let okFunction = function () {
      d.dialog('close');
      let filename = inputElement.value;
      that.save(filename, canvas.toDataURL("image/png"));
    };
    inputElement.addEventListener("keyup", function (e) {
      if (e.key == "Enter") {
        okFunction();
      }
    });
    d.dialog({
      resizable: false,
      modal: true,
      title: "Save",
      height: 200,
      width: 300,
      position: {
        my: 'center center',
        at: 'center center',
        of: window
      },
      buttons: {
        'OK': okFunction,
        'Cancel': function () {
          d.dialog('close');
        }
      }
    });
  }

}
