/*
 * @author Charles Xie
 */

// @ts-ignore
import example01 from "./examples/logic-example1.json";
// @ts-ignore
import example02 from "./examples/math-example3.json";
// @ts-ignore
import example03 from "./examples/series-example1.json";
// @ts-ignore
import example04 from "./examples/graph-example1.json";
// @ts-ignore
import example05 from "./examples/graph-example2.json";
// @ts-ignore
import example08 from "./examples/control-example1.json";
// @ts-ignore
import example09 from "./examples/parametric-equation-example1.json";

import {flowchart} from "./Main";
import {StateIO} from "./StateIO";

export class Examples {

  readonly files = [];

  constructor() {

    this.files.push({name: "Logic #1", data: example01});
    this.files.push({name: "Arithmetic #1", data: example02});
    this.files.push({name: "Series #1", data: example03});
    this.files.push({name: "Graph #1", data: example04});
    this.files.push({name: "Graph #2", data: example05});
    this.files.push({name: "Control #1", data: example08});
    this.files.push({name: "Parametric Equation #1", data: example09});

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
    StateIO.restoreGlobalVariables(JSON.stringify(s.globalVariables));
    StateIO.restoreBlockView(JSON.stringify(s.blockViewState));
    StateIO.restoreBlocks(JSON.stringify(s.blockStates));
    StateIO.restoreConnectors(JSON.stringify(s.connectorStates));
    flowchart.updateResults();
    flowchart.updateLocalStorage();
  }

}
