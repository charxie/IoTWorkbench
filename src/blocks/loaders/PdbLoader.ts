/*
 * Revised from three.js's PDBLoader, which can't load some PDB files and can't automatically construct bonds
 *
 * @author Charles Xie
 */

import {MolecularLoader} from "./MolecularLoader";

export class PdbLoader extends MolecularLoader {

  private bhash = {};

  static hash(s, e): string {
    return 's' + Math.min(s, e) + 'e' + Math.max(s, e);
  }

  constructor() {
    super();
  }

  parse(content: string): void {
    let x, y, z, index, e;
    let lines = content.split('\n');
    let count = 0;
    let hasConect = content.indexOf("CONECT") !== -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].substr(0, 4).toUpperCase() === 'ATOM' || lines[i].substr(0, 6).toUpperCase() === 'HETATM') {
        x = parseFloat(lines[i].substr(30, 7));
        y = parseFloat(lines[i].substr(38, 7));
        z = parseFloat(lines[i].substr(46, 7));
        index = parseInt(lines[i].substr(6, 5)) - 1;
        e = MolecularLoader.trim(lines[i].substr(76, 2)).toLowerCase();
        if (e === '') e = MolecularLoader.trim(lines[i].substr(12, 2)).toLowerCase();
        let cpkHexColor = this.getAtomColor(e);
        if (cpkHexColor === undefined) {
          e = e.substr(0, 1);
          cpkHexColor = this.getAtomColor(e);
        }
        this.atoms[hasConect ? index : count] = [x, y, z, cpkHexColor === undefined ? this.getAtomColor('c') : cpkHexColor, MolecularLoader.capitalize(e), this.getAtomRadius(e)];
        count++;
      } else if (lines[i].substr(0, 6).toUpperCase() === 'CONECT') {
        this.parseBond(lines[i], 11, 5);
        this.parseBond(lines[i], 16, 5);
        this.parseBond(lines[i], 21, 5);
        this.parseBond(lines[i], 26, 5);
      }
    }
    this.buildGeometry();
  }

  private parseBond(line: string, start: number, length: number): void {
    let eatom = parseInt(line.substr(start, length));
    if (eatom) {
      var satom = parseInt(line.substr(6, 5));
      let h = PdbLoader.hash(satom, eatom);
      if (this.bhash[h] === undefined) {
        this.bonds.push([satom - 1, eatom - 1, 1]);
        this.bhash[h] = this.bonds.length - 1;
      } else {
        // doesn't really work as almost all PDBs
        // have just normal bonds appearing multiple
        // times instead of being double/triple bonds
        // bonds[bhash[h]][2] += 1;
      }
    }
  }

}
