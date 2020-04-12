/*
 * Revised from three.js's PDBLoader, which can't load some PDB files and can't automatically construct bonds
 *
 * @author Charles Xie
 */

// @ts-ignore
import elements from "./chemical-elements.json";
import {
  BufferGeometry,
  Float32BufferAttribute
} from "three";

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

  dispose(): void {
    this.geometryAtoms.dispose();
    this.geometryBonds.dispose();
    this.atoms.length = 0;
    this.bonds.length = 0;
  }

  private buildGeometry(): void {
    let verticesAtoms = [];
    let verticesBonds = [];
    let nAtoms = this.atoms.length;

    // atoms
    for (let i = 0; i < nAtoms; i++) {
      let atom = this.atoms[i];
      if (atom !== undefined) {
        verticesAtoms.push(atom[0], atom[1], atom[2]);
      }
    }

    // if bonds are not specified through the CONNECT lines, we should try to automatically construct them
    if (this.bonds.length === 0) {
      let minDistanceSqures: number[] = new Array(nAtoms);
      minDistanceSqures.fill(Number.MAX_VALUE);
      // first find the minimum distance to a neighboring atom for each atom
      let xi, yi, zi, dx, dy, dz, r2;
      for (let i = 0; i < nAtoms; i++) {
        if (this.atoms[i] !== undefined) {
          xi = this.atoms[i][0];
          yi = this.atoms[i][1];
          zi = this.atoms[i][2];
          for (let j = i + 1; j < nAtoms; j++) {
            if (this.atoms[j] !== undefined) {
              dx = this.atoms[j][0] - xi;
              dy = this.atoms[j][1] - yi;
              dz = this.atoms[j][2] - zi;
              r2 = dx * dx + dy * dy + dz * dz;
              if (r2 < minDistanceSqures[i]) minDistanceSqures[i] = r2;
              if (r2 < minDistanceSqures[j]) minDistanceSqures[j] = r2;
            }
          }
        }
      }
      minDistanceSqures = minDistanceSqures.map(x => x * 2);
      // any pair of atoms within the minimum square distance should be bonded
      for (let i = 0; i < nAtoms; i++) {
        if (this.atoms[i] !== undefined) {
          xi = this.atoms[i][0];
          yi = this.atoms[i][1];
          zi = this.atoms[i][2];
          for (let j = i + 1; j < nAtoms; j++) {
            if (this.atoms[j] !== undefined) {
              dx = this.atoms[j][0] - xi;
              dy = this.atoms[j][1] - yi;
              dz = this.atoms[j][2] - zi;
              r2 = dx * dx + dy * dy + dz * dz;
              if (r2 <= minDistanceSqures[i]) {
                this.bonds.push([i, j, 1]);
              }
            }
          }
        }
      }
    }

    for (let i = 0; i < this.bonds.length; i++) {
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
    this.geometryBonds.setAttribute('position', new Float32BufferAttribute(verticesBonds, 3));
  }

  getAtomColor(lowerCaseName: string): string {
    for (let e of elements) {
      if (e.symbol.toLowerCase() === lowerCaseName) return "#" + e.cpkHexColor;
    }
    return undefined;
  }

  getAtomRadius(lowerCaseName: string): number {
    for (let e of elements) {
      if (e.symbol.toLowerCase() === lowerCaseName) return e.atomicRadius;
    }
    return -1;
  }

  parse(content: string): void {
    let x, y, z, index, e;
    let lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].substr(0, 4).toUpperCase() === 'ATOM' || lines[i].substr(0, 6).toUpperCase() === 'HETATM') {
        //let items = lines[i].split(/(\s+)/).filter( e => e.trim().length > 0);
        x = parseFloat(lines[i].substr(30, 7));
        y = parseFloat(lines[i].substr(38, 7));
        z = parseFloat(lines[i].substr(46, 7));
        index = parseInt(lines[i].substr(6, 5)) - 1;
        e = PdbLoader.trim(lines[i].substr(76, 2)).toLowerCase();
        if (e === '') e = PdbLoader.trim(lines[i].substr(12, 2)).toLowerCase();
        let cpkHexColor = this.getAtomColor(e);
        if (cpkHexColor === undefined) {
          e = e.substr(0, 1);
          cpkHexColor = this.getAtomColor(e);
        }
        this.atoms[index] = [x, y, z, cpkHexColor === undefined ? this.getAtomColor('c') : cpkHexColor, PdbLoader.capitalize(e), this.getAtomRadius(e)];
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
