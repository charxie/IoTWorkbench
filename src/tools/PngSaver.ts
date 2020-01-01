/*
 * @author Charles Xie
 */

import $ from "jquery";

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
    $('#modal-dialog').html(`<div style="font-family: Arial; line-height: 30px; font-size: 90%;">
        Save screenshot as:<br><input type="text" id="${this.inputFieldId}" style="width: 260px;" value="${fileName}"></div>`);
    $('#modal-dialog').dialog({
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
        'OK': function () {
          $(this).dialog('close');
          let input = document.getElementById(that.inputFieldId) as HTMLInputElement;
          let filename = input.value;
          that.save(filename, canvas.toDataURL("image/png"));
        },
        'Cancel': function () {
          $(this).dialog('close');
        }
      }
    });
  }

}
