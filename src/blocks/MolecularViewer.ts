/*
 * @author Charles Xie
 */

import {BoxBufferGeometry, Color, Group, IcosahedronBufferGeometry, Mesh, MeshPhongMaterial, Vector3} from "three";
import {PDBLoader} from "three/examples/jsm/loaders/PDBLoader";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {Basic3D} from "./Basic3D";

export class MolecularViewer extends Basic3D {

  private root: Group;
  private loader: PDBLoader;
  private offset = new Vector3();

  constructor() {
    super();
    this.root = new Group();
    this.scene.add(this.root);
    this.loader = new PDBLoader();
  }

  destroy(): void {
    this.clear();
    this.scene.remove(this.boxBottomFace);
    this.scene.remove(this.boxTopFace);
    this.scene.remove(this.boxLine1);
    this.scene.remove(this.boxLine2);
    this.scene.remove(this.boxLine3);
    this.scene.remove(this.boxLine4);
    this.scene.remove(this.xAxisArrow);
    this.scene.remove(this.yAxisArrow);
    this.scene.remove(this.zAxisArrow);
    this.scene.remove(this.xLabelSprite);
    this.scene.remove(this.yLabelSprite);
    this.scene.remove(this.zLabelSprite);
    this.scene.dispose();
    this.orbitControls.dispose();
  }

  private clear(): void {
    while (this.root.children.length > 0) {
      let object = this.root.children[0];
      object.parent.remove(object);
    }
  }

  private loadMolecule(url: string) {
    this.clear();

    this.loader.load(url, (pdb) => {

      let geometryAtoms = pdb.geometryAtoms;
      let geometryBonds = pdb.geometryBonds;
      let json = pdb.json;
      let boxGeometry = new BoxBufferGeometry(1, 1, 1);
      let sphereGeometry = new IcosahedronBufferGeometry(1, 2);
      geometryAtoms.computeBoundingBox();
      geometryAtoms.boundingBox.getCenter(this.offset).negate();
      geometryAtoms.translate(this.offset.x, this.offset.y, this.offset.z);
      geometryBonds.translate(this.offset.x, this.offset.y, this.offset.z);
      let positions = geometryAtoms.getAttribute('position');
      let colors = geometryAtoms.getAttribute('color');
      let position = new Vector3();
      let color = new Color();

      for (let i = 0; i < positions.count; i++) {
        position.x = positions.getX(i);
        position.y = positions.getY(i);
        position.z = positions.getZ(i);
        color.r = colors.getX(i);
        color.g = colors.getY(i);
        color.b = colors.getZ(i);
        let material = new MeshPhongMaterial({color: color});
        let object = new Mesh(sphereGeometry, material);
        object.position.copy(position);
        object.position.multiplyScalar(75);
        object.scale.multiplyScalar(25);
        this.root.add(object);

        let atom = json.atoms[i];

        let text = document.createElement('div');
        text.className = 'label';
        text.style.color = 'rgb(' + atom[3][0] + ',' + atom[3][1] + ',' + atom[3][2] + ')';
        text.textContent = atom[4];
        let label = new CSS2DObject(text);
        label.position.copy(object.position);
        this.root.add(label);

      }

      positions = geometryBonds.getAttribute('position');

      let start = new Vector3();
      let end = new Vector3();

      for (let i = 0; i < positions.count; i += 2) {

        start.x = positions.getX(i);
        start.y = positions.getY(i);
        start.z = positions.getZ(i);
        end.x = positions.getX(i + 1);
        end.y = positions.getY(i + 1);
        end.z = positions.getZ(i + 1);
        start.multiplyScalar(75);
        end.multiplyScalar(75);

        let object = new Mesh(boxGeometry, new MeshPhongMaterial({color: 0xffffff}));
        object.position.copy(start);
        object.position.lerp(end, 0.5);
        object.scale.set(5, 5, start.distanceTo(end));
        object.lookAt(end);
        this.root.add(object);

      }

      this.render();

    });

  }

  render(): void {
    super.render();
    //this.labelRenderer.render(this.scene, this.camera);
  }

}
