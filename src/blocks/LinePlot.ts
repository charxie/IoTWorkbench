/*
 * @author Charles Xie
 */

// @ts-ignore
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Point3DArray} from "./Point3DArray";

export class LinePlot {

  private lines: THREE.Line[];
  private geometries: THREE.BufferGeometry[];
  private materials: THREE.Material[];

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;

  private points: Point3DArray[] = [];
  private numberOfDataPoints: number = 0;

  constructor() {
    this.scene = new THREE.Scene();
    this.createAxes();
    this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true, preserveDrawingBuffer: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(500, 500);
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    this.setCameraPosition(0, 0, 10, 1, 1, 1);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener('change', () => {
      this.render(); // re-render if controls move/zoom
    });
    this.controls.enableZoom = true;
    this.createLights();
    this.lines = new Array(1);
    this.geometries = new Array(1);
    this.materials = new Array(1);
    this.setLineColor(0, "black");
    this.points.push(new Point3DArray());
  }

  erase(): void {
    if (this.points !== undefined) {
      for (let p of this.points) {
        p.clear();
      }
    }
  }

  getDataPoints(): number {
    return this.numberOfDataPoints;
  }

  pushPointArray(): void {
    this.points.push(new Point3DArray());
  }

  popPointArray(): void {
    this.points.pop();
  }

  setPointArrayLength(n: number): void {
    this.points.length = n;
  }

  addPoint(i: number, x: number, y: number, z: number): void {
    this.points[i].addPoint(x, y, z);
    if (this.geometries[i] !== undefined) this.geometries[i].dispose();
    this.geometries[i] = new THREE.BufferGeometry().setFromPoints(this.points[i].getPoints());
    if (this.lines[i] !== undefined) this.scene.remove(this.lines[i]);
    this.lines[i] = new THREE.Line(this.geometries[i], this.materials[i]);
    this.scene.add(this.lines[i]);
  }

  getLatestPoint(i: number): THREE.Vector3 {
    if (this.points[i].length() == 0) return null;
    return this.points[i].getPoint(this.points[i].length() - 1);
  }

  setData(i: number, xValues: number[], yValues: number[], zValues: number[]): void {
    this.numberOfDataPoints = xValues.length;
    if (this.lines[i] !== undefined) this.scene.remove(this.lines[i]);
    if (this.geometries[i] !== undefined) this.geometries[i].dispose();
    this.points[i].clear();
    for (let k = 0; k < this.numberOfDataPoints; k++) {
      this.points[i].addPoint(xValues[k], yValues[k], zValues[k]);
    }
    this.geometries[i] = new THREE.BufferGeometry().setFromPoints(this.points[i].getPoints());
    this.lines[i] = new THREE.Line(this.geometries[i], this.materials[i]);
    this.scene.add(this.lines[i]);
  }

  setLineColor(i: number, color: string) {
    if (this.materials[i] !== undefined) this.materials[i].dispose();
    this.materials[i] = new THREE.LineBasicMaterial({color: color});
    if (this.lines[i] !== undefined) {
      this.scene.remove(this.lines[i]);
      this.lines[i] = new THREE.Line(this.geometries[i], this.materials[i]);
      this.scene.add(this.lines[i]);
    }
  }

  setBackgroundColor(color: string): void {
    this.renderer.setClearColor(color, 1);
  }

  createAxes(): void {
    let points = [];
    points.push(new THREE.Vector3(-1000, 0, 0));
    points.push(new THREE.Vector3(1000, 0, 0));
    let lineMaterial = new THREE.LineBasicMaterial({color: 0xff0000});
    let lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    let xAxis = new THREE.Line(lineGeometry, lineMaterial);
    this.scene.add(xAxis);

    points = [];
    points.push(new THREE.Vector3(0, -1000, 0));
    points.push(new THREE.Vector3(0, 1000, 0));
    lineMaterial = new THREE.LineBasicMaterial({color: 0x00ff00});
    lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    let yAxis = new THREE.Line(lineGeometry, lineMaterial);
    this.scene.add(yAxis);

    points = [];
    points.push(new THREE.Vector3(0, 0, -1000));
    points.push(new THREE.Vector3(0, 0, 1000));
    lineMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});
    lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    let zAxis = new THREE.Line(lineGeometry, lineMaterial);
    this.scene.add(zAxis);
  }

  createLights(): void {
    // Light above
    let light = new THREE.PointLight(0xffffff);
    light.position.set(0, 0, 1000);
    this.scene.add(light);
    // Light below
    light = new THREE.PointLight(0xffffff);
    light.position.set(0, 0, -1000);
    this.scene.add(light);
    // Ambient light
    this.scene.add(new THREE.AmbientLight(0xffffff));
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  getDomElement(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  setCameraPosition(px: number, py: number, pz: number, rx: number, ry: number, rz: number): void {
    this.camera.position.set(px, py, pz);
    this.camera.rotation.set(rx, ry, rz);
  }

  getCameraPositionX(): number {
    return this.camera.position.x;
  }

  getCameraPositionY(): number {
    return this.camera.position.y;
  }

  getCameraPositionZ(): number {
    return this.camera.position.z;
  }

  // return Euler angle
  getCameraRotationX(): number {
    return this.camera.rotation.x;
  }

  // return Euler angle
  getCameraRotationY(): number {
    return this.camera.rotation.y;
  }

  // return Euler angle
  getCameraRotationZ(): number {
    return this.camera.rotation.z;
  }

}
