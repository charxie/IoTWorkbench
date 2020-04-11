/*
 * @author Charles Xie
 */

import {
  Color,
  CylinderBufferGeometry,
  Group,
  IcosahedronBufferGeometry,
  Mesh,
  MeshPhongMaterial,
  Vector3
} from "three";
import {CSS2DObject, CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";
import {Basic3D} from "./Basic3D";
import {PdbLoader} from "./loaders/PdbLoader";

export class MolecularViewer extends Basic3D {

  private root: Group;
  private offset = new Vector3();
  private numberOfAtoms: number = 0;
  private showLabel: boolean = false;
  private labelRenderer: CSS2DRenderer;

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
  }

  private clear(): void {
    while (this.root.children.length > 0) {
      let object = this.root.children[0];
      object.parent.remove(object);
    }
  }

  loadMolecule(content: string) {
    this.clear();

    let loader = new PdbLoader();
    loader.parse(content);

    let geometryAtoms = loader.geometryAtoms;
    let geometryBonds = loader.geometryBonds;
    let ballGeometry = new IcosahedronBufferGeometry(1, 2);
    geometryAtoms.computeBoundingBox();
    geometryAtoms.boundingBox.getCenter(this.offset).negate();
    geometryAtoms.translate(this.offset.x, this.offset.y, this.offset.z);
    geometryBonds.translate(this.offset.x, this.offset.y, this.offset.z);

    // draw atoms as balls
    let radius = 25;
    let positions = geometryAtoms.getAttribute('position');
    let colors = geometryAtoms.getAttribute('color');
    let position = new Vector3();
    let color = new Color();
    this.numberOfAtoms = positions.count;
    for (let i = 0; i < positions.count; i++) {
      position.x = positions.getX(i);
      position.y = positions.getY(i);
      position.z = positions.getZ(i);
      color.r = colors.getX(i);
      color.g = colors.getY(i);
      color.b = colors.getZ(i);
      let material = new MeshPhongMaterial({color: color});
      let object = new Mesh(ballGeometry, material);
      object.position.copy(position);
      object.position.multiplyScalar(75);
      object.scale.multiplyScalar(radius);
      this.root.add(object);

      if (this.showLabel) {
        let atom = loader.atoms[i];
        let text = document.createElement('div');
        text.className = 'label';
        text.style.color = 'rgb(' + atom[3][0] + ',' + atom[3][1] + ',' + atom[3][2] + ')';
        text.textContent = atom[4];
        let label = new CSS2DObject(text);
        label.position.copy(object.position);
        this.root.add(label);
      }
    }

    // draw bonds as sticks
    let stickGeometry = new CylinderBufferGeometry(1, 1, 1, 8, 1);
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
      bond1.multiplyScalar(75);
      bond2.multiplyScalar(75);
      let object = new Mesh(stickGeometry, new MeshPhongMaterial({
        color: 0xcccccc, specular: 0x050505, shininess: 0.1
      }));
      object.position.copy(bond1);
      object.position.lerp(bond2, 0.5);
      object.scale.set(5, 5, bond1.distanceTo(bond2) - 2 * radius);
      object.lookAt(bond2);
      this.root.add(object);
    }

    this.render();
    loader.dispose();
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
