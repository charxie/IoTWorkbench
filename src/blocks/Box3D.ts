/*
 * This is a test.
 *
 * @author Charles Xie
 */

import * as d3 from 'd3';
// @ts-ignore
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

export class Box3D {

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  constructor() {

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(300, 300);

    let geometry = new THREE.BoxGeometry();
    let material = new THREE.MeshStandardMaterial({color: 0xcccccc, roughness: 0.1, metalness: 0.1});
    let cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    let points = [];
    points.push(new THREE.Vector3(-10, 0, 0));
    points.push(new THREE.Vector3(10, 0, 0));
    let lineMaterial = new THREE.LineBasicMaterial({color: 0xff0000});
    let lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    let xAxis = new THREE.Line(lineGeometry, lineMaterial);
    this.scene.add(xAxis);

    points = [];
    points.push(new THREE.Vector3(0, -10, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    lineMaterial = new THREE.LineBasicMaterial({color: 0x00ff00});
    lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    let yAxis = new THREE.Line(lineGeometry, lineMaterial);
    this.scene.add(yAxis);

    points = [];
    points.push(new THREE.Vector3(0, 0, -10));
    points.push(new THREE.Vector3(0, 0, 10));
    lineMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});
    lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    let zAxis = new THREE.Line(lineGeometry, lineMaterial);
    this.scene.add(zAxis);

    this.camera.position.z = 2;
    cube.rotation.x = 1;
    cube.rotation.y = 1;
    xAxis.rotation.x = 1;
    xAxis.rotation.y = 1;
    yAxis.rotation.x = 1;
    yAxis.rotation.y = 1;
    zAxis.rotation.x = 1;
    zAxis.rotation.y = 1;

    // Add controls
    let controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.addEventListener('change', () => {
      this.renderer.render(this.scene, this.camera); // re-render if controls move/zoom
    });
    controls.enableZoom = true;

    // Light above
    let light = new THREE.PointLight(0xffffff);
    light.position.set(0, 0, 3);
    this.scene.add(light);

    // Light below
    light = new THREE.PointLight(0xffffff);
    light.position.set(0, 0, -3);
    this.scene.add(light);

    // Ambient light
    this.scene.add(new THREE.AmbientLight(0x222222));

    this.renderer.render(this.scene, this.camera);

  }

  getDomElement(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

}
