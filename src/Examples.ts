/*
 * @author Charles Xie
 */

// @ts-ignore
import example01 from "./examples/logic-example1.json";
// @ts-ignore
import example02 from "./examples/math-example3.json";
// @ts-ignore
import example03 from "./examples/series-example2.json";

import {flowchart} from "./Main";
import {StateIO} from "./StateIO";

export class Examples {

  readonly files = [];

  constructor() {

    this.files.push({name: "Logic Example 1", data: example01});
    this.files.push({name: "Math Example 1", data: example02});
    this.files.push({name: "Series Example 1", data: example03});

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
    StateIO.restoreBlockView(JSON.stringify(s.blockViewState));
    StateIO.restoreBlocks(JSON.stringify(s.blockStates));
    StateIO.restoreConnectors(JSON.stringify(s.connectorStates));
    flowchart.updateResults();
    flowchart.storeViewState();
    flowchart.storeBlockStates();
    flowchart.storeConnectorStates();
  }

}
