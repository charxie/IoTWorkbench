/*
 * @author Charles Xie
 */

import $ from "jquery";
import {Util} from "../Util";

export class CsvSaver {

  private static readonly inputFieldId: string = "save-csv-file-name-field";

  private constructor() {
  }

  static saveAs(array: any[][]): void {
    let csvContent = array.map(e => e.join(",")).join("\n");
    let blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    let fileName = 'data.csv';
    let d = $('#modal-dialog').html(`<div style="font-family: Arial; line-height: 30px; font-size: 90%;">
        Save data as:<br><input type="text" id="${this.inputFieldId}" style="width: 260px;" value="${fileName}"></div>`);
    let inputElement = document.getElementById(this.inputFieldId) as HTMLInputElement;
    Util.selectField(inputElement, 0, inputElement.value.indexOf("."));
    let okFunction = () => {
      d.dialog('close');
      let link = document.createElement("a");
      link.setAttribute("href", URL.createObjectURL(blob));
      link.setAttribute("download", inputElement.value);
      link.style.visibility = 'hidden';
      document.body.appendChild(link); // Required for FF
      link.click();
      document.body.removeChild(link);
    };
    inputElement.addEventListener("keyup", (e) => {
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
        'Cancel': () => d.dialog('close')
      }
    });
  }

}
