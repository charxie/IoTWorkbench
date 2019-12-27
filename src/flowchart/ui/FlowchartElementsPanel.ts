/*
 * @author Charles Xie
 */

import {ConditionalBlock} from "../ConditionalBlock";
import {LogicBlock} from "../LogicBlock";
import {NegationBlock} from "../NegationBlock";
import {AddBlock} from "../AddBlock";
import {MultiplyBlock} from "../MultiplyBlock";

export class FlowchartElementsPanel {

  getUi(): string {
    return `<h2 style="text-align: left; font-size: 18px; vertical-align: top; margin-top: 0; margin-bottom: 10px">
                <span style="font-size: 1.2em; color: teal; vertical-align: middle;"><i class="fas fa-cubes"></i></span> Elements</h2>
            <div id="elements-scroller" style="overflow-y: auto; height: 380px; margin-top: 0; border-bottom: 2px solid lightgray; border-top: 2px solid lightgray">
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Functions</h3>
              <div class="row" style="margin-right: 10px; background-color: lightgoldenrodyellow; border: 1px solid #b81900; border-radius: 4px">
                <div class="column">
                  <canvas draggable="true" id="conditional-block" width="60px" height="70px" style="cursor: pointer;"/>
                </div>
              </div>
              <div class="vertical-divider"></div>
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Operators</h3>
              <div style="margin-right: 10px;  background-color: lightgreen; border: 1px solid #b81900; border-radius: 4px">
                <table width="100%">
                  <tr>
                  <td><canvas draggable="true" id="logic-and-block" width="60px" height="70px" style="left: 10px; cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="logic-or-block" width="60px" height="70px" style="left: 110px; cursor: pointer;"/></td>
                  </tr>
                  <tr>
                  <td><canvas draggable="true" id="logic-not-block" width="60px" height="70px" style="cursor: pointer;"/></td>
                  <td></td>
                  </tr>
                 <tr>
                  <td><canvas draggable="true" id="math-multiply-block" width="60px" height="70px" style="cursor: pointer;"/></td>
                  <td><canvas draggable="true" id="math-add-block" width="60px" height="70px" style="cursor: pointer;"/></td>
                  </tr>
                </table>
            </div>`;
  }

  render(selectorId: string): void {
    let element = document.getElementById(selectorId);
    element.innerHTML = this.getUi();
    this.drawConditionalBlock();
    this.drawLogicBlock("Or", "logic-or-block");
    this.drawLogicBlock("And", "logic-and-block");
    this.drawLogicBlock("Not", "logic-not-block");
    this.drawAdditionBlock("+", "math-add-block");
    this.drawMultiplicationBlock("×", "math-multiply-block");
  }

  private drawMultiplicationBlock(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new MultiplyBlock(8, 8, canvas.width - 16, canvas.height - 16, name);
    block.name = name;
    block.small = true;
    block.margin = 12;
    block.draw(ctx);
  }

  private drawAdditionBlock(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new AddBlock(8, 8, canvas.width - 16, canvas.height - 16, name);
    block.name = name;
    block.small = true;
    block.margin = 12;
    block.draw(ctx);
  }

  private drawLogicBlock(name: string, canvasId: string): void {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = (name == "Not") ? new NegationBlock(8, 8, canvas.width - 16, canvas.height - 16) :
      new LogicBlock(8, 8, canvas.width - 16, canvas.height - 16, name);
    block.name = name;
    block.small = true;
    block.margin = 12;
    block.draw(ctx);
  }

  private drawConditionalBlock(): void {
    let canvas = document.getElementById("conditional-block") as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    let block = new ConditionalBlock(8, 8, canvas.width - 16, canvas.height - 16);
    block.small = true;
    block.margin = 12;
    block.draw(ctx);
  }

}
