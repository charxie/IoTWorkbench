/*
 * @author Charles Xie
 */

import {Material, Mesh} from "three";

export class Symbol3DArray {

  private symbols: Mesh[] = [];

  constructor() {
  }

  addSymbol(mesh: Mesh): void {
    this.symbols.push(mesh);
  }

  getSymbol(i: number): Mesh {
    return this.symbols[i];
  }

  clear(): void {
    for (let mesh of this.symbols) {
      mesh.geometry.dispose();
      (<Material>mesh.material).dispose();
    }
    this.symbols.length = 0;
  }

  length(): number {
    return this.symbols.length;
  }

}
