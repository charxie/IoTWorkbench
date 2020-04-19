/*
 * @author Charles Xie
 */

import {
  BoxBufferGeometry,
  BufferGeometry,
  Color,
  ConeBufferGeometry,
  CylinderBufferGeometry,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  Matrix4,
  Mesh,
  MeshPhongMaterial,
  SphereBufferGeometry,
  TetrahedronBufferGeometry,
  TextureLoader,
  Vector3
} from "three";
import {Point3DArray} from "./Point3DArray";
import {Symbol3DArray} from "./Symbol3DArray";
import {MeshLine, MeshLineMaterial} from 'threejs-meshline';
import {Basic3D} from "./Basic3D";

export class LinePlot extends Basic3D {

  lineTypes: string[] = [];
  lineColors: string[] = [];
  lineWidths: number[] = [];
  dataSymbols: string[] = [];
  dataSymbolRadii: number[] = [];
  dataSymbolColors: string[] = [];
  dataSymbolSpacings: number[] = [];
  endSymbolRadii: number[] = [];
  endSymbolConnections: string[] = [];

  private points: Point3DArray[] = [];
  private numberOfDataPoints: number = 0;
  private lines: Line[];
  private symbols: Symbol3DArray[] = [];
  private endSymbols: Mesh[];
  private endSymbolConnectors: Mesh[];
  private endSymbolTextureData: string[] = [];

  constructor() {
    super();
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
    this.endSymbols[0].geometry = new SphereBufferGeometry(0.5, 32, 32);
    this.endSymbols[0].material = new MeshPhongMaterial({
      color: "dimgray",
      specular: 0x050505,
      shininess: 0.1
    });
    //this.scene.add(this.endSymbols[0]);
  }

  erase(): void {
    if (this.points !== undefined) {
      for (let p of this.points) {
        p.clear();
      }
    }
  }

  destroy(): void {
    super.destroy();
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
    this.scene.dispose();
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
    endSymbol.geometry = new SphereBufferGeometry(0.01, 32, 32);
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
        this.endSymbolConnectors[j].geometry = new CylinderBufferGeometry(0.05, 0.05, h, 5);
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
      this.endSymbols[i].geometry = new SphereBufferGeometry(r, 16, 16);
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

  private getSymbolGeometry(i: number, r: number): BufferGeometry {
    switch (this.dataSymbols[i]) {
      case "Sphere":
        return new SphereBufferGeometry(r, 8, 8);
      case "Cube":
        let l = r * 2;
        return new BoxBufferGeometry(l, l, l);
      case "Cone":
        return new ConeBufferGeometry(r, 2 * r, 8);
      case "Cylinder":
        return new CylinderBufferGeometry(r, r, 2 * r, 8);
      case "Tetrahedron":
        return new TetrahedronBufferGeometry(r);
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
    let g: BufferGeometry = this.getSymbolGeometry(i, this.dataSymbolRadii[i]);
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

}
