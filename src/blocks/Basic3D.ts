/*
 * @author Charles Xie
 */

import {
  AmbientLight,
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

  constructor() {
    this.scene = new Scene();
    this.createAxes();
    this.renderer = new WebGLRenderer({alpha: true, antialias: true, preserveDrawingBuffer: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(500, 500);
    this.camera = new PerspectiveCamera(45, 1, 0.1, 10000);
    this.setCameraPosition(0, 0, 10, 1, 1, 1);
    this.setControlType("Orbit");
    this.createLights();
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
    this.axisLabelFontSize = p * 0.1;
    this.axisLabelOffset = this.axisLabelFontSize / 2;
    let c = Util.isDarkish(this.backgroundColor) ? "white" : "black";
    this.xLabelSprite = this.addSprite(this.axisLabelFontSize, this.axisLabelOffset, xArrow, c, "x");
    this.yLabelSprite = this.addSprite(this.axisLabelFontSize, this.axisLabelOffset, yArrow, c, "y");
    this.zLabelSprite = this.addSprite(this.axisLabelFontSize, this.axisLabelOffset, zArrow, c, "z");
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
      this.xLabelSprite = this.addSprite(this.axisLabelFontSize, this.axisLabelOffset, this.xAxisArrow.position, c, "x");
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
      this.yLabelSprite = this.addSprite(this.axisLabelFontSize, this.axisLabelOffset, this.yAxisArrow.position, c, "y");
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
      this.zLabelSprite = this.addSprite(this.axisLabelFontSize, this.axisLabelOffset, this.zAxisArrow.position, c, "z");
    }
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

  abstract destroy(): void;

}
