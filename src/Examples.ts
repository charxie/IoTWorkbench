/*
 * @author Charles Xie
 */

// @ts-ignore
import example01 from "./examples/logic-example1.json";
// @ts-ignore
import example02 from "./examples/arithmetic-example.json";
// @ts-ignore
import example03 from "./examples/array-example1.json";
// @ts-ignore
import example04 from "./examples/function-example1.json";
// @ts-ignore
import example05 from "./examples/function-example2.json";
// @ts-ignore
import example06 from "./examples/function-example3.json";
// @ts-ignore
import example11 from "./examples/control-example1.json";
// @ts-ignore
import example12 from "./examples/toggle-vs-momentary-switch.json";
// @ts-ignore
import example21 from "./examples/sound-example1.json";
// @ts-ignore
import example31 from "./examples/parametric-equation-example1.json";
// @ts-ignore
import example32 from "./examples/parametric-equation-example2.json";
// @ts-ignore
import example41 from "./examples/parametric-equation-example7.json";
// @ts-ignore
import example42 from "./examples/parametric-equation-example8.json";

import {flowchart} from "./Main";
import {StateIO} from "./StateIO";

export class Examples {

  readonly files = [];

  constructor() {

    this.files.push({name: "Logic #1", data: example01});
    this.files.push({name: "Arithmetic #1", data: example02});
    this.files.push({name: "Arrays #1", data: example03});
    this.files.push({name: "Function #1", data: example04});
    this.files.push({name: "Function #2", data: example05});
    this.files.push({name: "Function #3", data: example06});
    this.files.push({name: "Control #1", data: example11});
    this.files.push({name: "Control #2", data: example12});
    this.files.push({name: "Sound #1", data: example21});
    this.files.push({name: "Parametric Equation #1", data: example31});
    this.files.push({name: "Parametric Equation #2", data: example32});
    this.files.push({name: "Parametric Generator #1", data: example41});
    this.files.push({name: "Parametric Generator #2", data: example42});

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
