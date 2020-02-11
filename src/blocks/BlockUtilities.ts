/*
 * @author Charles Xie
 */

import {ArithmeticBlock} from "./ArithmeticBlock";
import {WorkerBlock} from "./WorkerBlock";
import {ActionBlock} from "./ActionBlock";
import {TurnoutSwitch} from "./TurnoutSwitch";
import {SwitchStatementBlock} from "./SwitchStatementBlock";
import {NegationBlock} from "./NegationBlock";
import {LogicBlock} from "./LogicBlock";
import {UnaryFunctionBlock} from "./UnaryFunctionBlock";
import {BinaryFunctionBlock} from "./BinaryFunctionBlock";
import {MultivariableFunctionBlock} from "./MultivariableFunctionBlock";
import {ParametricEquationBlock} from "./ParametricEquationBlock";
import {BundledFunctionsBlock} from "./BundledFunctionsBlock";
import {Slider} from "./Slider";
import {contextMenus} from "../Main";
import {ItemSelector} from "./ItemSelector";
import {ToggleSwitch} from "./ToggleSwitch";
import {MomentarySwitch} from "./MomentarySwitch";
import {Sticker} from "./Sticker";
import {Beeper} from "./Beeper";
import {Grapher} from "./Grapher";
import {Space2D} from "./Space2D";
import {GlobalVariableBlock} from "./GlobalVariableBlock";
import {GlobalObjectBlock} from "./GlobalObjectBlock";
import {SeriesBlock} from "./SeriesBlock";
import {RgbaColorBlock} from "./RgbaColorBlock";
import {ComplexNumberBlock} from "./ComplexNumberBlock";
import {RainbowHatBlock} from "./RainbowHatBlock";
import {BlockContextMenu} from "./ui/BlockContextMenu";
import {Block} from "./Block";

export class BlockUtilities {

  static getMenu(block: Block): BlockContextMenu {
    if (block instanceof ArithmeticBlock) {
      return contextMenus.arithmeticBlock;
    }
    if (block instanceof WorkerBlock) {
      return contextMenus.workerBlock;
    }
    if (block instanceof ActionBlock) {
      return contextMenus.actionBlock;
    }
    if (block instanceof TurnoutSwitch) {
      return contextMenus.turnoutSwitch;
    }
    if (block instanceof SwitchStatementBlock) {
      return contextMenus.switchStatementBlock;
    }
    if (block instanceof NegationBlock) {
      return contextMenus.notBlock;
    }
    if (block instanceof LogicBlock) {
      return contextMenus.logicBlock;
    }
    if (block instanceof UnaryFunctionBlock) {
      return contextMenus.unaryFunctionBlock;
    }
    if (block instanceof BinaryFunctionBlock) {
      return contextMenus.binaryFunctionBlock;
    }
    if (block instanceof MultivariableFunctionBlock) {
      return contextMenus.multivariableFunctionBlock;
    }
    if (block instanceof ParametricEquationBlock) {
      return contextMenus.parametricEquationBlock;
    }
    if (block instanceof BundledFunctionsBlock) {
      return contextMenus.bundledFunctionsBlock;
    }
    if (block instanceof Slider) {
      return contextMenus.slider;
    }
    if (block instanceof ItemSelector) {
      return contextMenus.itemSelector;
    }
    if (block instanceof ToggleSwitch) {
      return contextMenus.toggleSwitch;
    }
    if (block instanceof MomentarySwitch) {
      return contextMenus.momentarySwitch;
    }
    if (block instanceof Sticker) {
      return contextMenus.sticker;
    }
    if (block instanceof Beeper) {
      return contextMenus.beeper;
    }
    if (block instanceof Grapher) {
      return contextMenus.grapher;
    }
    if (block instanceof Space2D) {
      return contextMenus.space2d;
    }
    if (block instanceof GlobalVariableBlock) {
      return contextMenus.globalVariableBlock;
    }
    if (block instanceof GlobalObjectBlock) {
      return contextMenus.globalObjectBlock;
    }
    if (block instanceof SeriesBlock) {
      return contextMenus.seriesBlock;
    }
    if (block instanceof RgbaColorBlock) {
      return contextMenus.rgbaColorBlock;
    }
    if (block instanceof ComplexNumberBlock) {
      return contextMenus.complexNumberBlock;
    }
    if (block instanceof RainbowHatBlock) {
      return contextMenus.rainbowHatBlock;
    }
    return null;
  }

  static getHtmlMenuElement(block: Block): HTMLMenuElement {
    if (block instanceof ArithmeticBlock) {
      contextMenus.arithmeticBlock.block = block;
      return document.getElementById("arithmetic-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof WorkerBlock) {
      contextMenus.workerBlock.block = block;
      return document.getElementById("worker-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof ActionBlock) {
      contextMenus.actionBlock.block = block;
      return document.getElementById("action-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof TurnoutSwitch) {
      contextMenus.turnoutSwitch.block = block;
      return document.getElementById("turnout-switch-context-menu") as HTMLMenuElement;
    }
    if (block instanceof SwitchStatementBlock) {
      contextMenus.switchStatementBlock.block = block;
      return document.getElementById("switch-statement-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof NegationBlock) {
      contextMenus.notBlock.block = block;
      return document.getElementById("not-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof LogicBlock) {
      contextMenus.logicBlock.block = block;
      return document.getElementById("logic-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof UnaryFunctionBlock) {
      contextMenus.unaryFunctionBlock.block = block;
      return document.getElementById("unary-function-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof BinaryFunctionBlock) {
      contextMenus.binaryFunctionBlock.block = block;
      return document.getElementById("binary-function-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof MultivariableFunctionBlock) {
      contextMenus.multivariableFunctionBlock.block = block;
      return document.getElementById("multivariable-function-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof ParametricEquationBlock) {
      contextMenus.parametricEquationBlock.block = block;
      return document.getElementById("parametric-equation-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof BundledFunctionsBlock) {
      contextMenus.bundledFunctionsBlock.block = block;
      return document.getElementById("bundled-functions-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof Slider) {
      contextMenus.slider.block = block;
      return document.getElementById("slider-context-menu") as HTMLMenuElement;
    }
    if (block instanceof ItemSelector) {
      contextMenus.itemSelector.block = block;
      return document.getElementById("item-selector-context-menu") as HTMLMenuElement;
    }
    if (block instanceof ToggleSwitch) {
      contextMenus.toggleSwitch.block = block;
      return document.getElementById("toggle-switch-context-menu") as HTMLMenuElement;
    }
    if (block instanceof MomentarySwitch) {
      contextMenus.momentarySwitch.block = block;
      return document.getElementById("momentary-switch-context-menu") as HTMLMenuElement;
    }
    if (block instanceof Sticker) {
      contextMenus.sticker.block = block;
      return document.getElementById("sticker-context-menu") as HTMLMenuElement;
    }
    if (block instanceof Beeper) {
      contextMenus.beeper.block = block;
      return document.getElementById("beeper-context-menu") as HTMLMenuElement;
    }
    if (block instanceof Grapher) {
      contextMenus.grapher.block = block;
      return document.getElementById("grapher-context-menu") as HTMLMenuElement;
    }
    if (block instanceof Space2D) {
      contextMenus.space2d.block = block;
      return document.getElementById("space2d-context-menu") as HTMLMenuElement;
    }
    if (block instanceof GlobalVariableBlock) {
      contextMenus.globalVariableBlock.block = block;
      return document.getElementById("global-variable-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof GlobalObjectBlock) {
      contextMenus.globalObjectBlock.block = block;
      return document.getElementById("global-object-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof SeriesBlock) {
      contextMenus.seriesBlock.block = block;
      return document.getElementById("series-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof RgbaColorBlock) {
      contextMenus.rgbaColorBlock.block = block;
      return document.getElementById("rgba-color-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof ComplexNumberBlock) {
      contextMenus.complexNumberBlock.block = block;
      return document.getElementById("complex-number-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof RainbowHatBlock) {
      contextMenus.rainbowHatBlock.block = block;
      return document.getElementById("rainbow-hat-block-context-menu") as HTMLMenuElement;
    }
    return null;
  }

}
