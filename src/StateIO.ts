/*
 * @author Charles Xie
 */

import $ from "jquery";
import {Util} from "./Util";
import {Slider} from "./blocks/Slider";
import {Sticker} from "./blocks/Sticker";
import {flowchart} from "./Main";
import {ToggleSwitch} from "./blocks/ToggleSwitch";
import {ItemSelector} from "./blocks/ItemSelector";
import {SeriesBlock} from "./blocks/SeriesBlock";
import {Grapher} from "./blocks/Grapher";
import {WorkerBlock} from "./blocks/WorkerBlock";
import {UnaryFunctionBlock} from "./blocks/UnaryFunctionBlock";
import {BinaryFunctionBlock} from "./blocks/BinaryFunctionBlock";
import {ConditionalStatementBlock} from "./blocks/ConditionalStatementBlock";

export class StateIO {

  private static readonly inputFieldId: string = "save-state-file-name-field";
  private static lastSavedFileName: string = "state.json";

  private constructor() {
  }

  static restoreBlocks(s: string): void {
    flowchart.blocks = [];
    if (s == null) return;
    let states = JSON.parse(s);
    if (states.length > 0) {
      for (let state of states) {
        let type = state.uid.substring(0, state.uid.indexOf("#") - 1);
        if (type.indexOf("HAT") != -1) continue; // Do not add HAT blocks. They are added by the model components.
        let block = flowchart.addBlock(type, state.x, state.y, state.uid);
        if (block == null) {
          console.log(type);
          continue;
        }
        if (state.width) {
          block.setWidth(state.width);
        }
        if (state.height) {
          block.setHeight(state.height);
        }
        if (block instanceof Slider) {
          block.setName(state.name);
          block.setMinimum(state.minimum);
          block.setMaximum(state.maximum);
          block.setSteps(state.steps);
          block.setValue(state.value);
          block.setSnapToTick(state.snapToTick);
        } else if (block instanceof SeriesBlock) {
          block.setName(state.name);
          block.setStart(state.start);
          block.setIncrement(state.increment);
          block.setCount(state.count);
        } else if (block instanceof WorkerBlock) {
          block.setName(state.name);
          block.setInterval(state.interval);
        } else if (block instanceof ItemSelector) {
          block.setName(state.name);
          block.setItems(state.items);
          block.setSelectedIndex(state.selectedIndex);
        } else if (block instanceof ToggleSwitch) {
          block.setName(state.name);
          block.setChecked(state.checked);
        } else if (block instanceof Sticker) {
          block.setName(state.name);
          block.setDecimals(state.decimals ? state.decimals : 3);
        } else if (block instanceof Grapher) {
          block.setName(state.name);
          if (state.minimumValue != undefined) block.setMinimumValue(state.minimumValue);
          if (state.maximumValue != undefined) block.setMaximumValue(state.maximumValue);
          if (state.autoscale != undefined) block.setAutoScale(state.autoscale);
          if (state.xAxisLabel != undefined) block.setXAxisLabel(state.xAxisLabel);
          if (state.yAxisLabel != undefined) block.setYAxisLabel(state.yAxisLabel);
          if (state.graphWindowColor != undefined) block.setGraphWindowColor(state.graphWindowColor);
          if (state.graphSymbol != undefined) block.setGraphSymbol(state.graphSymbol);
        } else if (block instanceof ConditionalStatementBlock) {
          block.setName(state.name);
          block.setVariableName(state.variableName ? state.variableName : "x");
          block.setExpression(state.expression ? state.expression : "x");
        } else if (block instanceof UnaryFunctionBlock) {
          block.setName(state.name);
          block.setVariableName(state.variableName ? state.variableName : "x");
          block.setExpression(state.expression ? state.expression : "x");
        } else if (block instanceof BinaryFunctionBlock) {
          block.setName(state.name);
          block.setVariable1Name(state.variable1Name ? state.variable1Name : "x");
          block.setVariable2Name(state.variable2Name ? state.variable2Name : "y");
          block.setExpression(state.expression ? state.expression : "x+y");
        }
        block.refreshView();
      }
    }
  }

  static restoreConnectors(s: string): void {
    flowchart.connectors = [];
    if (s == null) return;
    let states = JSON.parse(s);
    if (states.length > 0) {
      for (let state of states) {
        let inputBlock = flowchart.getBlock(state.inputBlockId);
        let outputBlock = flowchart.getBlock(state.outputBlockId);
        if (inputBlock && outputBlock) {
          flowchart.addPortConnector(outputBlock.getPort(state.outputPortId), inputBlock.getPort(state.inputPortId), "Port Connector #" + flowchart.connectors.length);
        }
      }
    }
  }

  static restoreBlockView(s: string): void {
    if (s == null) {
      flowchart.blockView.setBackgroundColor("#d4d0c8");
    } else {
      let state = JSON.parse(s);
      flowchart.blockView.setBackgroundColor(state.backgroundColor);
    }
  }

  static open(): void {
    let that = this;
    flowchart.destroy();
    let fileInput = document.getElementById('state-file-dialog') as HTMLInputElement;
    fileInput.onchange = function (event: Event) {
      let target = <HTMLInputElement>event.target;
      if (target.files.length) {
        let reader: FileReader = new FileReader();
        reader.readAsText(target.files[0]);
        reader.onload = function (e) {
          let s = JSON.parse(reader.result.toString());
          that.restoreBlockView(JSON.stringify(s.blockViewState));
          that.restoreBlocks(JSON.stringify(s.blockStates));
          that.restoreConnectors(JSON.stringify(s.connectorStates));
          flowchart.updateResults();
          flowchart.storeViewState();
          flowchart.storeBlockStates();
          flowchart.storeConnectorStates();
        };
      }
    };
    fileInput.click();
  }

  static saveAs(data: string): void {
    let that = this;
    let d = $('#modal-dialog').html(`<div style="font-family: Arial; line-height: 30px; font-size: 90%;">
        Save as:<br><input type="text" id="${this.inputFieldId}" style="width: 260px;" value="${this.lastSavedFileName}">`);
    let inputFileName = document.getElementById(that.inputFieldId) as HTMLInputElement;
    let okFunction = function () {
      Util.saveText(data, inputFileName.value);
      that.lastSavedFileName = inputFileName.value;
      d.dialog('close');
    };
    inputFileName.addEventListener("keyup", function (e) {
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
