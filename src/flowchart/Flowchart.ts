/*
 * @author Charles Xie
 */

import {Flowspace} from "./Flowspace";

export class Flowchart {

  flowspace: Flowspace;

  constructor() {
    this.flowspace = new Flowspace("flowspace");
  }

  draw(): void {
    this.flowspace.draw();
  }

}
