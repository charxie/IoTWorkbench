/*
 * @author Charles Xie
 */

// @ts-ignore
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight, BoxGeometry,
  BufferGeometry,
  Color, ConeGeometry, CylinderGeometry, Geometry,
  Line, LineBasicMaterial, LineDashedMaterial, Matrix4,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera, PointLight,
  Scene, SphereGeometry, TetrahedronGeometry, Vector3,
  WebGLRenderer
} from "three";
import {Point3DArray} from "./Point3DArray";
import {Symbol3DArray} from "./Symbol3DArray";

export class LinePlot {

  lineTypes: string[] = [];
  lineColors: string[] = [];
  lineWidths: number[] = [];
  dataSymbols: string[] = [];
  dataSymbolRadii: number[] = [];
  dataSymbolColors: string[] = [];
  dataSymbolSpacings: number[] = [];
  endSymbolRadii: number[] = [];

  private endSymbolsConnection: string = "None";
  private points: Point3DArray[] = [];
  private numberOfDataPoints: number = 0;
  private lines: Line[];
  private symbols: Symbol3DArray[] = [];
  private endSymbols: Mesh[];
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private controls: OrbitControls;
  private stick: Mesh;

  constructor() {
    this.scene = new Scene();
    this.createAxes();
    this.renderer = new WebGLRenderer({alpha: true, antialias: true, preserveDrawingBuffer: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(500, 500);
    this.camera = new PerspectiveCamera(45, 1, 0.1, 10000);
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
    this.symbols.push(new Symbol3DArray());
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
        if (l.geometry !== undefined) l.geometry.dispose();
        this.scene.remove(l);
      }
    }
    if (this.endSymbols !== undefined) {
      for (let s of this.endSymbols) {
        if (s.geometry !== undefined) s.geometry.dispose();
        this.scene.remove(s);
      }
    }
    this.scene.dispose();
    this.controls.dispose();
  }

  getDataPoints(): number {
    return this.numberOfDataPoints;
  }

  pushPointArray(): void {
    this.points.push(new Point3DArray());
    let line = new Line();
    line.geometry = new BufferGeometry();
    line.material = new LineDashedMaterial({color: "black", dashSize: 3, gapSize: 1});
    this.lines.push(line);
    this.scene.add(line);
    let endSymbol = new Mesh();
    this.endSymbols.push(endSymbol);
    endSymbol.geometry = new SphereGeometry(0.01, 32, 32);
    endSymbol.material = new MeshPhongMaterial({
      color: "dimgray",
      specular: 0x050505,
      shininess: 0.1
    });
    this.scene.add(endSymbol);
    this.symbols.push(new Symbol3DArray());
    this.lineTypes.push("Solid");
    this.lineColors.push("black");
    this.lineWidths.push(1);
    this.dataSymbols.push("None");
    this.dataSymbolRadii.push(3);
    this.dataSymbolColors.push("dimgray");
    this.dataSymbolSpacings.push(1);
    this.endSymbolRadii.push(0);
  }

  popPointArray(): void {
    this.points.pop();
    this.lines.pop();
    this.endSymbols.pop();
    this.symbols.pop();
    this.lineTypes.pop();
    this.lineColors.pop();
    this.lineWidths.pop();
    this.dataSymbols.pop();
    this.dataSymbolRadii.pop();
    this.dataSymbolColors.pop();
    this.dataSymbolSpacings.pop();
    this.endSymbolRadii.pop();
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
    if (i == 1) {
      let x1 = this.endSymbols[i].position.x;
      let x0 = this.endSymbols[i - 1].position.x;
      let y1 = this.endSymbols[i].position.y;
      let y0 = this.endSymbols[i - 1].position.y;
      let z1 = this.endSymbols[i].position.z;
      let z0 = this.endSymbols[i - 1].position.z;
      let dx = x1 - x0;
      let dy = y1 - y0;
      let dz = z1 - z0;
      let h = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (this.stick !== undefined) {
        this.scene.remove(this.stick);
      }
      this.stick = new Mesh();
      this.stick.geometry = new CylinderGeometry(0.05, 0.05, h, 5);
      this.stick.geometry.applyMatrix4(new Matrix4().makeTranslation(0, h / 2, 0));
      this.stick.geometry.applyMatrix4(new Matrix4().makeRotationX(Math.PI / 2));
      this.stick.material = new MeshPhongMaterial({
        color: "dimgray",
        specular: 0x050505,
        shininess: 0.1
      });
      this.scene.add(this.stick);
      this.stick.position.set(x0, y0, z0);
      this.stick.lookAt(new Vector3(x1, y1, z1));
    }
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
    this.drawSymbols(i);
  }

  setEndSymbolsConnection(endSymbolsConnection: string): void {
    this.endSymbolsConnection = endSymbolsConnection;
  }

  getEndSymbolsConnection(): string {
    return this.endSymbolsConnection;
  }

  setEndSymbolRadius(i: number, r: number): void {
    this.endSymbolRadii[i] = r;
    if (this.endSymbols[i].geometry !== undefined) this.endSymbols[i].geometry.dispose();
    if (r > 0.000001) {
      this.endSymbols[i].geometry = new SphereGeometry(r, 16, 16);
      if (!this.isSceneChild(this.endSymbols[i])) this.scene.add(this.endSymbols[i]);
    } else {
      this.scene.remove(this.endSymbols[i]);
    }
  }

  private getSymbolGeometry(i: number, r: number): Geometry {
    switch (this.dataSymbols[i]) {
      case "Sphere":
        return new SphereGeometry(r, 8, 8);
      case "Cube":
        let l = r * 2;
        return new BoxGeometry(l, l, l);
      case "Cone":
        return new ConeGeometry(r, 2 * r, 8);
      case "Cylinder":
        return new CylinderGeometry(r, r, 2 * r, 8);
      case "Tetrahedron":
        return new TetrahedronGeometry(r);
    }
    return undefined;
  }

  setDataSymbol(i: number, dataSymbol: string): void {
    this.dataSymbols[i] = dataSymbol;
    this.drawSymbols(i);
  }

  // this is an expensive method as it removes all the existing symbols and recreates new ones every time
  private drawSymbols(i: number): void {
    if (this.symbols[i].length() > 0) {
      for (let k = 0; k < this.symbols[i].length(); k++) {
        let s = this.symbols[i].getSymbol(k);
        if (this.isSceneChild(s)) {
          this.scene.remove(s);
        }
      }
    }
    this.symbols[i].clear();
    if (this.dataSymbols[i] === "None") return;
    let iLength = this.points[i].length();
    if (iLength <= 0) return;
    let g: Geometry = this.getSymbolGeometry(i, this.dataSymbolRadii[i]);
    if (g !== undefined) {
      let symbolMaterial = new MeshPhongMaterial({
        color: this.dataSymbolColors[i],
        specular: 0x050505,
        shininess: 0.1
      });
      for (let k = 0; k < iLength; k++) {
        if (k % this.dataSymbolSpacings[i] == 0) {
          let mesh = new Mesh(g, symbolMaterial);
          mesh.translateX(this.points[i].getX(k));
          mesh.translateY(this.points[i].getY(k));
          mesh.translateZ(this.points[i].getZ(k));
          this.symbols[i].addSymbol(mesh);
        }
      }
    }
    if (this.symbols[i].length() > 0) {
      for (let k = 0; k < this.symbols[i].length(); k++) {
        this.scene.add(this.symbols[i].getSymbol(k));
      }
    }
  }

  setDataSymbolSpacing(i: number, dataSymbolSpacing: number): void {
    this.dataSymbolSpacings[i] = dataSymbolSpacing;
  }

  setDataSymbolRadius(i: number, dataSymbolRadius: number): void {
    this.dataSymbolRadii[i] = dataSymbolRadius;
  }

  setDataSymbolColor(i: number, c: string): void {
    this.dataSymbolColors[i] = c;
    if (this.endSymbols[i].material instanceof MeshPhongMaterial) {
      (<MeshPhongMaterial>this.endSymbols[i].material).color = new Color(c);
    }
  }

  setLineColor(i: number, c: string) {
    this.lineColors[i] = c;
    (<LineBasicMaterial>this.lines[i].material).color = new Color(c);
  }

  setLineWidth(i: number, width: number) {
    this.lineWidths[i] = width;
    (<LineBasicMaterial>this.lines[i].material).linewidth = width;
  }

  setLineType(i: number, type: string) {
    this.lineTypes[i] = type;
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

  resetViewAngle(): void {
    this.controls.reset();
  }

  setCameraPosition(px: number, py: number, pz: number, rx: number, ry: number, rz: number): void {
    this.camera.position.set(px, py, pz);
    this.camera.rotation.set(rx, ry, rz);
    //if (this.controls !== undefined) this.controls.update(); // this sets to the orgin to the center of the window
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
