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
import {TurnoutSwitch} from "./blocks/TurnoutSwitch";
import {ParametricEquationBlock} from "./blocks/ParametricEquationBlock";
import {Space2D} from "./blocks/Space2D";
import {GlobalVariableBlock} from "./blocks/GlobalVariableBlock";
import {MomentarySwitch} from "./blocks/MomentarySwitch";
import {Beeper} from "./blocks/Beeper";
import {SwitchStatementBlock} from "./blocks/SwitchStatementBlock";
import {MultivariableFunctionBlock} from "./blocks/MultivariableFunctionBlock";
import {GlobalObjectBlock} from "./blocks/GlobalObjectBlock";

export class StateIO {

  private static readonly inputFieldId: string = "save-state-file-name-field";
  private static lastFileName: string = "state.json";

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
          console.log("ERROR: " + type + " not recognized");
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
          if (state.valuePrecision != undefined) block.setValuePrecision(state.valuePrecision);
        } else if (block instanceof GlobalVariableBlock) {
          block.setName(state.name);
          block.setKey(state.key);
          block.setValue(state.value);
        } else if (block instanceof GlobalObjectBlock) {
          block.setName(state.name);
          block.setSymbol(state.symbol);
          block.setKeys(state.keys);
          block.setValues(state.values);
        } else if (block instanceof SeriesBlock) {
          block.setName(state.name);
          block.setStart(state.start);
          block.setIncrement(state.increment);
          block.setCount(state.count);
        } else if (block instanceof WorkerBlock) {
          block.setName(state.name);
          block.setOutputType(state.outputType ? state.outputType : "Natural Number");
          block.setInterval(state.interval);
          if (state.repeatTimes) block.setRepeatTimes(state.repeatTimes);
        } else if (block instanceof ItemSelector) {
          block.setName(state.name);
          block.setItems(state.items);
          block.setSelectedIndex(state.selectedIndex);
        } else if (block instanceof ToggleSwitch) {
          block.setName(state.name);
          block.setChecked(state.checked);
        } else if (block instanceof MomentarySwitch) {
          block.setName(state.name);
        } else if (block instanceof Beeper) {
          block.setName(state.name);
          block.setOscillatorType(state.oscillatorType);
          block.setFrequency(state.frequency);
          block.setVolume(state.volume);
        } else if (block instanceof Sticker) {
          block.setName(state.name);
          block.setDecimals(state.decimals != undefined ? state.decimals : 3);
          block.setUserText(state.userText);
          if (state.color != undefined) block.setColor(state.color);
          if (state.textColor != undefined) block.setTextColor(state.textColor);
        } else if (block instanceof Grapher) {
          block.setName(state.name);
          if (state.minimumValue != undefined) block.setMinimumValue(state.minimumValue);
          if (state.maximumValue != undefined) block.setMaximumValue(state.maximumValue);
          if (state.autoscale != undefined) block.setAutoScale(state.autoscale);
          if (state.xAxisLabel != undefined) block.setXAxisLabel(state.xAxisLabel);
          if (state.yAxisLabel != undefined) block.setYAxisLabel(state.yAxisLabel);
          if (state.graphWindowColor != undefined) block.setGraphWindowColor(state.graphWindowColor);
          if (state.graphSymbol != undefined) block.setGraphSymbol(state.graphSymbol);
          if (state.lineType != undefined) block.setLineType(state.lineType);
          if (state.lineColor != undefined) block.setLineColor(state.lineColor);
          if (state.graphSymbolColor != undefined) block.setGraphSymbolColor(state.graphSymbolColor);
        } else if (block instanceof Space2D) {
          block.setName(state.name);
          block.setMinimumXValue(state.minimumXValue);
          block.setMaximumXValue(state.maximumXValue);
          block.setMinimumYValue(state.minimumYValue);
          block.setMaximumYValue(state.maximumYValue);
          block.setAutoScale(state.autoscale);
          block.setXAxisLabel(state.xAxisLabel);
          block.setYAxisLabel(state.yAxisLabel);
          block.setSpaceWindowColor(state.spaceWindowColor);
          block.setDataSymbol(state.dataSymbol);
          block.setDataSymbolColor(state.dataSymbolColor);
          block.setLineType(state.lineType);
          block.setLineColor(state.lineColor);
          block.setPointInput(state.pointInput);
        } else if (block instanceof TurnoutSwitch) {
          block.setName(state.name);
          block.setVariableName(state.variableName ? state.variableName : "x");
          block.setExpression(state.expression);
        } else if (block instanceof SwitchStatementBlock) {
          block.setName(state.name);
          block.setCases(state.cases);
        } else if (block instanceof UnaryFunctionBlock) {
          block.setName(state.name);
          block.setVariableName(state.variableName ? state.variableName : "x");
          block.setExpression(state.expression ? state.expression : "x");
        } else if (block instanceof BinaryFunctionBlock) {
          block.setName(state.name);
          block.setVariable1Name(state.variable1Name ? state.variable1Name : "x");
          block.setVariable2Name(state.variable2Name ? state.variable2Name : "y");
          block.setExpression(state.expression ? state.expression : "x+y");
        } else if (block instanceof MultivariableFunctionBlock) {
          block.setName(state.name);
          block.setVariables(state.variables ? state.variables : "['x', 'y', 'z']");
          block.setExpression(state.expression ? state.expression : "x+y+z");
        } else if (block instanceof ParametricEquationBlock) {
          block.setName(state.name);
          block.setExpressionX(state.expressionX ? state.expressionX : "cos(t)");
          block.setExpressionY(state.expressionY ? state.expressionY : "sin(t)");
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
          if (inputBlock instanceof GlobalVariableBlock) {
            outputBlock.setSource(false);
          }
          flowchart.addPortConnector(outputBlock.getPort(state.outputPortId), inputBlock.getPort(state.inputPortId), "Port Connector #" + flowchart.connectors.length);
        }
      }
    }
  }

  static restoreGlobalVariables(s: string): void {
    if (s != undefined) {
      flowchart.globalVariables = JSON.parse(s);
    } else {
      flowchart.globalVariables = {};
    }
  }

  static restoreBlockView(s: string): void {
    if (s == null) {
      flowchart.blockView.setBackgroundColor("#d4d0c8");
      flowchart.blockView.setBlockStyle("Shade");
    } else {
      let state = JSON.parse(s);
      flowchart.blockView.setBackgroundColor(state.backgroundColor);
      flowchart.blockView.setBlockStyle(state.blockStyle ? state.blockStyle : "Shade");
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
        that.lastFileName = target.files[0].name;
        // console.log("Open File: " + that.lastFileName);
        reader.onload = function (e) {
          let s = JSON.parse(reader.result.toString());
          that.restoreGlobalVariables(JSON.stringify(s.globalVariables));
          that.restoreBlockView(JSON.stringify(s.blockViewState));
          that.restoreBlocks(JSON.stringify(s.blockStates));
          that.restoreConnectors(JSON.stringify(s.connectorStates));
          flowchart.updateResults();
          flowchart.updateLocalStorage();
          target.value = "";
        };
      }
    };
    fileInput.click();
  }

  static saveAs(data: string): void {
    let that = this;
    let d = $('#modal-dialog').html(`<div style="font-family: Arial; line-height: 30px; font-size: 90%;">
        Save as:<br><input type="text" id="${this.inputFieldId}" style="width: 260px;" value="${this.lastFileName}">`);
    let inputFileName = document.getElementById(that.inputFieldId) as HTMLInputElement;
    Util.selectField(inputFileName, 0, inputFileName.value.indexOf("."));
    let okFunction = function () {
      Util.saveText(data, inputFileName.value);
      that.lastFileName = inputFileName.value;
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
