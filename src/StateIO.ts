/*
 * @author Charles Xie
 */

import $ from "jquery";
import FileSaver from "file-saver";
import {Util} from "./Util";
import {Slider} from "./blocks/Slider";
import {Sticker} from "./blocks/Sticker";
import {flowchart, system} from "./Main";
import {ToggleSwitch} from "./blocks/ToggleSwitch";
import {ItemSelector} from "./blocks/ItemSelector";
import {SeriesBlock} from "./blocks/SeriesBlock";
import {Grapher} from "./blocks/Grapher";
import {WorkerBlock} from "./blocks/WorkerBlock";
import {ActionBlock} from "./blocks/ActionBlock";
import {UnivariateFunctionBlock} from "./blocks/UnivariateFunctionBlock";
import {BivariateFunctionBlock} from "./blocks/BivariateFunctionBlock";
import {MultivariateFunctionBlock} from "./blocks/MultivariateFunctionBlock";
import {TurnoutSwitch} from "./blocks/TurnoutSwitch";
import {ParametricEquationBlock} from "./blocks/ParametricEquationBlock";
import {Space2D} from "./blocks/Space2D";
import {Field2D} from "./blocks/Field2D";
import {GlobalVariableBlock} from "./blocks/GlobalVariableBlock";
import {MomentarySwitch} from "./blocks/MomentarySwitch";
import {Beeper} from "./blocks/Beeper";
import {SwitchStatementBlock} from "./blocks/SwitchStatementBlock";
import {GlobalObjectBlock} from "./blocks/GlobalObjectBlock";
import {RainbowHat} from "./components/RainbowHat";
import {SensorLineChart} from "./components/SensorLineChart";
import {RainbowHatBlock} from "./blocks/RainbowHatBlock";
import {RaspberryPi} from "./components/RaspberryPi";
import {RgbaColorBlock} from "./blocks/RgbaColorBlock";
import {ComplexNumberBlock} from "./blocks/ComplexNumberBlock";
import {BundledFunctionsBlock} from "./blocks/BundledFunctionsBlock";
import {FunctionDeclarationBlock} from "./blocks/FunctionDeclarationBlock";
import {VectorBlock} from "./blocks/VectorBlock";
import {MatrixBlock} from "./blocks/MatrixBlock";
import {IntegralBlock} from "./blocks/IntegralBlock";
import {FFTBlock} from "./blocks/FFTBlock";
import {ODESolverBlock} from "./blocks/ODESolverBlock";
import {RandomNumberGeneratorBlock} from "./blocks/RandomNumberGeneratorBlock";
import {TransientStateFDMSolverBlock} from "./blocks/TransientStateFDMSolverBlock";
import {SteadyStateFDMSolverBlock} from "./blocks/SteadyStateFDMSolverBlock";
import {BoundaryConditionBlock} from "./blocks/BoundaryConditionBlock";
import {ImageBlock} from "./blocks/ImageBlock";
import {AudioBlock} from "./blocks/AudioBlock";
import {DataBlock} from "./blocks/DataBlock";

export class StateIO {

  private static readonly inputFieldId: string = "save-state-file-name-field";
  private static lastFileName: string = "state.json";

  private constructor() {
  }

  static restoreBlocks(s: string): void {
    flowchart.blocks.length = 0;
    if (s == null) return;
    let states = JSON.parse(s);
    if (states.length > 0) {
      for (let state of states) {
        let type = state.uid.substring(0, state.uid.indexOf("#") - 1);
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
          block.setSource(state.source !== undefined ? state.source : true);
          block.setSnapToTick(state.snapToTick);
          if (state.valuePrecision != undefined) block.setValuePrecision(state.valuePrecision);
        } else if (block instanceof FunctionDeclarationBlock) {
          block.setName(state.name);
          if (state.variableNames !== undefined) {
            block.setVariableNames(state.variableNames);
          } else {
            block.setVariableNames([state.variableName]);
          }
          block.setFunctionName(state.functionName);
          block.setExpression(state.expression);
        } else if (block instanceof GlobalVariableBlock) {
          block.setName(state.name);
          block.setKey(state.key);
          block.setValue(state.value);
          block.setInitialValue(state.initialValue);
          block.setShowValue(state.showValue);
        } else if (block instanceof GlobalObjectBlock) {
          block.setName(state.name);
          block.setSymbol(state.symbol);
          block.setKeys(state.keys);
          block.setValues(state.values);
          block.setInitialValues(state.initialValues);
          block.setMarginX(state.marginX == undefined ? 15 : state.marginX);
        } else if (block instanceof SeriesBlock) {
          block.setName(state.name);
          block.setStart(state.start);
          block.setIncrement(state.increment);
          block.setCount(state.count);
        } else if (block instanceof RgbaColorBlock) {
          block.setName(state.name);
          block.setRed(state.red);
          block.setGreen(state.green);
          block.setBlue(state.blue);
          block.setAlpha(state.alpha);
        } else if (block instanceof ComplexNumberBlock) {
          block.setName(state.name);
          block.setReal(state.real);
          block.setImaginary(state.imaginary);
          block.setInverse(state.inverse !== undefined ? state.inverse : false);
        } else if (block instanceof VectorBlock) {
          block.setName(state.name);
          block.setFractionDigits(state.fractionDigits != undefined ? state.fractionDigits : 3);
          block.setValues(state.values != undefined ? state.values : [1, 0]);
        } else if (block instanceof MatrixBlock) {
          block.setName(state.name);
          block.setFractionDigits(state.fractionDigits != undefined ? state.fractionDigits : 3);
          block.setValues(state.values != undefined ? state.values : [[1, 0], [1, 0]]);
        } else if (block instanceof WorkerBlock) {
          block.setName(state.name);
          block.setOutputType(state.outputType ? state.outputType : "Natural Number");
          block.setInterval(state.interval);
          if (state.repeatTimes) block.setRepeatTimes(state.repeatTimes);
        } else if (block instanceof ActionBlock) {
          block.setName(state.name);
          block.setType(state.type ? state.type : "Reset");
          if (state.symbol) block.setSymbol(state.symbol);
        } else if (block instanceof ItemSelector) {
          block.setName(state.name);
          block.setItems(state.items);
          block.setSelectedIndex(state.selectedIndex);
          block.setSource(state.source !== undefined ? state.source : true);
        } else if (block instanceof ToggleSwitch) {
          block.setName(state.name);
          block.setChecked(state.checked);
        } else if (block instanceof MomentarySwitch) {
          block.setName(state.name);
          block.setFireOnlyAtMouseUp(state.fireOnlyAtMouseUp == undefined ? false : state.fireOnlyAtMouseUp);
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
          if (state.dataPortNumber != undefined) block.setDataPortNumber(state.dataPortNumber);
          if (state.lineTypes != undefined) block.setLineTypes(state.lineTypes);
          if (state.lineColors != undefined) block.setLineColors(state.lineColors);
          if (state.lineThicknesses != undefined) block.setLineThicknesses(state.lineThicknesses);
          if (state.graphSymbols != undefined) block.setGraphSymbols(state.graphSymbols);
          if (state.graphSymbolSizes != undefined) block.setGraphSymbolSizes(state.graphSymbolSizes);
          if (state.graphSymbolColors != undefined) block.setGraphSymbolColors(state.graphSymbolColors);
          if (state.graphSymbolSpacings != undefined) block.setGraphSymbolSpacings(state.graphSymbolSpacings);
          if (state.fillOptions != undefined) block.setFillOptions(state.fillOptions);
          if (state.fillColors != undefined) block.setFillColors(state.fillColors);
        } else if (block instanceof IntegralBlock) {
          block.setName(state.name);
          block.setFractionDigits(state.fractionDigits != undefined ? state.fractionDigits : 3);
          block.setMethod(state.method !== undefined ? state.method : "Trapezoidal Rule");
        } else if (block instanceof FFTBlock) {
          block.setSeparate(state.separate != undefined ? state.separate : true);
          block.setInverse(state.inverse != undefined ? state.inverse : false);
          block.setupPorts();
        } else if (block instanceof ODESolverBlock) {
          block.setVariableName(state.variableName != undefined ? state.variableName : "t");
          block.setEquations(state.equations != undefined ? state.equations : ["x'=x"]);
          block.setMethod(state.method != undefined ? state.method : "Euler");
        } else if (block instanceof TransientStateFDMSolverBlock) {
          block.setVariables(state.variables != undefined ? state.variables : ["t", "x"]);
          block.setEquations(state.equations != undefined ? state.equations : ["T_t=T_xx"]);
          block.setMethod(state.method != undefined ? state.method : "Explicit");
        } else if (block instanceof SteadyStateFDMSolverBlock) {
          block.setVariables(state.variables != undefined ? state.variables : ["x", "y"]);
          block.setEquations(state.equations != undefined ? state.equations : ["T_xx+T_yy=0"]);
          block.setMethod(state.method);
          block.setRelaxationSteps(state.relaxationSteps !== undefined ? state.relaxationSteps : 10);
          block.setRelaxationFactor(state.relaxationFactor !== undefined ? state.relaxationFactor : 1.5);
        } else if (block instanceof BoundaryConditionBlock) {
          block.boundaryCondition.north.type = state.northType !== undefined ? state.northType : "Dirichlet";
          block.boundaryCondition.north.value = state.northValue;
          block.boundaryCondition.east.type = state.eastType !== undefined ? state.eastType : "Dirichlet";
          block.boundaryCondition.east.value = state.eastValue;
          block.boundaryCondition.south.type = state.southType !== undefined ? state.southType : "Dirichlet";
          block.boundaryCondition.south.value = state.southValue;
          block.boundaryCondition.west.type = state.westType !== undefined ? state.westType : "Dirichlet";
          block.boundaryCondition.west.value = state.westValue;
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
          block.setPointInput(state.pointInput);
          block.setShowGridLines(state.showGridLines == undefined ? false : state.showGridLines);
          block.setEndSymbolRadius(state.endSymbolRadius == undefined ? 0 : state.endSymbolRadius);
          block.setEndSymbolsConnection(state.endSymbolsConnection === undefined ? "None" : state.endSymbolsConnection);
          if (state.backgroundImageSrc != undefined) block.setBackgroundImageSrc(state.backgroundImageSrc);
          if (state.lineTypes != undefined) block.setLineTypes(state.lineTypes);
          if (state.lineColors != undefined) block.setLineColors(state.lineColors);
          if (state.dataSymbols != undefined) block.setDataSymbols(state.dataSymbols);
          if (state.dataSymbolRadii != undefined && state.dataSymbolRadii.length > 0) block.setDataSymbolRadii(state.dataSymbolRadii);
          if (state.dataSymbolColors != undefined) block.setDataSymbolColors(state.dataSymbolColors);
          if (state.numberOfPoints != undefined) block.setNumberOfPoints(state.numberOfPoints);
        } else if (block instanceof Field2D) {
          block.setName(state.name);
          block.setScaleType(state.scaleType === undefined ? "Linear" : state.scaleType);
          block.setXAxisLabel(state.xAxisLabel);
          block.setYAxisLabel(state.yAxisLabel);
          block.setShowGridLines(state.showGridLines);
          block.setLineType(state.lineType);
          block.setLineColor(state.lineColor);
          block.setLineNumber(state.lineNumber === undefined ? 20 : state.lineNumber);
          block.setMinimumColor(state.minimumColor === undefined ? "rgb(0,0,0)" : state.minimumColor);
          block.setMaximumColor(state.maximumColor === undefined ? "rgb(255,255,255)" : state.maximumColor);
          block.setFieldWindowColor(state.fieldWindowColor === undefined ? "white" : state.fieldWindowColor);
        } else if (block instanceof TurnoutSwitch) {
          block.setName(state.name);
          block.setVariableName(state.variableName ? state.variableName : "x");
          block.setExpression(state.expression);
        } else if (block instanceof SwitchStatementBlock) {
          block.setName(state.name);
          block.setCases(state.cases);
        } else if (block instanceof UnivariateFunctionBlock) {
          block.setName(state.name);
          block.setVariableName(state.variableName ? state.variableName : "x");
          block.setExpression(state.expression ? state.expression : "x");
        } else if (block instanceof BivariateFunctionBlock) {
          block.setName(state.name);
          block.setVariable1Name(state.variable1Name ? state.variable1Name : "x");
          block.setVariable2Name(state.variable2Name ? state.variable2Name : "y");
          block.setExpression(state.expression ? state.expression : "x+y");
          block.setOutputArrayType(state.outputArrayType === undefined ? "1D" : state.outputArrayType);
        } else if (block instanceof MultivariateFunctionBlock) {
          block.setName(state.name);
          block.setVariables(state.variables ? state.variables : "['x', 'y', 'z']");
          block.setExpression(state.expression ? state.expression : "x+y+z");
          block.setMarginX(state.marginX === undefined ? 15 : state.marginX);
        } else if (block instanceof ParametricEquationBlock) {
          block.setName(state.name);
          block.setParameterName(state.parameterName ? state.parameterName : "t");
          block.setExpressionX(state.expressionX ? state.expressionX : "cos(t)");
          block.setExpressionY(state.expressionY ? state.expressionY : "sin(t)");
        } else if (block instanceof BundledFunctionsBlock) {
          block.setName(state.name);
          block.setInputName(state.inputName ? state.inputName : "t");
          block.setExpressions(state.expressions);
        } else if (block instanceof RandomNumberGeneratorBlock) {
          block.setName(state.name);
          block.setNumberOfOutputs(state.numberOfOutputs);
          block.setType(state.type);
        } else if (block instanceof ImageBlock) {
          block.setName(state.name);
          block.setData(state.data);
          block.setTransparent(state.transparent !== undefined ? state.transparent : false);
        } else if (block instanceof AudioBlock) {
          block.setName(state.name);
          block.setData(state.data);
          block.setInterruptible(state.interruptible);
        } else if (block instanceof DataBlock) {
          block.setName(state.name);
          block.setData(state.data);
          block.setFormat(state.format);
          if (state.imageSrc !== undefined) block.setImageSrc(state.imageSrc);
        } else if (block instanceof RainbowHatBlock) {
          //TODO
        }
        block.refreshView();
      }
    }
  }

  static restoreConnectors(s: string): void {
    flowchart.connectors.length = 0;
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
      flowchart.confirmSources();
    }
  }

  static restoreGlobalVariables(): void {
    Util.clearObject(flowchart.globalVariables);
    for (let b of flowchart.blocks) {
      if (b instanceof GlobalVariableBlock) {
        flowchart.updateGlobalVariable(b.getKey(), b.getValue());
      } else if (b instanceof GlobalObjectBlock) {
        for (let i = 0; i < b.getKeys().length; i++) {
          flowchart.updateGlobalVariable(b.getKeys()[i], b.getValues()[i])
        }
      }
    }
  }

  static restoreFunctionDeclarations(): void {
    Util.clearObject(flowchart.declaredFunctions);
    Util.clearObject(flowchart.declaredFunctionCodes);
    for (let b of flowchart.blocks) {
      if (b instanceof FunctionDeclarationBlock) {
        flowchart.updateFunctionDeclaration(b);
      }
    }
    flowchart.useDeclaredFunctions();
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

  static restoreWorkbench(s: string): void {
    if (s == null) {
      system.workbench.showGrid = true;
    } else {
      let state = JSON.parse(s);
      system.workbench.showGrid = state.showGrid;
    }
  }

  static restoreMcus(s: string): void {
    if (system.mcus) {
      for (let i = system.mcus.length - 1; i >= 0; i--) { // must use reverse order
        let m = system.mcus[i];
        if (m instanceof RaspberryPi) {
          m.hat = null;
          system.removeRaspberryPi(m);
        }
      }
    }
    system.mcus = [];
    if (s != null) {
      let states = JSON.parse(s);
      for (let state of states) {
        if (state.uid.startsWith("Raspberry Pi")) {
          system.addRaspberryPi(state.uid, state.x, state.y, false);
        }
      }
    }
  }

  static restoreHats(s: string): void {
    if (system.hats) {
      for (let i = system.hats.length - 1; i >= 0; i--) { // must use reverse order
        system.hats[i].attach(null);
        system.removeHat(system.hats[i]);
      }
    }
    system.hats = [];
    if (s != null) {
      let hatStates = JSON.parse(s);
      for (let hatState of hatStates) {
        let name = hatState.uid.substring(0, hatState.uid.indexOf("#") - 1);
        system.addHat(name, hatState.x, hatState.y, hatState.uid, false);
      }
    }
    for (let h of system.hats) {
      if (h instanceof RainbowHat) {
        h.temperatureGraph = system.addLineChart(h.temperatureSensor, h.getX(), h.getY(), h.temperatureSensor.name + " @" + h.temperatureSensor.board.getUid());
        h.pressureGraph = system.addLineChart(h.barometricPressureSensor, h.getX(), h.getY(), h.barometricPressureSensor.name + " @" + h.barometricPressureSensor.board.getUid());
        h.temperatureGraph.setVisible(false);
        h.pressureGraph.setVisible(false);
        let lcs = localStorage.getItem("Line Chart States");
        if (lcs != null) {
          let lineChartStates = JSON.parse(lcs);
          for (let lineChartState of lineChartStates) {
            if (lineChartState.uid === h.temperatureGraph.uid) {
              this.setLineChartState(h.temperatureGraph, lineChartState);
            } else if (lineChartState.uid === h.pressureGraph.uid) {
              this.setLineChartState(h.pressureGraph, lineChartState);
            }
          }
        }
      }
    }
  }

  static restoreAttachments(s: string): void {
    if (s != null) {
      let states = JSON.parse(s);
      for (let state of states) {
        let pi = system.getRaspberryPiById(state.raspberryPiId);
        let hat = system.getHatById(state.hatId);
        if (hat != null && pi != null) {
          hat.attach(pi);
        }
      }
    }
  }

  static setLineChartState(graph: SensorLineChart, state: any) {
    graph.setVisible(state.visible);
    graph.setX(state.x);
    graph.setY(state.y);
    if (graph.isVisible()) {
      graph.draw();
    }
  }

  static restore(s): void {
    this.restoreMcus(JSON.stringify(s.mcuStates));
    this.restoreHats(JSON.stringify(s.hatStates));
    this.restoreAttachments(JSON.stringify(s.attachmentStates));
    this.restoreBlockView(JSON.stringify(s.blockViewState));
    this.restoreBlocks(JSON.stringify(s.blockStates));
    this.restoreFunctionDeclarations();
    this.restoreGlobalVariables();
    this.restoreConnectors(JSON.stringify(s.connectorStates));
    this.finishLoading();
  }

  // some blocks need to use the global variables so we have to serve them after restoring globla variables
  static finishLoading() {
    for (let b of flowchart.blocks) {
      if (b instanceof SteadyStateFDMSolverBlock) {
        b.findCoefficients();
      } else if (b instanceof ImageBlock) {
        b.updateModel();
      } else if (b instanceof DataBlock) {
        flowchart.traverse(b);
      }
    }
  }

  static open(): void {
    let that = this;
    flowchart.destroy();
    let fileDialog = document.getElementById('state-file-dialog') as HTMLInputElement;
    fileDialog.onchange = e => {
      let target = <HTMLInputElement>event.target;
      if (target.files.length) {
        let reader: FileReader = new FileReader();
        reader.readAsText(target.files[0]);
        that.lastFileName = target.files[0].name;
        reader.onload = function (e) {
          let s = JSON.parse(reader.result.toString());
          that.restore(s);
          flowchart.updateResultsExcludingAllWorkerBlocks();
          flowchart.updateLocalStorage();
          system.updateLocalStorage();
          target.value = "";
        };
      }
    };
    fileDialog.click();
  }

  // HTML input file doesn't seem to accept the file name typed in the text field -- one must select a file
  static saveAs2(data: string): void {
    let fileDialog = document.getElementById('state-file-dialog') as HTMLInputElement;
    fileDialog.onchange = e => {
      let file = Util.getFileNameFromPath(fileDialog.value);
      FileSaver.saveAs(new Blob([data], {type: "text/plain;charset=utf-8"}), file);
      this.lastFileName = file;
    };
    fileDialog.click();
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
