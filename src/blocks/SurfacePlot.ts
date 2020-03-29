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

  constructor() {

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(300, 300);

    let geometry = new THREE.BoxGeometry();
    let material = new THREE.MeshStandardMaterial({color: 0xcccccc, roughness: 0.1, metalness: 0.1});
    let cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 1).normalize();
    this.scene.add(light);

    let points = [];
    points.push(new THREE.Vector3(-10, 0, 0));
    points.push(new THREE.Vector3(10, 0, 0));
    material = new THREE.LineBasicMaterial({color: 0xff0000});
    geometry = new THREE.BufferGeometry().setFromPoints(points);
    let xAxis = new THREE.Line(geometry, material);
    this.scene.add(xAxis);

    points = [];
    points.push(new THREE.Vector3(0, -10, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    material = new THREE.LineBasicMaterial({color: 0x00ff00});
    geometry = new THREE.BufferGeometry().setFromPoints(points);
    let yAxis = new THREE.Line(geometry, material);
    this.scene.add(yAxis);

    points = [];
    points.push(new THREE.Vector3(0, 0, -10));
    points.push(new THREE.Vector3(0, 0, 10));
    material = new THREE.LineBasicMaterial({color: 0x0000ff});
    geometry = new THREE.BufferGeometry().setFromPoints(points);
    let zAxis = new THREE.Line(geometry, material);
    this.scene.add(zAxis);

    this.camera.position.z = 2;
    cube.rotation.x += 1;
    cube.rotation.y += 1;
    xAxis.rotation.x += 1;
    xAxis.rotation.y += 1;
    yAxis.rotation.x += 1;
    yAxis.rotation.y += 1;
    zAxis.rotation.x += 1;
    zAxis.rotation.y += 1;
    this.renderer.render(this.scene, this.camera);

  }

  getDomElement(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

}
