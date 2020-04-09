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
  Mesh, MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera, PointLight,
  Scene, SphereGeometry, TetrahedronGeometry, TextureLoader, Vector3,
  WebGLRenderer
} from "three";
import {Point3DArray} from "./Point3DArray";
import {Symbol3DArray} from "./Symbol3DArray";
import TextSprite from '@seregpie/three.text-sprite';
import {MeshLine, MeshLineMaterial} from 'threejs-meshline';
import {Util} from "../Util";

export class LinePlot {

  lineTypes: string[] = [];
  lineColors: string[] = [];
  lineWidths: number[] = [];
  dataSymbols: string[] = [];
  dataSymbolRadii: number[] = [];
  dataSymbolColors: string[] = [];
  dataSymbolSpacings: number[] = [];
  endSymbolRadii: number[] = [];
  endSymbolConnections: string[] = [];

  private boxSize: number = 0; // zero means no box
  private boxBottomFace: Line;
  private boxTopFace: Line;
  private boxLine1: Line;
  private boxLine2: Line;
  private boxLine3: Line;
  private boxLine4: Line;
  private xAxisArrow: Mesh;
  private yAxisArrow: Mesh;
  private zAxisArrow: Mesh;
  private xLabelSprite: TextSprite;
  private yLabelSprite: TextSprite;
  private zLabelSprite: TextSprite;
  private xAxisLabel: string = "x";
  private yAxisLabel: string = "y";
  private zAxisLabel: string = "z";
  private backgroundColor: string = "white";
  private fontSize: number = 0.5;
  private offset: number = 0;

  private points: Point3DArray[] = [];
  private numberOfDataPoints: number = 0;
  private lines: Line[];
  private symbols: Symbol3DArray[] = [];
  private endSymbols: Mesh[];
  private endSymbolConnectors: Mesh[];
  private endSymbolTextureData: string[] = [];
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
    if (this.endSymbolConnectors !== undefined) {
      for (let c of this.endSymbolConnectors) {
        if (c.geometry !== undefined) c.geometry.dispose();
        this.scene.remove(c);
      }
    }
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
    this.endSymbolConnections.push("None");
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
    this.endSymbolConnections.pop();
  }

  setPointArrayLength(n: number): void {
    if (this.endSymbolConnectors === undefined) {
      if (n > 1) {
        this.endSymbolConnectors = new Array();
        for (let i = 0; i < n - 1; i++) {
          this.endSymbolConnectors.push(new Mesh());
        }
      }
    } else {
      if (n < this.points.length) {
        for (let i = n; i < this.points.length; i++) {
          let mesh = this.endSymbolConnectors.pop();
          mesh.geometry.dispose();
          if (this.isSceneChild(mesh)) {
            this.scene.remove(mesh);
          }
        }
      } else if (n > this.points.length) {
        for (let i = this.points.length; i < n; i++) {
          this.endSymbolConnectors.push(new Mesh());
        }
      }
    }
    if (this.endSymbolConnectors !== undefined) {
      let connectorMaterial = new MeshPhongMaterial({
        color: "dimgray",
        specular: 0x050505,
        shininess: 0.1
      });
      for (let m of this.endSymbolConnectors) {
        if (!this.isSceneChild(m)) {
          this.scene.add(m);
        }
        m.material = connectorMaterial;
      }
    }
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
    if (i > 0) {
      this.setEndSymolConnector(i, i - 1);
    }
  }

  private setEndSymolConnector(i: number, j: number): void {
    if (j >= this.endSymbolConnectors.length) return;
    let xi = this.endSymbols[i].position.x;
    let xj = this.endSymbols[j].position.x;
    let yi = this.endSymbols[i].position.y;
    let yj = this.endSymbols[j].position.y;
    let zi = this.endSymbols[i].position.z;
    let zj = this.endSymbols[j].position.z;
    let dx = xi - xj;
    let dy = yi - yj;
    let dz = zi - zj;
    let h = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (this.endSymbolConnectors[j].geometry !== undefined) this.endSymbolConnectors[j].geometry.dispose();
    switch (this.endSymbolConnections[j]) {
      case "None":
        this.endSymbolConnectors[j].visible = false;
        break;
      case "Rod":
        this.endSymbolConnectors[j].visible = true;
        this.endSymbolConnectors[j].geometry = new CylinderGeometry(0.05, 0.05, h, 5);
        this.endSymbolConnectors[j].geometry.applyMatrix4(new Matrix4().makeTranslation(0, h / 2, 0));
        this.endSymbolConnectors[j].geometry.applyMatrix4(new Matrix4().makeRotationX(Math.PI / 2));
        this.endSymbolConnectors[j].position.set(xj, yj, zj);
        this.endSymbolConnectors[j].lookAt(new Vector3(xi, yi, zi));
        this.endSymbolConnectors[j].material = new MeshPhongMaterial({
          color: "dimgray",
          specular: 0x050505,
          shininess: 0.1
        });
        break;
      case "Coil":
        const r = this.endSymbolRadii[i] * 0.75;
        const vertices = [];
        const count = 100; // we really don't know how to set the number of coils, for now just use 100
        for (let n = 1; n < count; n++) {
          let angle = 20 * Math.PI * n / count;
          let cos = r * Math.cos(angle);
          let sin = r * Math.sin(angle);
          vertices.push(new Vector3(cos, -h * n / count, sin));
        }
        const line = new MeshLine();
        line.setVertices(vertices);
        this.endSymbolConnectors[j].visible = true;
        this.endSymbolConnectors[j].geometry = line;
        this.endSymbolConnectors[j].geometry.applyMatrix4(new Matrix4().makeTranslation(0, h, 0));
        this.endSymbolConnectors[j].geometry.applyMatrix4(new Matrix4().makeRotationX(Math.PI / 2));
        this.endSymbolConnectors[j].position.set(xj, yj, zj);
        this.endSymbolConnectors[j].lookAt(new Vector3(xi, yi, zi));
        this.endSymbolConnectors[j].material = new MeshLineMaterial({lineWidth: 0.05, color: "gray"});
        break;
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

  setEndSymbolConnection(i: number, endSymbolConnection: string): void {
    this.endSymbolConnections[i] = endSymbolConnection;
    if (this.endSymbolConnectors !== undefined) {
      this.setEndSymolConnector(i + 1, i);
    }
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

  setEndSymbolTexture(i: number, imgsrc: string): void {
    if (this.endSymbolTextureData[i] !== undefined && imgsrc !== undefined && this.endSymbolTextureData[i].length === imgsrc.length) return;
    if (this.endSymbolTextureData[i] === undefined && imgsrc === undefined) return;
    this.endSymbolTextureData[i] = imgsrc;
    if (imgsrc !== undefined) {
      new TextureLoader().load(imgsrc, (texture) => {
        this.endSymbols[i].material = new MeshPhongMaterial({
          color: this.dataSymbolColors[i],
          map: texture,
          specular: 0x050505,
          shininess: 0.1
        })
        this.render();
      });
    } else {
      this.endSymbols[i].material = new MeshPhongMaterial({
        color: this.dataSymbolColors[i],
        specular: 0x050505,
        shininess: 0.1
      });
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
    this.backgroundColor = color;
    this.renderer.setClearColor(color, 1);
  }

  getBackgroundColor(): string {
    return this.backgroundColor;
  }

  setBoxSize(boxSize: number): void {
    this.removeBox();
    this.removeArrows();
    this.removeSprites();
    let p;
    let r;
    if (boxSize > 0) {
      p = boxSize;
      r = boxSize * 0.02;
      this.createBox(boxSize / 2, 0xcccccc);
    } else {
      p = 50;
      r = 1;
    }
    let xArrow = new Vector3(p, 0, 0);
    let yArrow = new Vector3(0, p, 0);
    let zArrow = new Vector3(0, 0, p);
    this.xAxisArrow = this.addArrow(xArrow, 0xff0000, r, "x");
    this.yAxisArrow = this.addArrow(yArrow, 0x00ff00, r, "y");
    this.zAxisArrow = this.addArrow(zArrow, 0x0000ff, r, "z");
    this.fontSize = p * 0.1;
    this.offset = this.fontSize / 2;
    let c = Util.isDarkish(this.backgroundColor) ? "white" : "black";
    this.xLabelSprite = this.addSprite(this.fontSize, this.offset, xArrow, c, "x");
    this.yLabelSprite = this.addSprite(this.fontSize, this.offset, yArrow, c, "y");
    this.zLabelSprite = this.addSprite(this.fontSize, this.offset, zArrow, c, "z");
    this.boxSize = boxSize;
  }

  getBoxSize(): number {
    return this.boxSize;
  }

  private removeArrows(): void {
    if (this.isSceneChild(this.xAxisArrow)) this.scene.remove(this.xAxisArrow);
    if (this.isSceneChild(this.yAxisArrow)) this.scene.remove(this.yAxisArrow);
    if (this.isSceneChild(this.zAxisArrow)) this.scene.remove(this.zAxisArrow);
  }

  private removeSprites(): void {
    if (this.isSceneChild(this.xLabelSprite)) this.scene.remove(this.xLabelSprite);
    if (this.isSceneChild(this.yLabelSprite)) this.scene.remove(this.yLabelSprite);
    if (this.isSceneChild(this.zLabelSprite)) this.scene.remove(this.zLabelSprite);
  }

  private removeBox(): void {
    if (this.isSceneChild(this.boxBottomFace)) this.scene.remove(this.boxBottomFace);
    if (this.isSceneChild(this.boxTopFace)) this.scene.remove(this.boxTopFace);
    if (this.isSceneChild(this.boxLine1)) this.scene.remove(this.boxLine1);
    if (this.isSceneChild(this.boxLine2)) this.scene.remove(this.boxLine2);
    if (this.isSceneChild(this.boxLine3)) this.scene.remove(this.boxLine3);
    if (this.isSceneChild(this.boxLine4)) this.scene.remove(this.boxLine4);
  }

  private createBox(a: number, c: number): void {
    let p1 = new Vector3(-a, -a, -a);
    let p2 = new Vector3(-a, a, -a);
    let p3 = new Vector3(a, a, -a);
    let p4 = new Vector3(a, -a, -a);
    let q1 = new Vector3(-a, -a, a);
    let q2 = new Vector3(-a, a, a);
    let q3 = new Vector3(a, a, a);
    let q4 = new Vector3(a, -a, a);
    this.boxBottomFace = this.addRectangle(p1, p2, p3, p4, c);
    this.boxTopFace = this.addRectangle(q1, q2, q3, q4, c);
    this.boxLine1 = this.addLine(p1, q1, c);
    this.boxLine2 = this.addLine(p2, q2, c);
    this.boxLine3 = this.addLine(p3, q3, c);
    this.boxLine4 = this.addLine(p4, q4, c);
  }

  private createAxes(): void {
    this.addLine(new Vector3(-1000, 0, 0), new Vector3(1000, 0, 0), 0xff0000);
    this.addLine(new Vector3(0, -1000, 0), new Vector3(0, 1000, 0), 0x00ff00);
    this.addLine(new Vector3(0, 0, -1000), new Vector3(0, 0, 1000), 0x0000ff);
  }

  private addRectangle(p1: Vector3, p2: Vector3, p3: Vector3, p4: Vector3, c: number): Line {
    let line = new Line(new BufferGeometry().setFromPoints([p1, p2, p3, p4, p1]), new LineBasicMaterial({color: c}));
    this.scene.add(line);
    return line;
  }

  private addLine(p1: Vector3, p2: Vector3, c: number): Line {
    let line = new Line(new BufferGeometry().setFromPoints([p1, p2]), new LineBasicMaterial({color: c}));
    this.scene.add(line);
    return line;
  }

  private addArrow(p: Vector3, c: number, r: number, axis: string): Mesh {
    let cone = new Mesh(new ConeGeometry(r, 4 * r, 8), new MeshBasicMaterial({
      transparent: true,
      opacity: 0.5,
      color: c
    }));
    cone.position.copy(p);
    switch (axis) {
      case "x":
        cone.rotation.z = -Math.PI / 2;
        break;
      case "y":
        // no need to do anything - already pointing to the right direction
        break;
      case "z":
        cone.rotation.x = Math.PI / 2;
        break;
    }
    this.scene.add(cone);
    return cone;
  }

  private addSprite(fontSize: number, offset: number, p: Vector3, color: string, axis: string): TextSprite {
    let sprite;
    switch (axis) {
      case "x":
        sprite = new TextSprite({
          fillStyle: color,
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: fontSize,
          fontStyle: 'italic',
          text: this.xAxisLabel
        });
        p.x += offset;
        p.y += offset;
        break;
      case "y":
        sprite = new TextSprite({
          fillStyle: color,
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: fontSize,
          fontStyle: 'italic',
          text: this.yAxisLabel
        });
        p.y += offset;
        p.z += offset;
        break;
      case "z":
        sprite = new TextSprite({
          fillStyle: color,
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: fontSize,
          fontStyle: 'italic',
          text: this.zAxisLabel
        });
        p.z += offset;
        p.x += offset;
        break;
    }
    sprite.position.copy(p);
    this.scene.add(sprite);
    return sprite;
  }

  setXAxisLabel(xAxisLabel: string): void {
    this.xAxisLabel = xAxisLabel;
    if (this.xAxisArrow !== undefined) {
      if (this.isSceneChild(this.xLabelSprite)) this.scene.remove(this.xLabelSprite);
      let c = Util.isDarkish(this.backgroundColor) ? "white" : "black";
      this.xLabelSprite = this.addSprite(this.fontSize, this.offset, this.xAxisArrow.position, c, "x");
    }
  }

  getXAxisLabel(): string {
    return this.xAxisLabel;
  }

  setYAxisLabel(yAxisLabel: string): void {
    this.yAxisLabel = yAxisLabel;
    if (this.yAxisArrow !== undefined) {
      if (this.isSceneChild(this.yLabelSprite)) this.scene.remove(this.yLabelSprite);
      let c = Util.isDarkish(this.backgroundColor) ? "white" : "black";
      this.yLabelSprite = this.addSprite(this.fontSize, this.offset, this.yAxisArrow.position, c, "y");
    }
  }

  getYAxisLabel(): string {
    return this.yAxisLabel;
  }

  setZAxisLabel(zAxisLabel: string): void {
    this.zAxisLabel = zAxisLabel;
    if (this.zAxisArrow !== undefined) {
      if (this.isSceneChild(this.zLabelSprite)) this.scene.remove(this.zLabelSprite);
      let c = Util.isDarkish(this.backgroundColor) ? "white" : "black";
      this.zLabelSprite = this.addSprite(this.fontSize, this.offset, this.zAxisArrow.position, c, "z");
    }
  }

  getZAxisLabel(): string {
    return this.zAxisLabel;
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
    if (x !== undefined) {
      for (let c of this.scene.children) {
        if (c === x) return true;
      }
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
