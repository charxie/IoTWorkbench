/*
 * @author Charles Xie
 */
import {Codespace} from "./Codespace";

export class Code {

  codespace: Codespace;

  constructor() {
    this.codespace = new Codespace("codespace");
  }

  draw(): void {
    this.codespace.draw();
  }

}