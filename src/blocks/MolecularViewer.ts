/*
 * @author Charles Xie
 */

import {
  BoxBufferGeometry,
  Group,
  IcosahedronBufferGeometry,
  Mesh,
  MeshPhongMaterial,
  Vector3
} from "three";
import {CSS2DObject, CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";
import {Basic3D} from "./Basic3D";
import {PdbLoader} from "./loaders/PdbLoader";
import {XyzLoader} from "./loaders/XyzLoader";
import {MolecularLoader} from "./loaders/MolecularLoader";

export class MolecularViewer extends Basic3D {

  private root: Group;
  private style: string = "Ball-and-Stick";
  private spin: boolean = false;
  private ballRadiusScale: number = 0.01 * 0.75; // input is pm, but coordinates are in angstrom (100pm)
  private stickWidth: number = 0.25;
  private offset = new Vector3();
  private numberOfAtoms: number = 0;
  private showLabel: boolean = false;
  private labelRenderer: CSS2DRenderer;
  private loader: MolecularLoader;

  constructor() {
    super();
    this.root = new Group();
    this.scene.add(this.root);
    if (this.showLabel) {
      this.labelRenderer = new CSS2DRenderer();
      this.labelRenderer.setSize(500, 500);
      this.labelRenderer.domElement.style.position = 'absolute';
      this.labelRenderer.domElement.style.top = '0';
      this.labelRenderer.domElement.style.pointerEvents = 'none';
      document.getElementById("block-view-wrapper").appendChild(this.labelRenderer.domElement);
    }
  }

  destroy(): void {
    super.destroy();
    this.clear();
    this.scene.dispose();
    if (this.loader !== undefined) this.loader.dispose();
  }

  private clear(): void {
    while (this.root.children.length > 0) {
      let object = this.root.children[0];
      object.parent.remove(object);
    }
  }

  setSpin(spin: boolean): void {
    this.spin = spin;
  }

  getSpin(): boolean {
    return this.spin;
  }

  setStyle(style: string): void {
    if (this.style === style) return;
    this.style = style;
    switch (style) {
      case "Ball-and-Stick":
        this.ballRadiusScale = 0.01 * 0.75;
        this.stickWidth = 0.25;
        break;
      case "Space-Filling":
        this.ballRadiusScale = 0.01 * 1.5;
        this.stickWidth = 0;
        break;
    }
    if (this.loader !== undefined) this.setFromLoader();
  }

  getStyle(): string {
    return this.style;
  }

  loadMolecule(content: string) {
    if (this.loader !== undefined) {
      this.loader.dispose();
      this.loader = undefined;
    }
    if (content.startsWith("Format:PDB")) {
      this.loader = new PdbLoader();
    } else if (content.startsWith("Format:XYZ")) {
      this.loader = new XyzLoader();
    }
    if (this.loader === undefined) return;
    this.loader.parse(content);
    this.setFromLoader();
  }

  private setFromLoader(): void {
    this.clear();
    let geometryAtoms = this.loader.geometryAtoms;
    let geometryBonds = this.loader.geometryBonds;
    let ballGeometry = new IcosahedronBufferGeometry(1, 2);
    geometryAtoms.computeBoundingBox();
    geometryAtoms.boundingBox.getCenter(this.offset).negate();
    geometryAtoms.translate(this.offset.x, this.offset.y, this.offset.z);
    geometryBonds.translate(this.offset.x, this.offset.y, this.offset.z);

    // draw atoms as balls
    let positions = geometryAtoms.getAttribute('position');
    let position = new Vector3();
    this.numberOfAtoms = positions.count;
    for (let i = 0; i < positions.count; i++) {
      if (this.loader.atoms[i] === undefined) continue;
      position.x = positions.getX(i);
      position.y = positions.getY(i);
      position.z = positions.getZ(i);
      let material = new MeshPhongMaterial({color: this.loader.atoms[i][3]});
      let object = new Mesh(ballGeometry, material);
      object.position.copy(position);
      object.scale.multiplyScalar(this.loader.atoms[i][5] * this.ballRadiusScale);
      this.root.add(object);

      if (this.showLabel) {
        let atom = this.loader.atoms[i];
        let text = document.createElement('div');
        text.className = 'label';
        text.style.color = atom[3];
        text.textContent = atom[4];
        let label = new CSS2DObject(text);
        label.position.copy(object.position);
        this.root.add(label);
      }
    }

    // draw bonds as sticks
    if (this.stickWidth > 0) {
      let stickGeometry = new BoxBufferGeometry(1, 1, 1);
      positions = geometryBonds.getAttribute('position');
      let bond1 = new Vector3();
      let bond2 = new Vector3();
      for (let i = 0; i < positions.count; i += 2) {
        bond1.x = positions.getX(i);
        bond1.y = positions.getY(i);
        bond1.z = positions.getZ(i);
        bond2.x = positions.getX(i + 1);
        bond2.y = positions.getY(i + 1);
        bond2.z = positions.getZ(i + 1);
        let object = new Mesh(stickGeometry, new MeshPhongMaterial({
          color: 0xcccccc, specular: 0x050505, shininess: 0.1
        }));
        object.position.copy(bond1);
        object.position.lerp(bond2, 0.5);
        object.scale.set(this.stickWidth, this.stickWidth, bond1.distanceTo(bond2));
        object.lookAt(bond2);
        this.root.add(object);
      }
    }

    this.render();
  }

  getNumberOfAtoms(): number {
    return this.numberOfAtoms;
  }

  render(): void {
    super.render();
    if (this.labelRenderer !== undefined) this.labelRenderer.render(this.scene, this.camera);
  }

  setX(x: number): void {
    if (this.labelRenderer !== undefined) {
      this.labelRenderer.domElement.style.left = x + "px";
    }
  }

  setY(y: number): void {
    if (this.labelRenderer !== undefined) {
      this.labelRenderer.domElement.style.top = y + "px";
    }
  }

  setWidth(width: number): void {
    if (this.labelRenderer !== undefined) {
      this.labelRenderer.domElement.style.width = width + "px";
    }
  }

  setHeight(height: number): void {
    if (this.labelRenderer !== undefined) {
      this.labelRenderer.domElement.style.height = height + "px";
    }
  }

  translateTo(x: number, y: number): void {
    if (this.labelRenderer !== undefined) {
      this.labelRenderer.domElement.style.left = x + "px";
      this.labelRenderer.domElement.style.top = y + "px";
    }
  }

  setRect(x: number, y: number, width: number, height: number): void {
    if (this.labelRenderer !== undefined) {
      this.labelRenderer.domElement.style.left = x + "px";
      this.labelRenderer.domElement.style.top = y + "px";
      this.labelRenderer.domElement.style.width = width + "px";
      this.labelRenderer.domElement.style.height = height + "px";
    }
  }

}
