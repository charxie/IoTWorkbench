/*
 * @author Charles Xie
 */

import {UnivariateFunctionBlock} from "../UnivariateFunctionBlock";
import {BivariateFunctionBlock} from "../BivariateFunctionBlock";
import {MultivariateFunctionBlock} from "../MultivariateFunctionBlock";
import {NegationBlock} from "../NegationBlock";
import {LogicBlock} from "../LogicBlock";
import {ArithmeticBlock} from "../ArithmeticBlock";
import {Slider} from "../Slider";
import {Sticker} from "../Sticker";
import {ToggleSwitch} from "../ToggleSwitch";
import {TurnoutSwitch} from "../TurnoutSwitch";
import {SeriesBlock} from "../SeriesBlock";
import {ItemSelector} from "../ItemSelector";
import {Grapher} from "../Grapher";
import {WorkerBlock} from "../WorkerBlock";
import {ParametricEquationBlock} from "../ParametricEquationBlock";
import {Space2D} from "../Space2D";
import {Space3D} from "../Space3D";
import {Field2D} from "../Field2D";
import {Surface3D} from "../Surface3D";
import {GlobalVariableBlock} from "../GlobalVariableBlock";
import {MomentarySwitch} from "../MomentarySwitch";
import {Beeper} from "../Beeper";
import {SwitchStatementBlock} from "../SwitchStatementBlock";
import {GlobalObjectBlock} from "../GlobalObjectBlock";
import {RgbaColorBlock} from "../RgbaColorBlock";
import {ComplexNumberBlock} from "../ComplexNumberBlock";
import {ActionBlock} from "../ActionBlock";
import {BundledFunctionsBlock} from "../BundledFunctionsBlock";
import {BitwiseOperatorBlock} from "../BitwiseOperatorBlock";
import {FunctionDeclarationBlock} from "../FunctionDeclarationBlock";
import {VectorBlock} from "../VectorBlock";
import {NormalizationBlock} from "../NormalizationBlock";
import {MatrixBlock} from "../MatrixBlock";
import {DeterminantBlock} from "../DeterminantBlock";
import {MatrixInversionBlock} from "../MatrixInversionBlock";
import {MatrixTranspositionBlock} from "../MatrixTranspositionBlock";
import {IntegralBlock} from "../IntegralBlock";
import {FFTBlock} from "../FFTBlock";
import {ODESolverBlock} from "../ODESolverBlock";
import {TransientStateFDMSolverBlock} from "../TransientStateFDMSolverBlock";
import {SteadyStateFDMSolverBlock} from "../SteadyStateFDMSolverBlock";
import {RandomNumberGeneratorBlock} from "../RandomNumberGeneratorBlock";
import {BoundaryConditionBlock} from "../BoundaryConditionBlock";
import {ImageBlock} from "../ImageBlock";
import {AudioBlock} from "../AudioBlock";
import {DataBlock} from "../DataBlock";
import {MolecularViewerBlock} from "../MolecularViewerBlock";
import {ArrayInput} from "../ArrayInput";
import {MeanBlock} from "../MeanBlock";
import {UnivariateDescriptiveStatisticsBlock} from "../UnivariateDescriptiveStatisticsBlock";
import {BoxPlot} from "../BoxPlot";
import {Histogram} from "../Histogram";
import {WordCloud} from "../WordCloud";
import {PieChart} from "../PieChart";
import {RegressionBlock} from "../RegressionBlock";
import {CorrelationBlock} from "../CorrelationBlock";
import {StringInput} from "../StringInput";
import {ClusteringBlock} from "../ClusteringBlock";

export class BlockElementsPanel {

  getUi(): string {
    return `<h2 style="text-align: left; font-size: 18px; vertical-align: top; margin-top: 0; margin-bottom: 10px">
                <span style="font-size: 1.2em; color: teal; vertical-align: middle;"><i class="fas fa-cubes"></i></span> Blocks</h2>
            <div id="elements-scroller" class="vertical-scroll" style="height: 400px; margin-top: 0; border-bottom: 2px solid lightgray; border-top: 2px solid lightgray">
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Operators & Functions</h3>
              <div class="horizontal-scroll" style="margin-right: 10px; background-color: aquamarine; border: 1px solid #b81900; border-radius: 4px">
                <table style="width: 100%">
                  <tr>
                  <td><canvas draggable="true" id="arithmetic-add-block" title="Arithmetic Operator" width="45px" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="bitwise-operator-and-block" title="Bitwise Operator" width="45px" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="logic-and-block" title="Logic Operator" width="45px" height="60px" style="left: 10px; cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="logic-not-block" title="Not Operator" width="45px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="univariate-function-block" title="Univariate Function" width="45px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="bivariate-function-block" title="Bivariate Function" width="45px" height="70px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="multivariate-function-block" title="Multivariate Function" width="45px" height="80px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="parametric-equation-block" title="Parametric Equations" width="45px" height="80px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="bundled-functions-block" title="Bundled Functions" width="45px" height="80px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="fft-block" title="Fourier Transform" width="45px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="mean-block" title="Mean" width="45px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="univariate-descriptive-statistics-block" title="Univariate Descriptive Statistics" width="45px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="normalization-block" title="Vector Normalization" width="45px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="determinant-block" title="Matrix Determinant" width="45px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="matrix-transposition-block" title="Matrix Transposition" width="45px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="matrix-inversion-block" title="Matrix Inversion" width="45px" height="60px" style="cursor: pointer;"/></td>
                  </tr>
                </table>
              </div>
              <div class="vertical-divider"></div>
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Inputs & Outputs</h3>
              <div class="horizontal-scroll" style="margin-right: 10px; background-color: moccasin; border: 1px solid #b81900; border-radius: 4px">
                <table style="width: 100%">
                  <tr>
                  <td><canvas draggable="true" id="slider-block" title="Slider" width="60x" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="item-selector-block" title="Item Selector" width="45x" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="toggle-switch-block" title="Toggle Switch" width="45px" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="momentary-switch-block" title="Momentary Switch" width="45px" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="sticker-block" title="Text Display" width="60px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="array-input-block" title="Array Input" width="60px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="string-input-block" title="String Input" width="60px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="grapher-block" title="Grapher" width="60px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="box-plot-block" title="Box Plot" width="60px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="histogram-block" title="Histogram" width="60px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="pie-chart-block" title="Pie Chart" width="60px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="space2d-block" title="Space2D" width="60px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="space3d-block" title="Space3D" width="60px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="field2d-block" title="Contour Plot" width="60px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="surface3d-block" title="Surface Plot" width="60px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="wordcloud-block" title="Wordcloud" width="60x" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="beeper-block" title="Beeper" width="60px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="image-block" title="Image" width="60x" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="audio-block" title="Audio" width="60x" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="data-block" title="Data" width="60x" height="60px" style="cursor: pointer;"/></td>
                  </tr>
                </table>
              </div>
              <div class="vertical-divider"></div>
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Data Structures</h3>
              <div class="horizontal-scroll" style="margin-right: 10px; background-color: aqua; border: 1px solid #b81900; border-radius: 4px">
                <table style="width: 100%">
                  <tr>
                  <td><canvas draggable="true" id="global-variable-block" title="Global Variable" width="45x" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="global-object-block" title="Global Object" width="45x" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="series-block" title="Series" width="45x" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="function-declaration-block" title="Function Declaration" width="45x" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="rgba-color-block" title="RGBA Color" width="45x" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="complex-number-block" title="Complex Number" width="45x" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="vector-block" title="Vector" width="45x" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="matrix-block" title="Matrix" width="60x" height="60px" style="cursor: pointer;"/></td>
                  </tr>
                </table>
              </div>
              <div class="vertical-divider"></div>
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Tools</h3>
              <div class="horizontal-scroll" style="margin-right: 10px; background-color: lavender; border: 1px solid #b81900; border-radius: 4px">
                <table style="width: 100%">
                  <tr>
                  <td><canvas draggable="true" id="turnout-switch-block" title="Turnout Switch" width="45x" height="70px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="switch-statement-block" title="Switch Statement" width="45x" height="70px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="worker-block" title="Worker" width="45x" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="action-block" title="Action" width="45x" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="random-number-generator-block" title="Random Number Generator" width="45x" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="ode-solver-block" title="ODE Solver" width="45px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="transient-state-fdm-solver-block" title="Transient State FDM Solver" width="45px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="steady-state-fdm-solver-block" title="Steady State FDM Solver" width="45px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="boundary-condition-block" title="Boundary Condition" width="45px" height="75px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="integral-block" title="Integration" width="45px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="regression-block" title="Regression" width="45px" height="70px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="correlation-block" title="Correlation" width="45px" height="70px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="clustering-block" title="Clustering" width="45px" height="70px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="molecular-viewer-block" title="Molecular Viewer" width="60px" height="60px" style="cursor: pointer;"/></td>
                  </tr>
                </table>
              </div>
            </div>`;
  }

  render(selectorId: string): void {
    let element = document.getElementById(selectorId);
    element.innerHTML = this.getUi();
    this.drawUnivariateFunctionBlock("univariate-function-block");
    this.drawBivariateFunctionBlock("bivariate-function-block");
    this.drawMultivariateFunctionBlock("multivariate-function-block");
    this.drawParametricEquationBlock("parametric-equation-block");
    this.drawBundledFunctionsBlock("bundled-functions-block");
    this.drawLogicBlock("AND Block", "AND", "logic-and-block");
    this.drawNegationBlock("logic-not-block");
    this.drawArithmeticBlock("Add Block", "+", "arithmetic-add-block");
    this.drawBitwiseOperatorBlock("AND Block", "&", "bitwise-operator-and-block");
    this.drawToggleSwitch("Switch", "toggle-switch-block");
    this.drawMomentarySwitch("Momentary Switch", "momentary-switch-block");
    this.drawSlider("Slider", "slider-block");
    this.drawItemSelector("Item Selector", "item-selector-block");
    this.drawSticker("Sticker", "sticker-block");
    this.drawBeeper("Beeper", "beeper-block");
    this.drawGrapher("Grapher", "grapher-block");
    this.drawBoxPlot("Box Plot", "box-plot-block");
    this.drawIntegralBlock("Integral Block", "integral-block");
    this.drawRegressionBlock("Regression Block", "regression-block");
    this.drawCorrelationBlock("Correlation Block", "correlation-block");
    this.drawClusteringBlock("Clustering Block", "clustering-block");
    this.drawFFTBlock("FFT Block", "fft-block");
    this.drawODESolverBlock("ODE Solver Block", "ode-solver-block");
    this.drawTransientStateFDMSolverBlock("Transient State FDM Solver Block", "transient-state-fdm-solver-block");
    this.drawSteadyStateFDMSolverBlock("Steady State FDM Solver Block", "steady-state-fdm-solver-block");
    this.drawBoundaryConditionBlock("Boundary Condition Block", "boundary-condition-block");
    this.drawHistogram("Histogram", "histogram-block");
    this.drawPieChart("Pie Chart", "pie-chart-block");
    this.drawSpace2D("Space2D", "space2d-block");
    this.drawSpace3D("Space3D", "space3d-block");
    this.drawField2D("Field2D", "field2d-block");
    this.drawSurface3D("Surface3D", "surface3d-block");
    this.drawGlobalVariableBlock("Global Variable Block", "var", "global-variable-block");
    this.drawGlobalObjectBlock("Global Object Block", "obj", "global-object-block");
    this.drawFunctionDeclarationBlock("Function Declaration Block", "obj", "function-declaration-block");
    this.drawSeriesBlock("Series Block", "Series", "series-block");
    this.drawRgbaColorBlock("Rgba Color Block", "RGBA", "rgba-color-block");
    this.drawComplexNumberBlock("Complext Number Block", "a+b*i", "complex-number-block");
    this.drawVectorBlock("Vector Block", "V", "vector-block");
    this.drawNormalizationBlock("normalization-block");
    this.drawMatrixBlock("Matrix Block", "M", "matrix-block");
    this.drawDeterminantBlock("determinant-block");
    this.drawMatrixTranspositionBlock("matrix-transposition-block");
    this.drawMatrixInversionBlock("matrix-inversion-block");
    this.drawTurnoutSwitch("Turnout Switch", "Turnout", "turnout-switch-block");
    this.drawSwitchStatementBlock("Switch Statement Block", "Switch", "switch-statement-block");
    this.drawWorkerBlock("Worker Block", "Worker", "worker-block");
    this.drawActionBlock("Action Block", "Action", "action-block");
    this.drawImageBlock("Image Block", "⛱", "image-block");
    this.drawAudioBlock("Audio Block", "♬", "audio-block");
    this.drawDataBlock("Data Block", "Data", "data-block");
    this.drawRandomNumberGeneratorBlock("Random Number Generator Block", "Random", "random-number-generator-block");
    this.drawArrayInput("Array Input", "array-input-block");
    this.drawStringInput("String Input", "string-input-block");
    this.drawMeanBlock("mean-block");
    this.drawUnivariateDescriptiveStatisticsBlock("univariate-descriptive-statistics-block");
    this.drawMolecularViewerBlock("Molecular Viewer Block", "Molecular Viewer", "molecular-viewer-block");
    this.drawWordCloud("Wordcloud", "wordcloud-block");
  }

  private drawRandomNumberGeneratorBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new RandomNumberGeneratorBlock("Random Number Generator Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawFunctionDeclarationBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new FunctionDeclarationBlock("Function Declaration Block Icon", "Function Declaration", "F", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawActionBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new ActionBlock("Action Block Icon", "Action", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawImageBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new ImageBlock("Image Block Icon", "Image", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setSymbol(symbol);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawAudioBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new AudioBlock("Audio Block Icon", "Audio", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setSymbol(symbol);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawDataBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new DataBlock("Data Block Icon", "Data", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawMolecularViewerBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new MolecularViewerBlock(true, "Molecular Viewer Block Icon", "Molecular Viewer", 8, 8, canvas.width - 16, canvas.height - 16);
    block.draw(ctx);
  }

  private drawWorkerBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new WorkerBlock("Worker Block Icon", "Worker", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawGlobalVariableBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new GlobalVariableBlock("Global Variable Block Icon", name, symbol, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawGlobalObjectBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new GlobalObjectBlock("Global Object Block Icon", name, symbol, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawSeriesBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new SeriesBlock("Series Block Icon", name, symbol, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawRgbaColorBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new RgbaColorBlock("Rgba Color Block Icon", name, symbol, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawComplexNumberBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new ComplexNumberBlock("Complext Number Block Icon", name, symbol, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawVectorBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new VectorBlock("Vector Block Icon", name, symbol, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawNormalizationBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new NormalizationBlock("Normalization Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawMatrixBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new MatrixBlock("Matrix Block Icon", name, symbol, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawDeterminantBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new DeterminantBlock("Determinant Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawMatrixTranspositionBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new MatrixTranspositionBlock("Matrix Transposition Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawMatrixInversionBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new MatrixInversionBlock("Matrix Inversion Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawSwitchStatementBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new SwitchStatementBlock("Switch Statement Block Icon", name, symbol, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawTurnoutSwitch(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new TurnoutSwitch("Turnout Switch Icon", name, symbol, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawArrayInput(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new ArrayInput("Array Input Icon", true, name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.draw(ctx);
  }

  private drawStringInput(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new StringInput("String Input Icon", true, name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.draw(ctx);
  }

  private drawSticker(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new Sticker("Sticker Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawBeeper(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new Beeper("Beeper Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawGrapher(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new Grapher("Grapher Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawHistogram(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new Histogram("Histogram Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawPieChart(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new PieChart("Pie Chart Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawBoxPlot(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new BoxPlot("Box Plot Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawIntegralBlock(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new IntegralBlock("Integral Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawRegressionBlock(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new RegressionBlock("Regression Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawCorrelationBlock(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new CorrelationBlock("Correlation Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawClusteringBlock(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new ClusteringBlock("Clustering Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawFFTBlock(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new FFTBlock("FFT Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawODESolverBlock(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new ODESolverBlock("ODE Solver Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawTransientStateFDMSolverBlock(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new TransientStateFDMSolverBlock("Transient State FDM Solver Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawSteadyStateFDMSolverBlock(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new SteadyStateFDMSolverBlock("Steady State FDM Solver Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawBoundaryConditionBlock(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new BoundaryConditionBlock("Boundary Condition Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawSpace2D(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new Space2D("Space2D Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawSpace3D(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new Space3D(true, "Space3D Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.draw(ctx);
  }

  private drawField2D(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new Field2D("Field2D Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawSurface3D(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new Surface3D(true, "Surface3D Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.draw(ctx);
  }

  private drawToggleSwitch(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new ToggleSwitch("Toggle Switch Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawMomentarySwitch(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new MomentarySwitch("Momentary Switch Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawSlider(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new Slider("Slider Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawItemSelector(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new ItemSelector("Item Selector Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawBitwiseOperatorBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new BitwiseOperatorBlock("Bitwise Operator Block Icon", name, symbol, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setName(name);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawArithmeticBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new ArithmeticBlock("Arithmetic Block Icon", name, symbol, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setName(name);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawLogicBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new LogicBlock("Logic Block Icon", name, symbol, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setName(name);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawNegationBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new NegationBlock("Negation Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawUnivariateFunctionBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new UnivariateFunctionBlock("Univariate Function Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    if (block != null) {
      block.setIconic(true);
      block.draw(ctx);
    }
  }

  private drawBivariateFunctionBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new BivariateFunctionBlock("Bivariate Function Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    if (block != null) {
      block.setIconic(true);
      block.draw(ctx);
    }
  }

  private drawMultivariateFunctionBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new MultivariateFunctionBlock("Multivariate Function Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    if (block != null) {
      block.setIconic(true);
      block.draw(ctx);
    }
  }

  private drawParametricEquationBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new ParametricEquationBlock("Parametric Equation Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    if (block != null) {
      block.setIconic(true);
      block.draw(ctx);
    }
  }

  private drawBundledFunctionsBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new BundledFunctionsBlock("Bundled Functions Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    if (block != null) {
      block.setIconic(true);
      block.draw(ctx);
    }
  }

  private drawMeanBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new MeanBlock("Mean Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawUnivariateDescriptiveStatisticsBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new UnivariateDescriptiveStatisticsBlock("Univariate Descriptive Statistics Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawWordCloud(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new WordCloud("Wordcloud Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

}
