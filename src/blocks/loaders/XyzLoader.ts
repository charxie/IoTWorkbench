/*
 * @author Charles Xie
 */

import {MolecularLoader} from "./MolecularLoader";
import {isNumber} from "../../Main";

export class XyzLoader extends MolecularLoader {

  constructor() {
    super();
  }

  parse(content: string): void {
    let x, y, z, e;
    let lines = content.split('\n');
    let index = 0;
    let nAtoms = 0;
    for (let i = 0; i < lines.length; i++) {
      let items = lines[i].split(/(\s+)/).filter(e => e.trim().length > 0);
      if (items.length === 1) {
        if (isNumber(items[0])) {
          nAtoms = parseInt(items[0]);
        }
      }
      if (items.length >= 3) {
        if (items[0].toUpperCase() === "CONNECT") {
          this.bonds.push([parseFloat(items[1]), parseFloat(items[2]), 1]);
        } else {
          if (items.length >= 4) {
            x = parseFloat(items[1]);
            y = parseFloat(items[2]);
            z = parseFloat(items[3]);
            e = items[0].toLowerCase();
            let cpkHexColor = this.getAtomColor(e);
            if (cpkHexColor === undefined) {
              e = e.substr(0, 1);
              cpkHexColor = this.getAtomColor(e);
            }
            this.atoms[index++] = [x, y, z, cpkHexColor === undefined ? this.getAtomColor('c') : cpkHexColor, MolecularLoader.capitalize(e), this.getAtomRadius(e)];
            if (index === nAtoms) break;
          }
        }
      }
    }
    this.buildGeometry();
  }

}
