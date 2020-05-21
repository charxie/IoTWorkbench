/*
 * @author Charles Xie
 */

import $ from "jquery";
import FileSaver from "file-saver";
import {Util} from "./Util";
import {Slider} from "./blocks/Slider";
import {Sticker} from "./blocks/Sticker";
import {examples, flowchart, system} from "./Main";
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
import {Space3D} from "./blocks/Space3D";
import {Field2D} from "./blocks/Field2D";
import {Surface3D} from "./blocks/Surface3D";
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
import {MolecularViewerBlock} from "./blocks/MolecularViewerBlock";
import {Basic3DBlock} from "./blocks/Basic3DBlock";
import {ArrayInput} from "./blocks/ArrayInput";
import {MeanBlock} from "./blocks/MeanBlock";
import {UnivariateDescriptiveStatisticsBlock} from "./blocks/UnivariateDescriptiveStatisticsBlock";
import {BoxPlot} from "./blocks/BoxPlot";
import {Histogram} from "./blocks/Histogram";
import {WordCloud} from "./blocks/WordCloud";
import {PieChart} from "./blocks/PieChart";
import {RegressionBlock} from "./blocks/RegressionBlock";
import {CorrelationBlock} from "./blocks/CorrelationBlock";
import {StringInput} from "./blocks/StringInput";
import {ClusteringBlock} from "./blocks/ClusteringBlock";
import {HeatMap} from "./blocks/HeatMap";
import {BubblePlot} from "./blocks/BubblePlot";
import {ArrayAdapter} from "./blocks/ArrayAdapter";
import {ParallelCoordinatesPlot} from "./blocks/ParallelCoordinatesPlot";
import {RadarChart} from "./blocks/RadarChart";
import {KNNClassifierBlock} from "./blocks/KNNClassifierBlock";

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
          if (state.fractionDigits !== undefined) block.setFractionDigits(state.fractionDigits);
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
          block.setMarginX(state.marginX === undefined ? 15 : state.marginX);
          block.setMarginY(state.marginY === undefined ? 15 : state.marginY);
          if (state.color != undefined) block.setColor(state.color);
          if (state.textColor != undefined) block.setTextColor(state.textColor);
          if (state.useHtml != undefined) block.setUseHtml(state.useHtml);
          if (state.keepResult != undefined) block.setKeepResult(state.keepResult);
          block.setUserText(state.userText);
        } else if (block instanceof Grapher) {
          block.setName(state.name);
          if (state.minimumValue != undefined) block.setMinimumValue(state.minimumValue);
          if (state.maximumValue != undefined) block.setMaximumValue(state.maximumValue);
          if (state.autoscale != undefined) block.setAutoScale(state.autoscale);
          if (state.stacked != undefined) block.setStacked(state.stacked);
          if (state.xAxisLabel != undefined) block.setXAxisLabel(state.xAxisLabel);
          if (state.yAxisLabel != undefined) block.setYAxisLabel(state.yAxisLabel);
          if (state.graphWindowColor != undefined) block.setGraphWindowColor(state.graphWindowColor);
          if (state.legends != undefined) block.setLegends(state.legends);
          if (state.lineTypes != undefined) block.setLineTypes(state.lineTypes);
          if (state.lineColors != undefined) block.setLineColors(state.lineColors);
          if (state.lineThicknesses != undefined) block.setLineThicknesses(state.lineThicknesses);
          if (state.graphSymbols != undefined) block.setGraphSymbols(state.graphSymbols);
          if (state.graphSymbolSizes != undefined) block.setGraphSymbolSizes(state.graphSymbolSizes);
          if (state.graphSymbolColors != undefined) block.setGraphSymbolColors(state.graphSymbolColors);
          if (state.graphSymbolSpacings != undefined) block.setGraphSymbolSpacings(state.graphSymbolSpacings);
          if (state.fillOptions != undefined) block.setFillOptions(state.fillOptions);
          if (state.fillColors != undefined) block.setFillColors(state.fillColors);
          if (state.dataPortNumber != undefined) block.setDataPortNumber(state.dataPortNumber);
        } else if (block instanceof BoxPlot) {
          block.setName(state.name);
          block.setMinimumValue(state.minimumValue);
          block.setMaximumValue(state.maximumValue);
          block.setAutoScale(state.autoscale);
          block.setXAxisLabel(state.xAxisLabel);
          block.setYAxisLabel(state.yAxisLabel);
          block.setGraphWindowColor(state.graphWindowColor);
          if (state.legends != undefined) block.setLegends(state.legends);
          if (state.lineColors != undefined) block.setLineColors(state.lineColors);
          if (state.lineWidths != undefined) block.setLineWidths(state.lineWidths);
          if (state.boxColors != undefined) block.setBoxColors(state.boxColors);
          block.setDataPortNumber(state.dataPortNumber);
        } else if (block instanceof BubblePlot) {
          block.setName(state.name);
          block.setBubbleType(state.bubbleType);
          block.setAutoScale(state.autoscale);
          block.setXAxisLabel(state.xAxisLabel);
          block.setYAxisLabel(state.yAxisLabel);
          block.setMinimumXValue(state.minimumXValue);
          block.setMaximumXValue(state.maximumXValue);
          block.setMinimumYValue(state.minimumYValue);
          block.setMaximumYValue(state.maximumYValue);
          block.setMinimumZValue(state.minimumZValue);
          block.setMaximumZValue(state.maximumZValue);
          block.setMinimumBubbleRadius(state.minimumBubbleRadius);
          block.setMaximumBubbleRadius(state.maximumBubbleRadius);
          block.setViewWindowColor(state.viewWindowColor);
          block.setShowGridLines(state.showGridLines);
          if (state.defaultColor !== undefined) block.setDefaultColor(state.defaultColor);
          if (state.colorScheme !== undefined) block.setColorScheme(state.colorScheme);
          if (state.colorScale !== undefined) block.setColorScale(state.colorScale);
          if (state.opacity !== undefined) block.setOpacity(state.opacity);
        } else if (block instanceof Histogram) {
          block.setName(state.name);
          block.setMinimumXValue(state.minimumXValue);
          block.setMaximumXValue(state.maximumXValue);
          block.setMinimumYValue(state.minimumYValue);
          block.setMaximumYValue(state.maximumYValue);
          block.setAutoScale(state.autoscale);
          if (state.normalize) block.setNormalize(state.normalize)
          block.setXAxisLabel(state.xAxisLabel);
          block.setYAxisLabel(state.yAxisLabel);
          block.setGraphWindowColor(state.graphWindowColor);
          block.setShowGridLines(state.showGridLines == undefined ? false : state.showGridLines);
          if (state.legends != undefined) block.setLegends(state.legends);
          if (state.lineColors != undefined) block.setLineColors(state.lineColors);
          if (state.lineWidths != undefined) block.setLineWidths(state.lineWidths);
          if (state.fillColors != undefined) block.setFillColors(state.fillColors);
          if (state.numberOfBins != undefined) block.setNumberOfBins(state.numberOfBins);
          block.setDataPortNumber(state.dataPortNumber);
        } else if (block instanceof PieChart) {
          block.setName(state.name);
          block.setViewWindowColor(state.viewWindowColor);
          if (state.startColor !== undefined) block.setStartColor(state.startColor);
          if (state.midColor !== undefined) block.setMidColor(state.midColor);
          if (state.endColor !== undefined) block.setEndColor(state.endColor);
          block.setFractionDigits(state.fractionDigits != undefined ? state.fractionDigits : 3);
          if (state.labels !== undefined) block.setLabels(state.labels);
          if (state.donutLabel !== undefined) block.setDonutLabel(state.donutLabel);
          if (state.innerRadius !== undefined) block.setInnerRadius(state.innerRadius);
        } else if (block instanceof HeatMap) {
          block.setName(state.name);
          block.setColorScheme(state.colorScheme);
          block.setViewWindowColor(state.viewWindowColor);
          block.setXAxisLabel(state.xAxisLabel);
          block.setYAxisLabel(state.yAxisLabel);
          block.setRotated(state.rotated);
        } else if (block instanceof RadarChart) {
          block.setName(state.name);
          block.setAutoScale(state.autoscale);
          block.setViewWindowColor(state.viewWindowColor);
          block.setAxisLabels(state.axisLabels);
          block.setMinimumValue(state.minimumValue);
          block.setMaximumValue(state.maximumValue);
          block.setOpacity(state.opacity);
          if (state.spider !== undefined) block.setSpider(state.spider);
          if (state.fractionDigits !== undefined) block.setFractionDigits(state.fractionDigits);
          if (state.tickmarkSpacing !== undefined) block.setTickmarkSpacing(state.tickmarkSpacing);
          if (state.colorScheme !== undefined) block.setColorScheme(state.colorScheme);
          if (state.lineWidth !== undefined) block.setLineWidth(state.lineWidth);
          if (state.dataPortNumber != undefined) block.setDataPortNumber(state.dataPortNumber);
        } else if (block instanceof ParallelCoordinatesPlot) {
          block.setName(state.name);
          block.setAutoScale(state.autoscale);
          block.setViewWindowColor(state.viewWindowColor);
          block.setAxisLabels(state.axisLabels);
          if (state.fractionDigits !== undefined) block.setFractionDigits(state.fractionDigits);
          if (state.colorScheme !== undefined) block.setColorScheme(state.colorScheme);
          if (state.lineWidth !== undefined) block.setLineWidth(state.lineWidth);
          block.setMinimumValues(state.minimumValues);
          block.setMaximumValues(state.maximumValues);
          if (state.dataPortNumber != undefined) block.setDataPortNumber(state.dataPortNumber);
        } else if (block instanceof IntegralBlock) {
          block.setName(state.name);
          block.setFractionDigits(state.fractionDigits != undefined ? state.fractionDigits : 3);
          block.setMethod(state.method !== undefined ? state.method : "Trapezoidal Rule");
        } else if (block instanceof RegressionBlock) {
          block.setName(state.name);
          if (state.type !== undefined) block.setType(state.type);
        } else if (block instanceof CorrelationBlock) {
          block.setName(state.name);
          if (state.type !== undefined) block.setType(state.type);
        } else if (block instanceof ClusteringBlock) {
          block.setName(state.name);
          block.setNumberOfOutputs(state.numberOfOutputs);
          if (state.method !== undefined) block.setMethod(state.method);
          if (state.numberOfIterations !== undefined) block.setNumberOfIterations(state.numberOfIterations);
        } else if (block instanceof KNNClassifierBlock) {
          block.setName(state.name);
          block.setNumberOfInputs(state.numberOfInputs);
          block.setDistanceType(state.distanceType);
          block.setK(state.k);
          block.setWeighted(state.weighted);
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
          block.setBoundary(state.boundary != undefined ? state.boundary : "Dirichlet");
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
          if (state.stacked != undefined) block.setStacked(state.stacked);
          if (state.showImagePorts !== undefined) block.setShowImagePorts(state.showImagePorts);
          if (state.backgroundImageSrc != undefined) block.setBackgroundImageSrc(state.backgroundImageSrc);
          if (state.legends != undefined) block.setLegends(state.legends);
          if (state.lineTypes != undefined) block.setLineTypes(state.lineTypes);
          if (state.lineColors != undefined) block.setLineColors(state.lineColors);
          if (state.lineThicknesses != undefined) block.setLineThicknesses(state.lineThicknesses);
          if (state.fillOptions != undefined) block.setFillOptions(state.fillOptions);
          if (state.fillColors != undefined) block.setFillColors(state.fillColors);
          if (state.dataSymbols != undefined) block.setDataSymbols(state.dataSymbols);
          if (state.dataSymbolRadii != undefined) block.setDataSymbolRadii(state.dataSymbolRadii);
          if (state.dataSymbolColors != undefined) block.setDataSymbolColors(state.dataSymbolColors);
          if (state.dataSymbolSpacings != undefined) block.setDataSymbolSpacings(state.dataSymbolSpacings);
          if (state.endSymbolRadii != undefined) block.setEndSymbolRadii(state.endSymbolRadii);
          if (state.endSymbolRotatables != undefined) block.setEndSymbolRotatables(state.endSymbolRotatables);
          if (state.endSymbolConnections != undefined) block.setEndSymbolConnections(state.endSymbolConnections);
          if (state.numberOfPoints != undefined) block.setNumberOfPoints(state.numberOfPoints);
        } else if (block instanceof Space3D) {
          block.setName(state.name);
          block.setXAxisLabel(state.xAxisLabel);
          block.setYAxisLabel(state.yAxisLabel);
          block.setZAxisLabel(state.zAxisLabel);
          if (state.backgroundColor !== undefined) block.setBackgroundColor(state.backgroundColor);
          block.setPointInput(state.pointInput);
          block.setNumberOfPoints(state.numberOfPoints);
          if (state.showImagePorts !== undefined) block.setShowImagePorts(state.showImagePorts);
          block.setLegends(state.legends);
          block.setLineTypes(state.lineTypes);
          block.setLineColors(state.lineColors);
          if (state.lineWidths !== undefined) block.setLineWidths(state.lineWidths);
          if (state.endSymbolConnections != undefined) block.setEndSymbolConnections(state.endSymbolConnections);
          block.setEndSymbolRadii(state.endSymbolRadii);
          block.setDataSymbols(state.dataSymbols);
          block.setDataSymbolRadii(state.dataSymbolRadii);
          block.setDataSymbolColors(state.dataSymbolColors);
          block.setDataSymbolSpacings(state.dataSymbolSpacings);
          if (state.boxSize !== undefined) block.setBoxSizes(state.boxSize, state.boxSize, state.boxSize);
          if (state.boxSizeX !== undefined && state.boxSizeY !== undefined && state.boxSizeZ !== undefined)
            block.setBoxSizes(state.boxSizeX, state.boxSizeY, state.boxSizeZ);
          if (state.cameraPositionX !== undefined && state.cameraRotationX !== undefined)
            block.setCameraPosition(state.cameraPositionX, state.cameraPositionY, state.cameraPositionZ, state.cameraRotationX, state.cameraRotationY, state.cameraRotationZ);
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
        } else if (block instanceof Surface3D) {
          block.setName(state.name);
          block.setTripleArrayInput(state.tripleArrayInput);
          block.setScaleType(state.scaleType);
          block.setXAxisLabel(state.xAxisLabel);
          block.setYAxisLabel(state.yAxisLabel);
          block.setZAxisLabel(state.zAxisLabel);
          if (state.boxSize !== undefined) block.setBoxSizes(state.boxSize, state.boxSize, state.boxSize);
          if (state.boxSizeX !== undefined && state.boxSizeY !== undefined && state.boxSizeZ !== undefined)
            block.setBoxSizes(state.boxSizeX, state.boxSizeY, state.boxSizeZ);
          block.setColorScheme(state.colorScheme);
          if (state.backgroundColor !== undefined) block.setBackgroundColor(state.backgroundColor);
          if (state.cameraPositionX !== undefined && state.cameraRotationX !== undefined)
            block.setCameraPosition(state.cameraPositionX, state.cameraPositionY, state.cameraPositionZ, state.cameraRotationX, state.cameraRotationY, state.cameraRotationZ);
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
          block.setParameterName1(state.parameterName !== undefined ? state.parameterName : "t"); // backward compatible
          if (state.parameterName1 !== undefined) block.setParameterName1(state.parameterName1);
          if (state.parameterName2 !== undefined) block.setParameterName2(state.parameterName2);
          block.setExpressionX(state.expressionX ? state.expressionX : "cos(t)");
          block.setExpressionY(state.expressionY ? state.expressionY : "sin(t)");
          block.setExpressionZ(state.expressionZ ? state.expressionZ : "");
        } else if (block instanceof BundledFunctionsBlock) {
          block.setName(state.name);
          block.setInputName(state.inputName ? state.inputName : "t");
          block.setExpressions(state.expressions);
          if (state.updateImmediately !== undefined) block.setUpdateImmediately(state.updateImmediately);
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
          if (state.singleOutput !== undefined) block.setSingleOutput(state.singleOutput);
          block.setData(state.data);
          block.setContent(state.content);
          block.setFormat(state.format);
          if (state.imageSrc !== undefined) block.setImageSrc(state.imageSrc);
        } else if (block instanceof MolecularViewerBlock) {
          block.setName(state.name);
          if (state.style !== undefined) block.setStyle(state.style);
          if (state.controlType !== undefined) block.setControlType(state.controlType);
          if (state.backgroundColor !== undefined) block.setBackgroundColor(state.backgroundColor);
          if (state.boxSize !== undefined) block.setBoxSizes(state.boxSize, state.boxSize, state.boxSize);
          if (state.boxSizeX !== undefined && state.boxSizeY !== undefined && state.boxSizeZ !== undefined) {
            block.setBoxSizes(state.boxSizeX, state.boxSizeY, state.boxSizeZ);
          }
          if (state.cameraPositionX !== undefined && state.cameraRotationX !== undefined) {
            block.setCameraPosition(state.cameraPositionX, state.cameraPositionY, state.cameraPositionZ, state.cameraRotationX, state.cameraRotationY, state.cameraRotationZ);
          }
        } else if (block instanceof ArrayAdapter) {
          block.setColumns(state.columns);
        } else if (block instanceof ArrayInput) {
          block.setName(state.name);
          if (state.multidimensionalOutput !== undefined) block.setSingleOutput(state.multidimensionalOutput);
          block.setText(state.text !== undefined ? state.text : "");
          block.setMarginX(state.marginX);
          block.setMarginY(state.marginY);
          block.setTextColor(state.textColor);
        } else if (block instanceof StringInput) {
          block.setName(state.name);
          block.setContent(state.content !== undefined ? state.content : "");
          block.setMarginX(state.marginX);
          block.setMarginY(state.marginY);
          block.setTextColor(state.textColor);
        } else if (block instanceof MeanBlock) {
          if (state.symbol !== undefined) block.setSymbol(state.symbol);
          block.setType(state.type);
        } else if (block instanceof UnivariateDescriptiveStatisticsBlock) {
          block.setSymbol(state.symbol);
        } else if (block instanceof WordCloud) {
          block.setName(state.name);
          if (state.exclusion !== undefined) block.setExclusion(state.exclusion);
          if (state.alignment !== undefined) block.setAlignment(state.alignment);
          if (state.colorScheme !== undefined) block.setColorScheme(state.colorScheme);
          if (state.viewWindowColor !== undefined) block.setViewWindowColor(state.viewWindowColor);
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
      } else if (b instanceof Sticker) {
        if (b.getUseHtml()) {
          b.locateHtmlOverlay();
        }
      } else if (b instanceof Basic3DBlock) {
        b.locateOverlay();
      } else if (b instanceof ArrayInput || b instanceof StringInput) {
        b.locateOverlay();
      }
    }
  }

  static open(): void {
    let fileDialog = document.getElementById('state-file-dialog') as HTMLInputElement;
    fileDialog.onchange = e => {
      let target = <HTMLInputElement>event.target;
      if (target.files.length) {
        flowchart.destroy();
        examples.deselect();
        let reader: FileReader = new FileReader();
        reader.readAsText(target.files[0]);
        this.lastFileName = target.files[0].name;
        reader.onload = (e) => {
          let s = JSON.parse(reader.result.toString());
          this.restore(s);
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
    let d = $('#modal-dialog').html(`<div style="font-family: Arial; line-height: 30px; font-size: 90%;">
        Save as:<br><input type="text" id="${this.inputFieldId}" style="width: 260px;" value="${this.lastFileName}">`);
    let inputFileName = document.getElementById(this.inputFieldId) as HTMLInputElement;
    Util.selectField(inputFileName, 0, inputFileName.value.indexOf("."));
    let okFunction = () => {
      Util.saveText(data, inputFileName.value);
      this.lastFileName = inputFileName.value;
      d.dialog('close');
    };
    inputFileName.addEventListener("keyup", (e) => {
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
