/*
 * @author Charles Xie
 */

import {UnaryFunctionBlock} from "../UnaryFunctionBlock";
import {BinaryFunctionBlock} from "../BinaryFunctionBlock";
import {NegationBlock} from "../NegationBlock";
import {LogicBlock} from "../LogicBlock";
import {MathBlock} from "../MathBlock";
import {Slider} from "../Slider";
import {FunctionBlock} from "../FunctionBlock";
import {Sticker} from "../Sticker";
import {ToggleSwitch} from "../ToggleSwitch";
import {ConditionalStatementBlock} from "../ConditionalStatementBlock";
import {SeriesBlock} from "../SeriesBlock";

export class BlockElementsPanel {

  getUi(): string {
    return `<h2 style="text-align: left; font-size: 18px; vertical-align: top; margin-top: 0; margin-bottom: 10px">
                <span style="font-size: 1.2em; color: teal; vertical-align: middle;"><i class="fas fa-cubes"></i></span> Elements</h2>
            <div id="elements-scroller" class="vertical-scroll" style="height: 380px; margin-top: 0; border-bottom: 2px solid lightgray; border-top: 2px solid lightgray">
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Operators</h3>
              <div class="horizontal-scroll" style="margin-right: 10px; background-color: lightgoldenrodyellow; border: 1px solid #b81900; border-radius: 4px">
                <table style="width: 100%">
                  <tr>
                  <td><canvas draggable="true" id="math-add-block" width="45px" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="logic-and-block" width="45px" height="60px" style="left: 10px; cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="logic-not-block" width="45px" height="60px" style="cursor: pointer;"/></td>
                  </tr>
                </table>
              </div>
              <div class="vertical-divider"></div>
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Functions</h3>
              <div class="horizontal-scroll" style="margin-right: 10px; background-color: lightgoldenrodyellow; border: 1px solid #b81900; border-radius: 4px">
                <table style="width: 100%">
                  <tr>
                  <td><canvas draggable="true" id="unary-function-block" width="45px" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="binary-function-block" width="45px" height="70px" style="cursor: pointer;"/></td>
                  </tr>
                </table>
              </div>
              <div class="vertical-divider"></div>
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> I/O</h3>
              <div class="horizontal-scroll" style="margin-right: 10px; background-color: lightcyan; border: 1px solid #b81900; border-radius: 4px">
                <table style="width: 100%">
                  <tr>
                  <td><canvas draggable="true" id="slider-block" width="60x" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="toggle-switch-block" width="45px" height="45px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="sticker-block" width="45px" height="45px" style="cursor: pointer;"/></td>
                  </tr>
                </table>
              </div>
              <div class="vertical-divider"></div>
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Flow Controllers</h3>
              <div class="horizontal-scroll" style="margin-right: 10px; background-color: lightskyblue; border: 1px solid #b81900; border-radius: 4px">
                <table style="width: 100%">
                  <tr>
                  <td><canvas draggable="true" id="conditional-statement-block" width="45x" height="60px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="series-block" width="45x" height="60px" style="cursor: pointer;"/></td>
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
    this.drawLogicBlock("AND Block", "AND", "logic-and-block");
    this.drawNegationBlock("logic-not-block");
    this.drawMathBlock("Add Block", "+", "math-add-block");
    this.drawToggleSwitch("Switch", "toggle-switch-block");
    this.drawSlider("Slider", "slider-block");
    this.drawSticker("Sticker", "sticker-block");
    this.drawConditionalStatementBlock("Conditional Statement Block", "IF", "conditional-statement-block");
    this.drawSeriesBlock("Series Block", "Series", "series-block");
  }

  private drawSeriesBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new SeriesBlock("Series Block Icon", 8, 8, canvas.width - 16, canvas.height - 16, name, symbol);
    block.setSmall(true);
    block.draw(ctx);
  }

  private drawConditionalStatementBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new ConditionalStatementBlock("Conditional Statement Block Icon", 8, 8, canvas.width - 16, canvas.height - 16, name, symbol);
    block.setSmall(true);
    block.draw(ctx);
  }

  private drawSticker(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new Sticker("Sticker Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setSmall(true);
    block.draw(ctx);
  }

  private drawToggleSwitch(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new ToggleSwitch("Toggle Switch Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setSmall(true);
    block.draw(ctx);
  }

  private drawSlider(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new Slider("Slider Icon", name, 8, 8, canvas.width - 16, canvas.height - 16);
    block.setSmall(true);
    block.draw(ctx);
  }

  private drawMathBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new MathBlock("Math Block Icon", 8, 8, canvas.width - 16, canvas.height - 16, name, symbol);
    block.setName(name);
    block.setSmall(true);
    block.draw(ctx);
  }

  private drawLogicBlock(name: string, symbol: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new LogicBlock("Logic Block Icon", 8, 8, canvas.width - 16, canvas.height - 16, name, symbol);
    block.setName(name);
    block.setSmall(true);
    block.draw(ctx);
  }

  private drawNegationBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new NegationBlock("Negation Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    block.setSmall(true);
    block.draw(ctx);
  }

  private drawUnaryFunctionBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block: FunctionBlock = new UnaryFunctionBlock("Unary Function Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    if (block != null) {
      block.setSmall(true);
      block.draw(ctx);
    }
  }

  private drawBinaryFunctionBlock(canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block: FunctionBlock = new BinaryFunctionBlock("Binary Function Block Icon", 8, 8, canvas.width - 16, canvas.height - 16);
    if (block != null) {
      block.setSmall(true);
      block.draw(ctx);
    }
  }

}
