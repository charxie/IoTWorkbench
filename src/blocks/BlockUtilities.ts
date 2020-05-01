/*
 * @author Charles Xie
 */

import {contextMenus} from "../Main";
import {Block} from "./Block";
import {ArithmeticBlock} from "./ArithmeticBlock";
import {WorkerBlock} from "./WorkerBlock";
import {ActionBlock} from "./ActionBlock";
import {TurnoutSwitch} from "./TurnoutSwitch";
import {SwitchStatementBlock} from "./SwitchStatementBlock";
import {NegationBlock} from "./NegationBlock";
import {LogicBlock} from "./LogicBlock";
import {UnivariateFunctionBlock} from "./UnivariateFunctionBlock";
import {BivariateFunctionBlock} from "./BivariateFunctionBlock";
import {MultivariateFunctionBlock} from "./MultivariateFunctionBlock";
import {ParametricEquationBlock} from "./ParametricEquationBlock";
import {BundledFunctionsBlock} from "./BundledFunctionsBlock";
import {Slider} from "./Slider";
import {ItemSelector} from "./ItemSelector";
import {ToggleSwitch} from "./ToggleSwitch";
import {MomentarySwitch} from "./MomentarySwitch";
import {Sticker} from "./Sticker";
import {Beeper} from "./Beeper";
import {Grapher} from "./Grapher";
import {Space2D} from "./Space2D";
import {Space3D} from "./Space3D";
import {GlobalVariableBlock} from "./GlobalVariableBlock";
import {GlobalObjectBlock} from "./GlobalObjectBlock";
import {SeriesBlock} from "./SeriesBlock";
import {RgbaColorBlock} from "./RgbaColorBlock";
import {ComplexNumberBlock} from "./ComplexNumberBlock";
import {RainbowHatBlock} from "./RainbowHatBlock";
import {BlockContextMenu} from "./ui/BlockContextMenu";
import {BitwiseOperatorBlock} from "./BitwiseOperatorBlock";
import {FunctionDeclarationBlock} from "./FunctionDeclarationBlock";
import {VectorBlock} from "./VectorBlock";
import {NormalizationBlock} from "./NormalizationBlock";
import {MatrixBlock} from "./MatrixBlock";
import {DeterminantBlock} from "./DeterminantBlock";
import {MatrixInversionBlock} from "./MatrixInversionBlock";
import {MatrixTranspositionBlock} from "./MatrixTranspositionBlock";
import {IntegralBlock} from "./IntegralBlock";
import {FFTBlock} from "./FFTBlock";
import {ODESolverBlock} from "./ODESolverBlock";
import {TransientStateFDMSolverBlock} from "./TransientStateFDMSolverBlock";
import {RandomNumberGeneratorBlock} from "./RandomNumberGeneratorBlock";
import {Field2D} from "./Field2D";
import {Surface3D} from "./Surface3D";
import {SteadyStateFDMSolverBlock} from "./SteadyStateFDMSolverBlock";
import {BoundaryConditionBlock} from "./BoundaryConditionBlock";
import {ImageBlock} from "./ImageBlock";
import {AudioBlock} from "./AudioBlock";
import {DataBlock} from "./DataBlock";
import {MolecularViewerBlock} from "./MolecularViewerBlock";
import {ArrayInput} from "./ArrayInput";

export class BlockUtilities {

  static getMenu(block: Block): BlockContextMenu {
    if (block instanceof FunctionDeclarationBlock) {
      return contextMenus.functionDeclarationBlock;
    }
    if (block instanceof BitwiseOperatorBlock) {
      return contextMenus.bitwiseOperatorBlock;
    }
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
    if (block instanceof UnivariateFunctionBlock) {
      return contextMenus.univariateFunctionBlock;
    }
    if (block instanceof BivariateFunctionBlock) {
      return contextMenus.bivariateFunctionBlock;
    }
    if (block instanceof MultivariateFunctionBlock) {
      return contextMenus.multivariateFunctionBlock;
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
    if (block instanceof IntegralBlock) {
      return contextMenus.integralBlock;
    }
    if (block instanceof FFTBlock) {
      return contextMenus.fftBlock;
    }
    if (block instanceof ODESolverBlock) {
      return contextMenus.odeSolverBlock;
    }
    if (block instanceof TransientStateFDMSolverBlock) {
      return contextMenus.transientStateFDMSolverBlock;
    }
    if (block instanceof SteadyStateFDMSolverBlock) {
      return contextMenus.steadyStateFDMSolverBlock;
    }
    if (block instanceof BoundaryConditionBlock) {
      return contextMenus.boundaryConditionBlock;
    }
    if (block instanceof Space2D) {
      return contextMenus.space2d;
    }
    if (block instanceof Space3D) {
      return contextMenus.space3d;
    }
    if (block instanceof Field2D) {
      return contextMenus.field2d;
    }
    if (block instanceof Surface3D) {
      return contextMenus.surface3d;
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
    if (block instanceof VectorBlock) {
      return contextMenus.vectorBlock;
    }
    if (block instanceof NormalizationBlock) {
      return contextMenus.normalizationBlock;
    }
    if (block instanceof MatrixBlock) {
      return contextMenus.matrixBlock;
    }
    if (block instanceof DeterminantBlock) {
      return contextMenus.determinantBlock;
    }
    if (block instanceof MatrixTranspositionBlock) {
      return contextMenus.matrixTranspositionBlock;
    }
    if (block instanceof MatrixInversionBlock) {
      return contextMenus.matrixInversionBlock;
    }
    if (block instanceof RandomNumberGeneratorBlock) {
      return contextMenus.randomNumberGeneratorBlock;
    }
    if (block instanceof ImageBlock) {
      return contextMenus.imageBlock;
    }
    if (block instanceof AudioBlock) {
      return contextMenus.audioBlock;
    }
    if (block instanceof DataBlock) {
      return contextMenus.dataBlock;
    }
    if (block instanceof MolecularViewerBlock) {
      return contextMenus.molecularViewerBlock;
    }
    if (block instanceof ArrayInput) {
      return contextMenus.arrayInput;
    }
    if (block instanceof RainbowHatBlock) {
      return contextMenus.rainbowHatBlock;
    }
    return null;
  }

  static getHtmlMenuElement(block: Block): HTMLMenuElement {
    if (block instanceof FunctionDeclarationBlock) {
      contextMenus.functionDeclarationBlock.block = block;
      return document.getElementById("function-declaration-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof BitwiseOperatorBlock) {
      contextMenus.bitwiseOperatorBlock.block = block;
      return document.getElementById("bitwise-operator-block-context-menu") as HTMLMenuElement;
    }
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
    if (block instanceof UnivariateFunctionBlock) {
      contextMenus.univariateFunctionBlock.block = block;
      return document.getElementById("univariate-function-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof BivariateFunctionBlock) {
      contextMenus.bivariateFunctionBlock.block = block;
      return document.getElementById("bivariate-function-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof MultivariateFunctionBlock) {
      contextMenus.multivariateFunctionBlock.block = block;
      return document.getElementById("multivariate-function-block-context-menu") as HTMLMenuElement;
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
    if (block instanceof IntegralBlock) {
      contextMenus.integralBlock.block = block;
      return document.getElementById("integral-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof FFTBlock) {
      contextMenus.fftBlock.block = block;
      return document.getElementById("fft-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof ODESolverBlock) {
      contextMenus.odeSolverBlock.block = block;
      return document.getElementById("ode-solver-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof TransientStateFDMSolverBlock) {
      contextMenus.transientStateFDMSolverBlock.block = block;
      return document.getElementById("transient-state-fdm-solver-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof SteadyStateFDMSolverBlock) {
      contextMenus.steadyStateFDMSolverBlock.block = block;
      return document.getElementById("steady-state-fdm-solver-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof BoundaryConditionBlock) {
      contextMenus.boundaryConditionBlock.block = block;
      return document.getElementById("boundary-condition-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof Space2D) {
      contextMenus.space2d.block = block;
      return document.getElementById("space2d-context-menu") as HTMLMenuElement;
    }
    if (block instanceof Space3D) {
      contextMenus.space3d.block = block;
      return document.getElementById("space3d-context-menu") as HTMLMenuElement;
    }
    if (block instanceof Field2D) {
      contextMenus.field2d.block = block;
      return document.getElementById("field2d-context-menu") as HTMLMenuElement;
    }
    if (block instanceof Surface3D) {
      contextMenus.surface3d.block = block;
      return document.getElementById("surface3d-context-menu") as HTMLMenuElement;
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
    if (block instanceof VectorBlock) {
      contextMenus.vectorBlock.block = block;
      return document.getElementById("vector-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof NormalizationBlock) {
      contextMenus.normalizationBlock.block = block;
      return document.getElementById("normalization-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof MatrixBlock) {
      contextMenus.matrixBlock.block = block;
      return document.getElementById("matrix-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof DeterminantBlock) {
      contextMenus.determinantBlock.block = block;
      return document.getElementById("matrix-determinant-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof MatrixInversionBlock) {
      contextMenus.matrixInversionBlock.block = block;
      return document.getElementById("matrix-inversion-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof MatrixTranspositionBlock) {
      contextMenus.matrixTranspositionBlock.block = block;
      return document.getElementById("matrix-transposition-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof RandomNumberGeneratorBlock) {
      contextMenus.randomNumberGeneratorBlock.block = block;
      return document.getElementById("random-number-generator-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof RainbowHatBlock) {
      contextMenus.rainbowHatBlock.block = block;
      return document.getElementById("rainbow-hat-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof ImageBlock) {
      contextMenus.imageBlock.block = block;
      return document.getElementById("image-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof AudioBlock) {
      contextMenus.audioBlock.block = block;
      return document.getElementById("audio-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof DataBlock) {
      contextMenus.dataBlock.block = block;
      return document.getElementById("data-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof MolecularViewerBlock) {
      contextMenus.molecularViewerBlock.block = block;
      return document.getElementById("molecular-viewer-block-context-menu") as HTMLMenuElement;
    }
    if (block instanceof ArrayInput) {
      contextMenus.arrayInput.block = block;
      return document.getElementById("array-input-context-menu") as HTMLMenuElement;
    }
    return null;
  }

}
