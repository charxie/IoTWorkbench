/*
 * @author Charles Xie
 */

import {UnaryFunctionBlock} from "../UnaryFunctionBlock";
import {BinaryFunctionBlock} from "../BinaryFunctionBlock";
import {NegationBlock} from "../NegationBlock";
import {LogicBlock} from "../LogicBlock";
import {MathBlock} from "../MathBlock";
import {Slider} from "../Slider";

export class BlockElementsPanel {

  getUi(): string {
    return `<h2 style="text-align: left; font-size: 18px; vertical-align: top; margin-top: 0; margin-bottom: 10px">
                <span style="font-size: 1.2em; color: teal; vertical-align: middle;"><i class="fas fa-cubes"></i></span> Elements</h2>
            <div id="elements-scroller" style="overflow-y: auto; height: 380px; margin-top: 0; border-bottom: 2px solid lightgray; border-top: 2px solid lightgray">
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Operators</h3>
              <div style="margin-right: 10px; background-color: lightgreen; border: 1px solid #b81900; border-radius: 4px">
                <table width="100%">
                  <tr>
                  <td><canvas draggable="true" id="logic-and-block" width="60px" height="80px" style="left: 10px; cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="logic-not-block" width="60px" height="80px" style="cursor: pointer;"/></td>
                  </tr>
                 <tr>
                  <td><canvas draggable="true" id="math-add-block" width="60px" height="60px" style="cursor: pointer;"/></td>
                  <td></td>
                 </tr>
                </table>
              </div>
              <div class="vertical-divider"></div>
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Functions</h3>
              <div style="margin-right: 10px; background-color: lightgoldenrodyellow; border: 1px solid #b81900; border-radius: 4px">
                <table width="100%">
                  <tr>
                  <td><canvas draggable="true" id="unary-function-block" width="60px" height="80px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="binary-function-block" width="60px" height="90px" style="cursor: pointer;"/></td>
                  </tr>
                </table>
              </div>
              <div class="vertical-divider"></div>
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> I/O</h3>
              <div style="margin-right: 10px; background-color: lightcyan; border: 1px solid #b81900; border-radius: 4px">
                <table width="100%">
                  <tr>
                  <td><canvas draggable="true" id="slider-block" width="100px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="display-block" width="60px" height="90px" style="cursor: pointer;"/></td>
                  </tr>
                </table>
              </div>
            </div>`;
  }

  render(selectorId: string): void {
    let element = document.getElementById(selectorId);
    element.innerHTML = this.getUi();
    this.drawFunctionBlock("F(X)", "unary-function-block");
    this.drawFunctionBlock("F(X, Y)", "binary-function-block");
    this.drawLogicBlock("AND Block", "AND", "logic-and-block");
    this.drawNegationBlock("logic-not-block");
    this.drawMathBlock("Add Block", "+", "math-add-block");
    this.drawSlider("Slider", "slider-block");
  }

  private drawSlider(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new Slider(name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.small = true;
    block.margin = 12;
    block.draw(ctx);
  }

  private drawMathBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new MathBlock(8, 8, canvas.width - 16, canvas.height - 16, name, symbol);
    block.name = name;
    block.small = true;
    block.margin = 12;
    block.draw(ctx);
  }

  private drawLogicBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new LogicBlock(8, 8, canvas.width - 16, canvas.height - 16, name, symbol);
    block.name = name;
    block.small = true;
    block.margin = 12;
    block.draw(ctx);
  }

  private drawNegationBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new NegationBlock(8, 8, canvas.width - 16, canvas.height - 16);
    block.small = true;
    block.margin = 12;
    block.draw(ctx);
  }

  private drawFunctionBlock(type: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = null;
    if (type == "F(X)") {
      block = new UnaryFunctionBlock(8, 8, canvas.width - 16, canvas.height - 16);
    } else if (type == "F(X, Y)") {
      block = new BinaryFunctionBlock(8, 8, canvas.width - 16, canvas.height - 16);
    }
    if (block != null) {
      block.small = true;
      block.margin = 12;
      block.draw(ctx);
    }
  }

}
