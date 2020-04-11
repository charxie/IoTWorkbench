/*
 * Revised from three.js's PDBLoader, which can't load many PDB files
 *
 * @author Charles Xie
 */

import {
  BufferGeometry,
  Float32BufferAttribute
} from "three";
import {CPK} from "./CPK";

export class PdbLoader {

  geometryAtoms: BufferGeometry = new BufferGeometry();
  geometryBonds: BufferGeometry = new BufferGeometry();
  atoms: any[] = [];
  bonds: any[] = [];

  private bhash = {};

  static trim(text: string): string {
    return text.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }

  static hash(s, e): string {
    return 's' + Math.min(s, e) + 'e' + Math.max(s, e);
  }

  static capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
  }

  constructor() {
  }

  private buildGeometry(): void {
    let i, l;
    let verticesAtoms = [];
    let colorsAtoms = [];
    let verticesBonds = [];

    // atoms
    for (i = 0, l = this.atoms.length; i < l; i++) {
      let atom = this.atoms[i];
      let x = atom[0];
      let y = atom[1];
      let z = atom[2];
      verticesAtoms.push(x, y, z);
      let r = atom[3][0] / 255;
      let g = atom[3][1] / 255;
      let b = atom[3][2] / 255;
      colorsAtoms.push(r, g, b);
    }

    // bonds
    for (i = 0, l = this.bonds.length; i < l; i++) {
      let bond = this.bonds[i];
      let start = bond[0];
      let end = bond[1];
      verticesBonds.push(verticesAtoms[start * 3 + 0]);
      verticesBonds.push(verticesAtoms[start * 3 + 1]);
      verticesBonds.push(verticesAtoms[start * 3 + 2]);
      verticesBonds.push(verticesAtoms[end * 3 + 0]);
      verticesBonds.push(verticesAtoms[end * 3 + 1]);
      verticesBonds.push(verticesAtoms[end * 3 + 2]);
    }

    // build geometry
    this.geometryAtoms.setAttribute('position', new Float32BufferAttribute(verticesAtoms, 3));
    this.geometryAtoms.setAttribute('color', new Float32BufferAttribute(colorsAtoms, 3));
    this.geometryBonds.setAttribute('position', new Float32BufferAttribute(verticesBonds, 3));
  }

  parse(content: string): void {
    let x, y, z, index, e;
    let lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].substr(0, 4) === 'ATOM' || lines[i].substr(0, 6) === 'HETATM') {
        x = parseFloat(lines[i].substr(30, 7));
        y = parseFloat(lines[i].substr(38, 7));
        z = parseFloat(lines[i].substr(46, 7));
        index = parseInt(lines[i].substr(6, 5)) - 1;
        e = PdbLoader.trim(lines[i].substr(76, 2)).toLowerCase();
        if (e === '') e = PdbLoader.trim(lines[i].substr(12, 2)).toLowerCase();
        this.atoms[index] = [x, y, z, CPK.colors[e], PdbLoader.capitalize(e)];
      } else if (lines[i].substr(0, 6) === 'CONECT') {
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
