/*
 * @author Charles Xie
 */

import * as d3 from 'd3';
// @ts-ignore
import * as THREE from 'three';

export class SurfacePlot {

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: THREE.TrackballControls;

  readonly SCREEN_WIDTH = 300;
  readonly SCREEN_HEIGHT = 300;
  readonly VIEW_ANGLE = 45;
  readonly ASPECT = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
  readonly NEAR = 0.1;
  readonly FAR = 2000;

  constructor(parent: HTMLDivElement) {

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR);
    this.scene.add(this.camera);
    this.camera.position.set(0, 150, 400);
    this.camera.lookAt(this.scene.position);
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
    parent.appendChild(this.renderer.domElement);

    let positions = [[1, 1, 1], [-1, -1, 1], [-1, 1, 1], [1, -1, 1]];
    for (let i = 0; i < 4; i++) {
      var light = new THREE.DirectionalLight(0xdddddd);
      light.position.set(positions[i][0], positions[i][1], 0.4 * positions[i][2]);
      this.scene.add(light);
    }
    //initGrid();

    //this.controls = new THREE.TrackballControls(this.camera);
    this.renderer.setClearColor(0xffffff, 1);
  }

}
