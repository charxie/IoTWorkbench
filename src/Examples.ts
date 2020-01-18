/*
 * @author Charles Xie
 */

// @ts-ignore
import logical_operators from "./examples/logical-operators.json";
// @ts-ignore
import arithmetic_operators from "./examples/arithmetic-operators.json";
// @ts-ignore
import global_variables from "./examples/global-variables.json";
// @ts-ignore
import series_and_arrays from "./examples/series-and-arrays.json";
// @ts-ignore
import unary_functions from "./examples/unary-functions.json";
// @ts-ignore
import interesting_unary_functions from "./examples/interesting-unary-functions.json";
// @ts-ignore
import binary_functions from "./examples/binary-functions.json";
// @ts-ignore
import multivariable_functions from "./examples/multivariable-functions.json";
// @ts-ignore
import toggle_vs_momentary_switch from "./examples/toggle-vs-momentary-switch.json";
// @ts-ignore
import turnout_switch from "./examples/turnout-switch.json";
// @ts-ignore
import switch_statements from "./examples/switch-statements.json";
// @ts-ignore
import workers from "./examples/workers.json";
// @ts-ignore
import make_sound_with_beepers from "./examples/make-sound-with-beepers.json";
// @ts-ignore
import parametric_equations_1 from "./examples/parametric-equations-1.json";
// @ts-ignore
import parametric_equations_2 from "./examples/parametric-equations-2.json";
// @ts-ignore
import parametric_generator_1 from "./examples/parametric-generator-1.json";
// @ts-ignore
import parametric_generator_2 from "./examples/parametric-generator-2.json";

import {flowchart} from "./Main";
import {StateIO} from "./StateIO";

export class Examples {

  readonly files = [];

  constructor() {

    this.files.push({name: "Logical Operators", data: logical_operators});
    this.files.push({name: "Arithmetic Operators", data: arithmetic_operators});
    this.files.push({name: "Global Variables", data: global_variables});
    this.files.push({name: "Series and Arrays", data: series_and_arrays});
    this.files.push({name: "Unary Functions", data: unary_functions});
    this.files.push({name: "Interesting Unary Functions", data: interesting_unary_functions});
    this.files.push({name: "Binary Functions", data: binary_functions});
    this.files.push({name: "Multivariable Functions", data: multivariable_functions});
    this.files.push({name: "Toggle Switch vs. Momentary Switch", data: toggle_vs_momentary_switch});
    this.files.push({name: "Turnout Switch", data: turnout_switch});
    this.files.push({name: "Switch Statements", data: switch_statements});
    this.files.push({name: "Workers", data: workers});
    this.files.push({name: "Parametric Equations 1", data: parametric_equations_1});
    this.files.push({name: "Parametric Equations 2", data: parametric_equations_2});
    this.files.push({name: "Parametric Generator 1", data: parametric_generator_1});
    this.files.push({name: "Parametric Generator 2", data: parametric_generator_2});
    this.files.push({name: "Make Sound with Beepers", data: make_sound_with_beepers});

    let selectElement = document.getElementById("example-list") as HTMLSelectElement;

    let option = document.createElement('option') as HTMLOptionElement;
    option.value = "select";
    option.innerHTML = "Select";
    selectElement.appendChild(option);

    for (let a of this.files) {
      option = document.createElement('option') as HTMLOptionElement;
      option.value = a.name;
      option.innerHTML = a.name;
      selectElement.appendChild(option);
    }

    let that = this;
    selectElement.onchange = function () {
      if (selectElement.selectedIndex > 0) {
        that.load(that.files[selectElement.selectedIndex - 1].data);
      }
    };
  }

  load(s): void {
    flowchart.destroy();
    StateIO.restoreGlobalVariables(JSON.stringify(s.globalVariables));
    StateIO.restoreBlockView(JSON.stringify(s.blockViewState));
    StateIO.restoreBlocks(JSON.stringify(s.blockStates));
    StateIO.restoreConnectors(JSON.stringify(s.connectorStates));
    flowchart.updateResults();
    flowchart.updateLocalStorage();
  }

}
