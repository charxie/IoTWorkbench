/*
 * @author Charles Xie
 */

import {UnaryFunctionBlock} from "../UnaryFunctionBlock";
import {BinaryFunctionBlock} from "../BinaryFunctionBlock";
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
import {GlobalVariableBlock} from "../GlobalVariableBlock";
import {MomentarySwitch} from "../MomentarySwitch";
import {Beeper} from "../Beeper";
import {SwitchStatementBlock} from "../SwitchStatementBlock";
import {MultivariableFunctionBlock} from "../MultivariableFunctionBlock";
import {GlobalObjectBlock} from "../GlobalObjectBlock";
import {RgbaColorBlock} from "../RgbaColorBlock";
import {ComplexNumberBlock} from "../ComplexNumberBlock";
import {ActionBlock} from "../ActionBlock";
import {BundledFunctionsBlock} from "../BundledFunctionsBlock";
import {BitwiseOperatorBlock} from "../BitwiseOperatorBlock";
import {FunctionDeclarationBlock} from "../FunctionDeclarationBlock";
import {VectorBlock} from "../VectorBlock";
import {NormalizationBlock} from "../NormalizationBlock";

export class BlockElementsPanel {

  getUi(): string {
    return `<h2 style="text-align: left; font-size: 18px; vertical-align: top; margin-top: 0; margin-bottom: 10px">
                <span style="font-size: 1.2em; color: teal; vertical-align: middle;"><i class="fas fa-cubes"></i></span> Blocks</h2>
            <div id="elements-scroller" class="vertical-scroll" style="height: 380px; margin-top: 0; border-bottom: 2px solid lightgray; border-top: 2px solid lightgray">
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Operators & Functions</h3>
              <div class="horizontal-scroll" style="margin-right: 10px; background-color: aquamarine; border: 1px solid #b81900; border-radius: 4px">
                <table style="width: 100%">
                  <tr>
                  <td><canvas draggable="true" id="arithmetic-add-block" title="Arithmetic Operator" width="45px" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="bitwise-operator-and-block" title="Bitwise Operator" width="45px" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="logic-and-block" title="Logic Operator" width="45px" height="60px" style="left: 10px; cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="logic-not-block" title="Not Operator" width="45px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="normalization-block" title="Vector Normalization" width="45px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="unary-function-block" title="Unary Function" width="45px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="binary-function-block" title="Binary Function" width="45px" height="70px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="multivariable-function-block" title="Multivariable Function" width="45px" height="80px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="parametric-equation-block" title="Parametric Equations" width="45px" height="80px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="bundled-functions-block" title="Bundled Functions" width="45px" height="80px" style="cursor: pointer;"/></td>
                  </tr>
                </table>
              </div>
              <div class="vertical-divider"></div>
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> I/O</h3>
              <div class="horizontal-scroll" style="margin-right: 10px; background-color: moccasin; border: 1px solid #b81900; border-radius: 4px">
                <table style="width: 100%">
                  <tr>
                  <td><canvas draggable="true" id="slider-block" title="Slider" width="60x" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="item-selector-block" title="Item Selector" width="50x" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="toggle-switch-block" title="Toggle Switch" width="45px" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="momentary-switch-block" title="Momentary Switch" width="45px" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="sticker-block" title="Text Display" width="45px" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="beeper-block" title="Beeper" width="45px" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="grapher-block" title="Grapher" width="45px" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="space2d-block" title="Space2D" width="45px" height="45px" style="cursor: pointer;"/></td>
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
                  <td><canvas draggable="true" id="function-declaration-block" title="Function Declaration" width="45x" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="series-block" title="Series" width="45x" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="rgba-color-block" title="RGBA Color" width="45x" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="complex-number-block" title="Complex Number" width="45x" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="vector-block" title="Vector" width="45x" height="60px" style="cursor: pointer;"/></td>
                  </tr>
                </table>
              </div>
              <div class="vertical-divider"></div>
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Flow Controllers</h3>
              <div class="horizontal-scroll" style="margin-right: 10px; background-color: lavender; border: 1px solid #b81900; border-radius: 4px">
                <table style="width: 100%">
                  <tr>
                  <td><canvas draggable="true" id="turnout-switch-block" title="Turnout Switch" width="45x" height="70px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="switch-statement-block" title="Switch Statement" width="45x" height="70px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="worker-block" title="Worker" width="45x" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="action-block" title="Action" width="45x" height="45px" style="cursor: pointer;"/></td>
                  </tr>
                </table>
              </div>
            </div>`;
  }

  render(selectorId: string): void {
    let element = document.getElementById(selectorId);
    element.innerHTML = this.getUi();
    this.drawUnaryFunctionBlock("unary-function-block");
    this.drawBinaryFunctionBlock("binary-function-block");
    this.drawMultivariableFunctionBlock("multivariable-function-block");
    this.drawParametricEquationBlock("parametric-equation-block");
    this.drawBundledFunctionsBlock("bundled-functions-block");
    this.drawLogicBlock("AND Block", "AND", "logic-and-block");
    this.drawNegationBlock("logic-not-block");
    this.drawNormalizationBlock("normalization-block");
    this.drawArithmeticBlock("Add Block", "+", "arithmetic-add-block");
    this.drawBitwiseOperatorBlock("AND Block", "&", "bitwise-operator-and-block");
    this.drawToggleSwitch("Switch", "toggle-switch-block");
    this.drawMomentarySwitch("Momentary Switch", "momentary-switch-block");
    this.drawSlider("Slider", "slider-block");
    this.drawItemSelector("Item Selector", "item-selector-block");
    this.drawSticker("Sticker", "sticker-block");
    this.drawBeeper("Beeper", "beeper-block");
    this.drawGrapher("Grapher", "grapher-block");
    this.drawSpace2D("Space2D", "space2d-block");
    this.drawGlobalVariableBlock("Global Variable Block", "var", "global-variable-block");
    this.drawGlobalObjectBlock("Global Object Block", "obj", "global-object-block");
    this.drawFunctionDeclarationBlock("Function Declaration Block", "obj", "function-declaration-block");
    this.drawSeriesBlock("Series Block", "Series", "series-block");
    this.drawRgbaColorBlock("Rgba Color Block", "RGBA", "rgba-color-block");
    this.drawComplexNumberBlock("Complext Number Block", "a+b*i", "complex-number-block");
    this.drawVectorBlock("Vector Block", "V", "vector-block");
    this.drawTurnoutSwitch("Turnout Switch", "Turnout", "turnout-switch-block");
    this.drawSwitchStatementBlock("Switch Statement Block", "Switch", "switch-statement-block");
    this.drawWorkerBlock("Worker Block", "Worker", "worker-block");
    this.drawActionBlock("Action Block", "Action", "action-block");
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

  private drawSpace2D(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new Space2D("Space2D Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
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

  private drawNormalizationBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new NormalizationBlock("Normalization Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawUnaryFunctionBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new UnaryFunctionBlock("Unary Function Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    if (block != null) {
      block.setIconic(true);
      block.draw(ctx);
    }
  }

  private drawBinaryFunctionBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new BinaryFunctionBlock("Binary Function Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    if (block != null) {
      block.setIconic(true);
      block.draw(ctx);
    }
  }

  private drawMultivariableFunctionBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new MultivariableFunctionBlock("Multivariable Function Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
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

}
