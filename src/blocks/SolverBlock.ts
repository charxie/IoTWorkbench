/*
 * @author Charles Xie
 */
import {Block} from "./Block";

export abstract class SolverBlock extends Block {

  protected method: string;

  destroy(): void {
  }

  setMethod(method: string): void {
    this.method = method;
  }

  getMethod(): string {
    return this.method;
  }

  abstract useDeclaredFunctions();

}
