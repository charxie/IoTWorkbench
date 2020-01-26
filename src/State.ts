import {PortConnector} from "./blocks/PortConnector";
import {BlockView} from "./blocks/BlockView";
import {flowchart, system} from "./Main";

/*
*  This defines the state of a cyber-physical system.
*  @author Charles Xie
*/

export class State {

  readonly blockStates = [];
  readonly connectorStates = [];
  readonly blockViewState;
  readonly globalVariables = {};
  readonly mcuStates = [];
  readonly hatStates = [];

  constructor() {
    system.saveMcuStatesTo(this.mcuStates);
    system.saveHatStatesTo(this.hatStates);
    this.globalVariables = JSON.parse(JSON.stringify(flowchart.globalVariables));
    flowchart.saveBlockStatesTo(this.blockStates);
    for (let c of flowchart.connectors) {
      if (c.getOutput() != null && c.getInput() != null) {
        this.connectorStates.push(new PortConnector.State(c));
      }
    }
    this.blockViewState = new BlockView.State(flowchart.blockView);
  }

}
