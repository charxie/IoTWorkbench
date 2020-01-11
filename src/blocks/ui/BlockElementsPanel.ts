/*
 * @author Charles Xie
 */

import {UnaryFunctionBlock} from "../UnaryFunctionBlock";
import {BinaryFunctionBlock} from "../BinaryFunctionBlock";
import {NegationBlock} from "../NegationBlock";
import {LogicBlock} from "../LogicBlock";
import {ArithmeticBlock} from "../ArithmeticBlock";
import {Slider} from "../Slider";
import {FunctionBlock} from "../FunctionBlock";
import {Sticker} from "../Sticker";
import {ToggleSwitch} from "../ToggleSwitch";
import {ConditionalStatementBlock} from "../ConditionalStatementBlock";
import {SeriesBlock} from "../SeriesBlock";
import {ItemSelector} from "../ItemSelector";
import {Grapher} from "../Grapher";
import {WorkerBlock} from "../WorkerBlock";
import {ParametricEquationBlock} from "../ParametricEquationBlock";
import {XYGraph} from "../XYGraph";
import {GlobalVariableBlock} from "../GlobalVariableBlock";

export class BlockElementsPanel {

  getUi(): string {
    return `<h2 style="text-align: left; font-size: 18px; vertical-align: top; margin-top: 0; margin-bottom: 10px">
                <span style="font-size: 1.2em; color: teal; vertical-align: middle;"><i class="fas fa-cubes"></i></span> Elements</h2>
            <div id="elements-scroller" class="vertical-scroll" style="height: 380px; margin-top: 0; border-bottom: 2px solid lightgray; border-top: 2px solid lightgray">
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Operators & Functions</h3>
              <div class="horizontal-scroll" style="margin-right: 10px; background-color: aquamarine; border: 1px solid #b81900; border-radius: 4px">
                <table style="width: 100%">
                  <tr>
                  <td><canvas draggable="true" id="arithmetic-add-block" title="Arithmetic Operator" width="45px" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="logic-and-block" title="Logic Operator" width="45px" height="60px" style="left: 10px; cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="logic-not-block" title="Not Operator" width="45px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="unary-function-block" title="f(x)" width="45px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="binary-function-block" title="f(x, y)" width="45px" height="70px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="parametric-equation-block" title="x(t), y(t)" width="45px" height="80px" style="cursor: pointer;"/></td>
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
                  <td><canvas draggable="true" id="sticker-block" title="Text Display" width="45px" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="grapher-block" title="Grapher" width="45px" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="xygraph-block" title="X-Y Graph" width="45px" height="45px" style="cursor: pointer;"/></td>
                  </tr>
                </table>
              </div>
              <div class="vertical-divider"></div>
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Data Structures</h3>
              <div class="horizontal-scroll" style="margin-right: 10px; background-color: aqua; border: 1px solid #b81900; border-radius: 4px">
                <table style="width: 100%">
                  <tr>
                  <td><canvas draggable="true" id="global-variable-block" title="Global Variable" width="45x" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="series-block" title="Series" width="45x" height="60px" style="cursor: pointer;"/></td>
                  </tr>
                </table>
              </div>
              <div class="vertical-divider"></div>
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Flow Controllers</h3>
              <div class="horizontal-scroll" style="margin-right: 10px; background-color: lavender; border: 1px solid #b81900; border-radius: 4px">
                <table style="width: 100%">
                  <tr>
                  <td><canvas draggable="true" id="conditional-statement-block" title="If-else" width="45x" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="worker-block" title="Worker" width="45x" height="45px" style="cursor: pointer;"/></td>
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
    this.drawParametricEquationBlock("parametric-equation-block");
    this.drawLogicBlock("AND Block", "AND", "logic-and-block");
    this.drawNegationBlock("logic-not-block");
    this.drawArithmeticBlock("Add Block", "+", "arithmetic-add-block");
    this.drawToggleSwitch("Switch", "toggle-switch-block");
    this.drawSlider("Slider", "slider-block");
    this.drawItemSelector("Item Selector", "item-selector-block");
    this.drawSticker("Sticker", "sticker-block");
    this.drawGrapher("Grapher", "grapher-block");
    this.drawXYGraph("XYGraph", "xygraph-block");
    this.drawGlobalVariableBlock("Global Variable Block", "var", "global-variable-block");
    this.drawSeriesBlock("Series Block", "Series", "series-block");
    this.drawConditionalStatementBlock("Conditional Statement Block", "IF", "conditional-statement-block");
    this.drawWorkerBlock("Worker Block", "Worker", "worker-block");
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
    let block = new GlobalVariableBlock("Global Variable Block Icon", name, symbol,8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawSeriesBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new SeriesBlock("Series Block Icon", 8, 8, canvas.width - 16, canvas.height - 16, name, symbol);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawConditionalStatementBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new ConditionalStatementBlock("Conditional Statement Block Icon", 8, 8, canvas.width - 16, canvas.height - 16, name, symbol);
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

  private drawGrapher(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new Grapher("Grapher Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawXYGraph(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new XYGraph("X-Y Graph Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
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

  private drawArithmeticBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new ArithmeticBlock("Arithmetic Block Icon", 8, 8, canvas.width - 16, canvas.height - 16, name, symbol);
    block.setName(name);
    block.setIconic(true);
    block.draw(ctx);
  }

  private drawLogicBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new LogicBlock("Logic Block Icon", 8, 8, canvas.width - 16, canvas.height - 16, name, symbol);
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

  private drawParametricEquationBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new ParametricEquationBlock("Parametric Equation Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    if (block != null) {
      block.setIconic(true);
      block.draw(ctx);
    }
  }

}
