/*
 * @author Charles Xie
 */

// @ts-ignore
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Point3DArray} from "./Point3DArray";
import {
  AmbientLight,
  BufferGeometry,
  Color,
  Line, LineBasicMaterial, LineDashedMaterial,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera, PointLight,
  Scene, SphereGeometry, Vector3,
  WebGLRenderer
} from "three";

export class LinePlot {

  private points: Point3DArray[] = [];
  private numberOfDataPoints: number = 0;
  private lines: Line[];
  private endSymbols: Mesh[];
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private controls: OrbitControls;

  constructor() {
    this.scene = new Scene();
    this.createAxes();
    this.renderer = new WebGLRenderer({alpha: true, antialias: true, preserveDrawingBuffer: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(500, 500);
    this.camera = new PerspectiveCamera(45, 1, 0.1, 1000);
    this.setCameraPosition(0, 0, 10, 1, 1, 1);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener('change', () => {
      this.render(); // re-render if controls move/zoom
    });
    this.controls.enableZoom = true;
    this.createLights();
    // default scene below
    this.points.push(new Point3DArray());
    this.lines = new Array(1);
    this.lines[0] = new Line();
    this.lines[0].geometry = new BufferGeometry();
    this.lines[0].material = new LineDashedMaterial({color: "black", dashSize: 3, gapSize: 1});
    this.scene.add(this.lines[0]);
    this.endSymbols = new Array(1);
    this.endSymbols[0] = new Mesh();
    this.endSymbols[0].geometry = new SphereGeometry(0.5, 32, 32);
    this.endSymbols[0].material = new MeshPhongMaterial({
      color: "dimgray",
      specular: 0x050505,
      shininess: 0.1
    });
    this.scene.add(this.endSymbols[0]);
  }

  erase(): void {
    if (this.points !== undefined) {
      for (let p of this.points) {
        p.clear();
      }
    }
  }

  destroy(): void {
    this.erase();
    if (this.lines !== undefined) {
      for (let l of this.lines) {
        l.geometry.dispose();
      }
    }
    if (this.endSymbols !== undefined) {
      for (let s of this.endSymbols) {
        s.geometry.dispose();
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

  // add a point at a time (used to create the trajectory of a motion)
  addPoint(i: number, x: number, y: number, z: number): void {
    this.points[i].addPoint(x, y, z);
    this.numberOfDataPoints = this.points[i].length();
    if (this.lines[i].geometry !== undefined) this.lines[i].geometry.dispose();
    this.lines[i].geometry = new BufferGeometry().setFromPoints(this.points[i].getPoints());
    this.endSymbols[i].position.set(x, y, z);
    if (this.lines[i].material instanceof LineDashedMaterial) this.lines[i].computeLineDistances();
  }

  getLatestPoint(i: number): THREE.Vector3 {
    if (this.points[i].length() == 0) return null;
    return this.points[i].getPoint(this.points[i].length() - 1);
  }

  // add all the points at once (used to create a static curve)
  setData(i: number, xValues: number[], yValues: number[], zValues: number[]): void {
    this.numberOfDataPoints = xValues.length;
    if (this.lines[i].geometry !== undefined) this.lines[i].geometry.dispose();
    this.points[i].clear();
    for (let k = 0; k < this.numberOfDataPoints; k++) {
      this.points[i].addPoint(xValues[k], yValues[k], zValues[k]);
    }
    this.lines[i].geometry = new BufferGeometry().setFromPoints(this.points[i].getPoints());
    if (this.lines[i].material instanceof LineDashedMaterial) this.lines[i].computeLineDistances();
  }

  setEndSymbolRadius(i: number, r: number): void {
    if (this.endSymbols[i].geometry !== undefined) this.endSymbols[i].geometry.dispose();
    if (r > 0.000001) {
      this.endSymbols[i].geometry = new SphereGeometry(r, 32, 32);
      if (!this.isSceneChild(this.endSymbols[i])) this.scene.add(this.endSymbols[i]);
    } else {
      this.scene.remove(this.endSymbols[i]);
    }
  }

  setDataSymbolColor(i: number, c: string): void {
    if (this.endSymbols[i].material instanceof MeshPhongMaterial) {
      (<MeshPhongMaterial>this.endSymbols[i].material).color = new Color(c);
    }
  }

  setLineColor(i: number, color: string) {
    (<LineBasicMaterial>this.lines[i].material).color = new Color(color);
  }

  setLineWidth(i: number, width: number) {
    (<LineBasicMaterial>this.lines[i].material).linewidth = width;
  }

  setLineType(i: number, type: string) {
    if (type === "None") {
      if (this.isSceneChild(this.lines[i])) {
        this.scene.remove(this.lines[i]);
      }
    } else {
      if (!this.isSceneChild(this.lines[i])) {
        this.scene.add(this.lines[i]);
      }
    }
    switch (type) {
      case "Solid":
        this.lines[i].material = new LineBasicMaterial({color: (<LineBasicMaterial>this.lines[i].material).color});
        break;
      case "Dashed":
        this.lines[i].material = new LineDashedMaterial({
          color: (<LineBasicMaterial>this.lines[i].material).color,
          dashSize: 1,
          gapSize: 0.25
        });
        if (this.points[i].length() > 0) this.lines[i].computeLineDistances();
        break;
      case "Dotted":
        this.lines[i].material = new LineDashedMaterial({
          color: (<LineBasicMaterial>this.lines[i].material).color,
          dashSize: 0.1,
          gapSize: 0.1
        });
        if (this.points[i].length() > 0) this.lines[i].computeLineDistances();
        break;
    }
  }

  setBackgroundColor(color: string): void {
    this.renderer.setClearColor(color, 1);
  }

  createAxes(): void {
    let points = [];
    points.push(new Vector3(-1000, 0, 0));
    points.push(new Vector3(1000, 0, 0));
    let lineMaterial = new LineBasicMaterial({color: 0xff0000});
    let lineGeometry = new BufferGeometry().setFromPoints(points);
    let xAxis = new Line(lineGeometry, lineMaterial);
    this.scene.add(xAxis);

    points = [];
    points.push(new Vector3(0, -1000, 0));
    points.push(new Vector3(0, 1000, 0));
    lineMaterial = new LineBasicMaterial({color: 0x00ff00});
    lineGeometry = new BufferGeometry().setFromPoints(points);
    let yAxis = new Line(lineGeometry, lineMaterial);
    this.scene.add(yAxis);

    points = [];
    points.push(new Vector3(0, 0, -1000));
    points.push(new Vector3(0, 0, 1000));
    lineMaterial = new LineBasicMaterial({color: 0x0000ff});
    lineGeometry = new BufferGeometry().setFromPoints(points);
    let zAxis = new Line(lineGeometry, lineMaterial);
    this.scene.add(zAxis);
  }

  createLights(): void {
    // Light above
    let light = new PointLight(0xffffff);
    light.position.set(0, 0, 1000);
    this.scene.add(light);
    // Light below
    light = new PointLight(0xffffff);
    light.position.set(0, 0, -1000);
    this.scene.add(light);
    // Ambient light
    this.scene.add(new AmbientLight(0xffffff));
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  getDomElement(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  isSceneChild(x: any): boolean {
    for (let c of this.scene.children) {
      if (c === x) return true;
    }
    return false;
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
