/*
 * @author Charles Xie
 */

import {contextMenus} from "./Main";
import {BlockViewContextMenu} from "./blocks/ui/BlockViewContextMenu";
import {FunctionDeclarationBlockContextMenu} from "./blocks/ui/FunctionDeclarationBlockContextMenu";
import {BitwiseOperatorBlockContextMenu} from "./blocks/ui/BitwiseOperatorBlockContextMenu";
import {ArithmeticBlockContextMenu} from "./blocks/ui/ArithmeticBlockContextMenu";
import {GlobalVariableBlockContextMenu} from "./blocks/ui/GlobalVariableBlockContextMenu";
import {GlobalObjectBlockContextMenu} from "./blocks/ui/GlobalObjectBlockContextMenu";
import {SeriesBlockContextMenu} from "./blocks/ui/SeriesBlockContextMenu";
import {RgbaColorBlockContextMenu} from "./blocks/ui/RgbaColorBlockContextMenu";
import {ComplexNumberBlockContextMenu} from "./blocks/ui/ComplexNumberBlockContextMenu";
import {VectorBlockContextMenu} from "./blocks/ui/VectorBlockContextMenu";
import {NormalizationBlockContextMenu} from "./blocks/ui/NormalizationBlockContextMenu";
import {MatrixBlockContextMenu} from "./blocks/ui/MatrixBlockContextMenu";
import {DeterminantBlockContextMenu} from "./blocks/ui/DeterminantBlockContextMenu";
import {MatrixTranspositionBlockContextMenu} from "./blocks/ui/MatrixTranspositionBlockContextMenu";
import {MatrixInversionBlockContextMenu} from "./blocks/ui/MatrixInversionBlockContextMenu";
import {WorkerBlockContextMenu} from "./blocks/ui/WorkerBlockContextMenu";
import {ActionBlockContextMenu} from "./blocks/ui/ActionBlockContextMenu";
import {TurnoutSwitchContextMenu} from "./blocks/ui/TurnoutSwitchContextMenu";
import {SwitchStatementBlockContextMenu} from "./blocks/ui/SwitchStatementBlockContextMenu";
import {NotBlockContextMenu} from "./blocks/ui/NotBlockContextMenu";
import {LogicBlockContextMenu} from "./blocks/ui/LogicBlockContextMenu";
import {UnivariateFunctionBlockContextMenu} from "./blocks/ui/UnivariateFunctionBlockContextMenu";
import {BivariateFunctionBlockContextMenu} from "./blocks/ui/BivariateFunctionBlockContextMenu";
import {MultivariateFunctionBlockContextMenu} from "./blocks/ui/MultivariateFunctionBlockContextMenu";
import {ParametricEquationBlockContextMenu} from "./blocks/ui/ParametricEquationBlockContextMenu";
import {BundledFunctionsBlockContextMenu} from "./blocks/ui/BundledFunctionsBlockContextMenu";
import {ToggleSwitchContextMenu} from "./blocks/ui/ToggleSwitchContextMenu";
import {MomentarySwitchContextMenu} from "./blocks/ui/MomentarySwitchContextMenu";
import {SliderContextMenu} from "./blocks/ui/SliderContextMenu";
import {ItemSelectorContextMenu} from "./blocks/ui/ItemSelectorContextMenu";
import {StickerContextMenu} from "./blocks/ui/StickerContextMenu";
import {BeeperContextMenu} from "./blocks/ui/BeeperContextMenu";
import {GrapherContextMenu} from "./blocks/ui/GrapherContextMenu";
import {IntegralBlockContextMenu} from "./blocks/ui/IntegralBlockContextMenu";
import {FFTBlockContextMenu} from "./blocks/ui/FFTBlockContextMenu";
import {ODESolverBlockContextMenu} from "./blocks/ui/ODESolverBlockContextMenu";
import {TransientStateFDMSolverBlockContextMenu} from "./blocks/ui/TransientStateFDMSolverBlockContextMenu";
import {SteadyStateFDMSolverBlockContextMenu} from "./blocks/ui/SteadyStateFDMSolverBlockContextMenu";
import {BoundaryConditionBlockContextMenu} from "./blocks/ui/BoundaryConditionBlockContextMenu";
import {Space2DContextMenu} from "./blocks/ui/Space2DContextMenu";
import {Space3DContextMenu} from "./blocks/ui/Space3DContextMenu";
import {Field2DContextMenu} from "./blocks/ui/Field2DContextMenu";
import {Surface3DContextMenu} from "./blocks/ui/Surface3DContextMenu";
import {RandomNumberGeneratorBlockContextMenu} from "./blocks/ui/RandomNumberGeneratorBlockContextMenu";
import {RainbowHatBlockContextMenu} from "./blocks/ui/RainbowHatBlockContextMenu";
import {ImageBlockContextMenu} from "./blocks/ui/ImageBlockContextMenu";
import {AudioBlockContextMenu} from "./blocks/ui/AudioBlockContextMenu";
import {DataBlockContextMenu} from "./blocks/ui/DataBlockContextMenu";
import {MolecularViewerContextMenu} from "./blocks/ui/MolecularViewerContextMenu";
import {ArrayInputContextMenu} from "./blocks/ui/ArrayInputContextMenu";
import {MeanBlockContextMenu} from "./blocks/ui/MeanBlockContextMenu";

export function createContextMenusForBlocks() {

  let blockPlayground = document.getElementById("block-playground") as HTMLElement;
  addPlaceholder("block-view-context-menu-placeholder", blockPlayground);
  addPlaceholder("function-declaration-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("bitwise-operator-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("arithmetic-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("turnout-switch-context-menu-placeholder", blockPlayground);
  addPlaceholder("switch-statement-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("worker-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("action-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("global-variable-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("global-object-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("series-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("rgba-color-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("complex-number-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("vector-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("normalization-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("matrix-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("matrix-determinant-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("matrix-transposition-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("matrix-inversion-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("random-number-generator-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("not-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("logic-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("univariate-function-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("bivariate-function-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("multivariate-function-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("parametric-equation-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("bundled-functions-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("rainbow-hat-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("toggle-switch-context-menu-placeholder", blockPlayground);
  addPlaceholder("momentary-switch-context-menu-placeholder", blockPlayground);
  addPlaceholder("slider-context-menu-placeholder", blockPlayground);
  addPlaceholder("item-selector-context-menu-placeholder", blockPlayground);
  addPlaceholder("sticker-context-menu-placeholder", blockPlayground);
  addPlaceholder("beeper-context-menu-placeholder", blockPlayground);
  addPlaceholder("integral-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("fft-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("ode-solver-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("transient-state-fdm-solver-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("steady-state-fdm-solver-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("boundary-condition-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("grapher-context-menu-placeholder", blockPlayground);
  addPlaceholder("space2d-context-menu-placeholder", blockPlayground);
  addPlaceholder("space3d-context-menu-placeholder", blockPlayground);
  addPlaceholder("field2d-context-menu-placeholder", blockPlayground);
  addPlaceholder("surface3d-context-menu-placeholder", blockPlayground);
  addPlaceholder("image-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("audio-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("data-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("molecular-viewer-block-context-menu-placeholder", blockPlayground);
  addPlaceholder("array-input-context-menu-placeholder", blockPlayground);
  addPlaceholder("mean-block-context-menu-placeholder", blockPlayground);

  setupContextMenuForBlocks();

}

function setupContextMenuForBlocks() {

  let blockViewContextMenu = new BlockViewContextMenu();
  blockViewContextMenu.render("block-view-context-menu-placeholder");
  blockViewContextMenu.addListeners();
  contextMenus.blockView = blockViewContextMenu;

  let functionDeclarationBlockContextMenu = new FunctionDeclarationBlockContextMenu();
  functionDeclarationBlockContextMenu.render("function-declaration-block-context-menu-placeholder");
  functionDeclarationBlockContextMenu.addListeners();
  contextMenus.functionDeclarationBlock = functionDeclarationBlockContextMenu;

  let bitwiseOperatorBlockContextMenu = new BitwiseOperatorBlockContextMenu();
  bitwiseOperatorBlockContextMenu.render("bitwise-operator-block-context-menu-placeholder");
  bitwiseOperatorBlockContextMenu.addListeners();
  contextMenus.bitwiseOperatorBlock = bitwiseOperatorBlockContextMenu;

  let arithmeticBlockContextMenu = new ArithmeticBlockContextMenu();
  arithmeticBlockContextMenu.render("arithmetic-block-context-menu-placeholder");
  arithmeticBlockContextMenu.addListeners();
  contextMenus.arithmeticBlock = arithmeticBlockContextMenu;

  let globalVariableBlockContextMenu = new GlobalVariableBlockContextMenu();
  globalVariableBlockContextMenu.render("global-variable-block-context-menu-placeholder");
  globalVariableBlockContextMenu.addListeners();
  contextMenus.globalVariableBlock = globalVariableBlockContextMenu;

  let globalObjectBlockContextMenu = new GlobalObjectBlockContextMenu();
  globalObjectBlockContextMenu.render("global-object-block-context-menu-placeholder");
  globalObjectBlockContextMenu.addListeners();
  contextMenus.globalObjectBlock = globalObjectBlockContextMenu;

  let seriesBlockContextMenu = new SeriesBlockContextMenu();
  seriesBlockContextMenu.render("series-block-context-menu-placeholder");
  seriesBlockContextMenu.addListeners();
  contextMenus.seriesBlock = seriesBlockContextMenu;

  let rgbaColorBlockContextMenu = new RgbaColorBlockContextMenu();
  rgbaColorBlockContextMenu.render("rgba-color-block-context-menu-placeholder");
  rgbaColorBlockContextMenu.addListeners();
  contextMenus.rgbaColorBlock = rgbaColorBlockContextMenu;

  let complexNumberBlockContextMenu = new ComplexNumberBlockContextMenu();
  complexNumberBlockContextMenu.render("complex-number-block-context-menu-placeholder");
  complexNumberBlockContextMenu.addListeners();
  contextMenus.complexNumberBlock = complexNumberBlockContextMenu;

  let vectorBlockContextMenu = new VectorBlockContextMenu();
  vectorBlockContextMenu.render("vector-block-context-menu-placeholder");
  vectorBlockContextMenu.addListeners();
  contextMenus.vectorBlock = vectorBlockContextMenu;

  let normalizationBlockContextMenu = new NormalizationBlockContextMenu();
  normalizationBlockContextMenu.render("normalization-block-context-menu-placeholder");
  normalizationBlockContextMenu.addListeners();
  contextMenus.normalizationBlock = normalizationBlockContextMenu;

  let matrixBlockContextMenu = new MatrixBlockContextMenu();
  matrixBlockContextMenu.render("matrix-block-context-menu-placeholder");
  matrixBlockContextMenu.addListeners();
  contextMenus.matrixBlock = matrixBlockContextMenu;

  let determinantBlockContextMenu = new DeterminantBlockContextMenu();
  determinantBlockContextMenu.render("matrix-determinant-block-context-menu-placeholder");
  determinantBlockContextMenu.addListeners();
  contextMenus.determinantBlock = determinantBlockContextMenu;

  let matrixTranspositionBlockContextMenu = new MatrixTranspositionBlockContextMenu();
  matrixTranspositionBlockContextMenu.render("matrix-transposition-block-context-menu-placeholder");
  matrixTranspositionBlockContextMenu.addListeners();
  contextMenus.matrixTranspositionBlock = matrixTranspositionBlockContextMenu;

  let matrixInversionBlockContextMenu = new MatrixInversionBlockContextMenu();
  matrixInversionBlockContextMenu.render("matrix-inversion-block-context-menu-placeholder");
  matrixInversionBlockContextMenu.addListeners();
  contextMenus.matrixInversionBlock = matrixInversionBlockContextMenu;

  let workerBlockContextMenu = new WorkerBlockContextMenu();
  workerBlockContextMenu.render("worker-block-context-menu-placeholder");
  workerBlockContextMenu.addListeners();
  contextMenus.workerBlock = workerBlockContextMenu;

  let actionBlockContextMenu = new ActionBlockContextMenu();
  actionBlockContextMenu.render("action-block-context-menu-placeholder");
  actionBlockContextMenu.addListeners();
  contextMenus.actionBlock = actionBlockContextMenu;

  let turnoutSwitchContextMenu = new TurnoutSwitchContextMenu();
  turnoutSwitchContextMenu.render("turnout-switch-context-menu-placeholder");
  turnoutSwitchContextMenu.addListeners();
  contextMenus.turnoutSwitch = turnoutSwitchContextMenu;

  let switchStatementBlockContextMenu = new SwitchStatementBlockContextMenu();
  switchStatementBlockContextMenu.render("switch-statement-block-context-menu-placeholder");
  switchStatementBlockContextMenu.addListeners();
  contextMenus.switchStatementBlock = switchStatementBlockContextMenu;

  let notBlockContextMenu = new NotBlockContextMenu();
  notBlockContextMenu.render("not-block-context-menu-placeholder");
  notBlockContextMenu.addListeners();
  contextMenus.notBlock = notBlockContextMenu;

  let logicBlockContextMenu = new LogicBlockContextMenu();
  logicBlockContextMenu.render("logic-block-context-menu-placeholder");
  logicBlockContextMenu.addListeners();
  contextMenus.logicBlock = logicBlockContextMenu;

  let univariateFunctionBlockContextMenu = new UnivariateFunctionBlockContextMenu();
  univariateFunctionBlockContextMenu.render("univariate-function-block-context-menu-placeholder");
  univariateFunctionBlockContextMenu.addListeners();
  contextMenus.univariateFunctionBlock = univariateFunctionBlockContextMenu;

  let bivariateFunctionBlockContextMenu = new BivariateFunctionBlockContextMenu();
  bivariateFunctionBlockContextMenu.render("bivariate-function-block-context-menu-placeholder");
  bivariateFunctionBlockContextMenu.addListeners();
  contextMenus.bivariateFunctionBlock = bivariateFunctionBlockContextMenu;

  let multivariateFunctionBlockContextMenu = new MultivariateFunctionBlockContextMenu();
  multivariateFunctionBlockContextMenu.render("multivariate-function-block-context-menu-placeholder");
  multivariateFunctionBlockContextMenu.addListeners();
  contextMenus.multivariateFunctionBlock = multivariateFunctionBlockContextMenu;

  let parametricEquationBlockContextMenu = new ParametricEquationBlockContextMenu();
  parametricEquationBlockContextMenu.render("parametric-equation-block-context-menu-placeholder");
  parametricEquationBlockContextMenu.addListeners();
  contextMenus.parametricEquationBlock = parametricEquationBlockContextMenu;

  let bundledFunctionsBlockContextMenu = new BundledFunctionsBlockContextMenu();
  bundledFunctionsBlockContextMenu.render("bundled-functions-block-context-menu-placeholder");
  bundledFunctionsBlockContextMenu.addListeners();
  contextMenus.bundledFunctionsBlock = bundledFunctionsBlockContextMenu;

  let toggleSwitchContextMenu = new ToggleSwitchContextMenu();
  toggleSwitchContextMenu.render("toggle-switch-context-menu-placeholder");
  toggleSwitchContextMenu.addListeners();
  contextMenus.toggleSwitch = toggleSwitchContextMenu;

  let momentarySwitchContextMenu = new MomentarySwitchContextMenu();
  momentarySwitchContextMenu.render("momentary-switch-context-menu-placeholder");
  momentarySwitchContextMenu.addListeners();
  contextMenus.momentarySwitch = momentarySwitchContextMenu;

  let sliderContextMenu = new SliderContextMenu();
  sliderContextMenu.render("slider-context-menu-placeholder");
  sliderContextMenu.addListeners();
  contextMenus.slider = sliderContextMenu;

  let itemSelectorContextMenu = new ItemSelectorContextMenu();
  itemSelectorContextMenu.render("item-selector-context-menu-placeholder");
  itemSelectorContextMenu.addListeners();
  contextMenus.itemSelector = itemSelectorContextMenu;

  let stickerContextMenu = new StickerContextMenu();
  stickerContextMenu.render("sticker-context-menu-placeholder");
  stickerContextMenu.addListeners();
  contextMenus.sticker = stickerContextMenu;

  let beeperContextMenu = new BeeperContextMenu();
  beeperContextMenu.render("beeper-context-menu-placeholder");
  beeperContextMenu.addListeners();
  contextMenus.beeper = beeperContextMenu;

  let grapherContextMenu = new GrapherContextMenu();
  grapherContextMenu.render("grapher-context-menu-placeholder");
  grapherContextMenu.addListeners();
  contextMenus.grapher = grapherContextMenu;

  let integralBlockContextMenu = new IntegralBlockContextMenu();
  integralBlockContextMenu.render("integral-block-context-menu-placeholder");
  integralBlockContextMenu.addListeners();
  contextMenus.integralBlock = integralBlockContextMenu;

  let fftBlockContextMenu = new FFTBlockContextMenu();
  fftBlockContextMenu.render("fft-block-context-menu-placeholder");
  fftBlockContextMenu.addListeners();
  contextMenus.fftBlock = fftBlockContextMenu;

  let odeSolverBlockContextMenu = new ODESolverBlockContextMenu();
  odeSolverBlockContextMenu.render("ode-solver-block-context-menu-placeholder");
  odeSolverBlockContextMenu.addListeners();
  contextMenus.odeSolverBlock = odeSolverBlockContextMenu;

  let transientStateFDMSolverBlockContextMenu = new TransientStateFDMSolverBlockContextMenu();
  transientStateFDMSolverBlockContextMenu.render("transient-state-fdm-solver-block-context-menu-placeholder");
  transientStateFDMSolverBlockContextMenu.addListeners();
  contextMenus.transientStateFDMSolverBlock = transientStateFDMSolverBlockContextMenu;

  let steadyStateFDMSolverBlockContextMenu = new SteadyStateFDMSolverBlockContextMenu();
  steadyStateFDMSolverBlockContextMenu.render("steady-state-fdm-solver-block-context-menu-placeholder");
  steadyStateFDMSolverBlockContextMenu.addListeners();
  contextMenus.steadyStateFDMSolverBlock = steadyStateFDMSolverBlockContextMenu;

  let boundaryConditionBlockContextMenu = new BoundaryConditionBlockContextMenu();
  boundaryConditionBlockContextMenu.render("boundary-condition-block-context-menu-placeholder");
  boundaryConditionBlockContextMenu.addListeners();
  contextMenus.boundaryConditionBlock = boundaryConditionBlockContextMenu;

  let space2dContextMenu = new Space2DContextMenu();
  space2dContextMenu.render("space2d-context-menu-placeholder");
  space2dContextMenu.addListeners();
  contextMenus.space2d = space2dContextMenu;

  let space3dContextMenu = new Space3DContextMenu();
  space3dContextMenu.render("space3d-context-menu-placeholder");
  space3dContextMenu.addListeners();
  contextMenus.space3d = space3dContextMenu;

  let field2dContextMenu = new Field2DContextMenu();
  field2dContextMenu.render("field2d-context-menu-placeholder");
  field2dContextMenu.addListeners();
  contextMenus.field2d = field2dContextMenu;

  let surface3dContextMenu = new Surface3DContextMenu();
  surface3dContextMenu.render("surface3d-context-menu-placeholder");
  surface3dContextMenu.addListeners();
  contextMenus.surface3d = surface3dContextMenu;

  let randomNumberGeneratorBlockContextMenu = new RandomNumberGeneratorBlockContextMenu();
  randomNumberGeneratorBlockContextMenu.render("random-number-generator-block-context-menu-placeholder");
  randomNumberGeneratorBlockContextMenu.addListeners();
  contextMenus.randomNumberGeneratorBlock = randomNumberGeneratorBlockContextMenu;

  let rainbowHatBlockContextMenu = new RainbowHatBlockContextMenu();
  rainbowHatBlockContextMenu.render("rainbow-hat-block-context-menu-placeholder");
  rainbowHatBlockContextMenu.addListeners();
  contextMenus.rainbowHatBlock = rainbowHatBlockContextMenu;

  let imageBlockContextMenu = new ImageBlockContextMenu();
  imageBlockContextMenu.render("image-block-context-menu-placeholder");
  imageBlockContextMenu.addListeners();
  contextMenus.imageBlock = imageBlockContextMenu;

  let audioBlockContextMenu = new AudioBlockContextMenu();
  audioBlockContextMenu.render("audio-block-context-menu-placeholder");
  audioBlockContextMenu.addListeners();
  contextMenus.audioBlock = audioBlockContextMenu;

  let dataBlockContextMenu = new DataBlockContextMenu();
  dataBlockContextMenu.render("data-block-context-menu-placeholder");
  dataBlockContextMenu.addListeners();
  contextMenus.dataBlock = dataBlockContextMenu;

  let molecularViewerBlockContextMenu = new MolecularViewerContextMenu();
  molecularViewerBlockContextMenu.render("molecular-viewer-block-context-menu-placeholder");
  molecularViewerBlockContextMenu.addListeners();
  contextMenus.molecularViewerBlock = molecularViewerBlockContextMenu;

  let arrayInputContextMenu = new ArrayInputContextMenu();
  arrayInputContextMenu.render("array-input-context-menu-placeholder");
  arrayInputContextMenu.addListeners();
  contextMenus.arrayInput = arrayInputContextMenu;

  let meanBlockContextMenu = new MeanBlockContextMenu();
  meanBlockContextMenu.render("mean-block-context-menu-placeholder");
  meanBlockContextMenu.addListeners();
  contextMenus.meanBlock = meanBlockContextMenu;

}

export function addPlaceholder(id: string, parent: HTMLElement) {
  let placeholder = document.createElement('div');
  placeholder.id = id;
  parent.appendChild(placeholder);
}

