/*
 * @author Charles Xie
 */

import {
  AmbientLight, Box3,
  BufferGeometry,
  ConeGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer
} from "three";
import TextSprite from '@seregpie/three.text-sprite';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import {Util} from "../Util";

export abstract class Basic3D {

  protected boxSize: number = 0; // zero means no box
  protected boxSizeX: number = 0;
  protected boxSizeY: number = 0;
  protected boxSizeZ: number = 0;
  protected boxBottomFace: Line;
  protected boxTopFace: Line;
  protected boxLine1: Line;
  protected boxLine2: Line;
  protected boxLine3: Line;
  protected boxLine4: Line;
  protected xAxisArrow: Mesh;
  protected yAxisArrow: Mesh;
  protected zAxisArrow: Mesh;
  protected xLabelSprite: TextSprite;
  protected yLabelSprite: TextSprite;
  protected zLabelSprite: TextSprite;
  protected xAxisLabel: string = "x";
  protected yAxisLabel: string = "y";
  protected zAxisLabel: string = "z";
  protected backgroundColor: string = "white";
  protected axisLabelFontSize: number = 0.5;
  protected axisLabelOffset: number = 0;
  protected scene: Scene;
  protected camera: PerspectiveCamera;
  protected renderer: WebGLRenderer;
  protected orbitControls: OrbitControls;
  protected trackballControls: TrackballControls;
  protected boundingBox: Box3;

  constructor() {
    this.scene = new Scene();
    this.createAxes();
    this.drawAxisArrowsAndLabels();
    this.renderer = new WebGLRenderer({alpha: true, antialias: true, preserveDrawingBuffer: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(500, 500);
    this.camera = new PerspectiveCamera(45, 1, 0.1, 10000);
    this.setCameraPosition(0, 0, 10, 1, 1, 1);
    this.setControlType("Orbit");
    this.createLights();
  }

  destroy(): void {
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
    if (this.orbitControls !== undefined) this.orbitControls.dispose();
    if (this.trackballControls !== undefined) this.trackballControls.dispose();
  }

  setControlType(controlType: string) {
    switch (controlType) {
      case "Orbit":
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.addEventListener('change', () => {
          this.render(); // re-render if controls move/zoom
        });
        this.orbitControls.enableZoom = true;
        if (this.trackballControls !== undefined) {
          this.trackballControls.dispose();
          this.trackballControls = undefined;
        }
        break;
      case "Trackball": // TODO: Trackball requires an animation loop, which is an overhead for static scenes
        this.trackballControls = new TrackballControls(this.camera, this.renderer.domElement);
        this.trackballControls.addEventListener('change', () => {
          this.render(); // re-render if controls move/zoom
        });
        if (this.orbitControls !== undefined) {
          this.orbitControls.dispose();
          this.orbitControls = undefined;
        }
        break;
    }
  }

  setBackgroundColor(color: string): void {
    this.backgroundColor = color;
    let c = Util.isDarkish(this.backgroundColor) ? "white" : "black";
    if (this.xAxisLabel !== undefined) {
      this.xLabelSprite.fillStyle = c;
    }
    if (this.yAxisLabel !== undefined) {
      this.yLabelSprite.fillStyle = c;
    }
    if (this.zAxisLabel !== undefined) {
      this.zLabelSprite.fillStyle = c;
    }
    this.renderer.setClearColor(color, 1);
  }

  getBackgroundColor(): string {
    return this.backgroundColor;
  }

  protected drawAxisArrowsAndLabels(): void {
    this.removeArrows();
    this.removeSprites();
    let p;
    let r;
    if (this.boxSize > 0) {
      p = this.boxSize;
      r = this.boxSize * 0.02;
    } else {
      if (this.boundingBox !== undefined) {
        let xmin = Math.abs(this.boundingBox.min.x);
        let ymin = Math.abs(this.boundingBox.min.y);
        let zmin = Math.abs(this.boundingBox.min.z);
        let xmax = Math.abs(this.boundingBox.max.x);
        let ymax = Math.abs(this.boundingBox.max.y);
        let zmax = Math.abs(this.boundingBox.max.z);
        if (xmin > p) p = xmin;
        if (ymin > p) p = ymin;
        if (zmin > p) p = zmin;
        if (xmax > p) p = xmax;
        if (ymax > p) p = ymax;
        if (zmax > p) p = zmax;
        p = p * 1.2;
        r = p * 0.02;
      } else {
        p = 50;
        r = 1;
      }
    }
    let xArrow = new Vector3(p, 0, 0);
    let yArrow = new Vector3(0, p, 0);
    let zArrow = new Vector3(0, 0, p);
    this.xAxisArrow = this.addArrow(xArrow, 0xff0000, r, "x");
    this.yAxisArrow = this.addArrow(yArrow, 0x00ff00, r, "y");
    this.zAxisArrow = this.addArrow(zArrow, 0x0000ff, r, "z");
    this.axisLabelFontSize = p * 0.1;
    this.axisLabelOffset = this.axisLabelFontSize / 2;
    let c = Util.isDarkish(this.backgroundColor) ? "white" : "black";
    this.xLabelSprite = this.addSprite(this.axisLabelFontSize, this.axisLabelOffset, xArrow, c, "x");
    this.yLabelSprite = this.addSprite(this.axisLabelFontSize, this.axisLabelOffset, yArrow, c, "y");
    this.zLabelSprite = this.addSprite(this.axisLabelFontSize, this.axisLabelOffset, zArrow, c, "z");
  }

  setBoxSizes(boxSizeX: number, boxSizeY: number, boxSizeZ: number): void {
    this.removeBox();
    this.boxSizeX = boxSizeX;
    this.boxSizeY = boxSizeY;
    this.boxSizeZ = boxSizeZ;
    if (boxSizeX > 0 && boxSizeY > 0 && boxSizeZ > 0) {
      this.createBox(boxSizeX / 2, boxSizeY / 2, boxSizeZ / 2, 0xcccccc);
    }
    this.drawAxisArrowsAndLabels();
  }

  getBoxSizeX(): number {
    return this.boxSizeX;
  }

  getBoxSizeY(): number {
    return this.boxSizeY;
  }

  getBoxSizeZ(): number {
    return this.boxSizeZ;
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

  private createBox(ax: number, ay: number, az: number, c: number): void {
    let p1 = new Vector3(-ax, -ay, -az);
    let p2 = new Vector3(-ax, ay, -az);
    let p3 = new Vector3(ax, ay, -az);
    let p4 = new Vector3(ax, -ay, -az);
    let q1 = new Vector3(-ax, -ay, az);
    let q2 = new Vector3(-ax, ay, az);
    let q3 = new Vector3(ax, ay, az);
    let q4 = new Vector3(ax, -ay, az);
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
    let cone = new Mesh(new ConeGeometry(r / 2, 4 * r, 8), new MeshBasicMaterial({
      transparent: true,
      opacity: 0.9,
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
  }

  getXAxisLabel(): string {
    return this.xAxisLabel;
  }

  setYAxisLabel(yAxisLabel: string): void {
    this.yAxisLabel = yAxisLabel;
  }

  getYAxisLabel(): string {
    return this.yAxisLabel;
  }

  setZAxisLabel(zAxisLabel: string): void {
    this.zAxisLabel = zAxisLabel;
  }

  getZAxisLabel(): string {
    return this.zAxisLabel;
  }

  private createLights(): void {
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
    if (this.orbitControls !== undefined) this.orbitControls.reset();
    if (this.trackballControls !== undefined) this.trackballControls.reset();
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
