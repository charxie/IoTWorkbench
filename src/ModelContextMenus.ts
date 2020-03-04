/*
 * @author Charles Xie
 */

import {addPlaceholder} from "./BlockContextMenus";
import {WorkbenchContextMenu} from "./components/ui/WorkbenchContextMenu";
import {RaspberryPiContextMenu} from "./components/ui/RaspberryPiContextMenu";
import {RainbowHatContextMenu} from "./components/ui/RainbowHatContextMenu";
import {SenseHatContextMenu} from "./components/ui/SenseHatContextMenu";
import {UnicornHatContextMenu} from "./components/ui/UnicornHatContextMenu";
import {CrickitHatContextMenu} from "./components/ui/CrickitHatContextMenu";
import {PanTiltHatContextMenu} from "./components/ui/PanTiltHatContextMenu";
import {CapacitiveTouchHatContextMenu} from "./components/ui/CapacitiveTouchHatContextMenu";
import {contextMenus} from "./Main";

export function createContextMenusForModels() {

  let modelPlayground = document.getElementById("model-playground") as HTMLElement;
  addPlaceholder("workbench-context-menu-placeholder", modelPlayground);
  addPlaceholder("raspberry-pi-context-menu-placeholder", modelPlayground);
  addPlaceholder("rainbow-hat-context-menu-placeholder", modelPlayground);
  addPlaceholder("sense-hat-context-menu-placeholder", modelPlayground);
  addPlaceholder("unicorn-hat-context-menu-placeholder", modelPlayground);
  addPlaceholder("crickit-hat-context-menu-placeholder", modelPlayground);
  addPlaceholder("pan-tilt-hat-context-menu-placeholder", modelPlayground);
  addPlaceholder("capacitive-touch-hat-context-menu-placeholder", modelPlayground);
  addPlaceholder("linechart-context-menu-placeholder", modelPlayground);
  addPlaceholder("colorpicker-context-menu-placeholder", modelPlayground);

  setupContextMenuForModels();

}

function setupContextMenuForModels() {

  let workbenchContextMenu = new WorkbenchContextMenu();
  workbenchContextMenu.render("workbench-context-menu-placeholder");
  workbenchContextMenu.addListeners();
  contextMenus.workbench = workbenchContextMenu;

  let raspberryPiContextMenu = new RaspberryPiContextMenu();
  raspberryPiContextMenu.render("raspberry-pi-context-menu-placeholder");
  raspberryPiContextMenu.addListeners();
  contextMenus.raspberryPi = raspberryPiContextMenu;

  let rainbowHatContextMenu = new RainbowHatContextMenu();
  rainbowHatContextMenu.render("rainbow-hat-context-menu-placeholder");
  rainbowHatContextMenu.addListeners();
  contextMenus.rainbowHat = rainbowHatContextMenu;

  let senseHatContextMenu = new SenseHatContextMenu();
  senseHatContextMenu.render("sense-hat-context-menu-placeholder");
  senseHatContextMenu.addListeners();
  contextMenus.senseHat = senseHatContextMenu;

  let unicornHatContextMenu = new UnicornHatContextMenu();
  unicornHatContextMenu.render("unicorn-hat-context-menu-placeholder");
  unicornHatContextMenu.addListeners();
  contextMenus.unicornHat = unicornHatContextMenu;

  let crickitHatContextMenu = new CrickitHatContextMenu();
  crickitHatContextMenu.render("crickit-hat-context-menu-placeholder");
  crickitHatContextMenu.addListeners();
  contextMenus.crickitHat = crickitHatContextMenu;

  let panTiltHatContextMenu = new PanTiltHatContextMenu();
  panTiltHatContextMenu.render("pan-tilt-hat-context-menu-placeholder");
  panTiltHatContextMenu.addListeners();
  contextMenus.panTiltHat = panTiltHatContextMenu;

  let capacitiveTouchHatContextMenu = new CapacitiveTouchHatContextMenu();
  capacitiveTouchHatContextMenu.render("capacitive-touch-hat-context-menu-placeholder");
  capacitiveTouchHatContextMenu.addListeners();
  contextMenus.capacitiveTouchHat = capacitiveTouchHatContextMenu;

}
