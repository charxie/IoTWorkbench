/*
 * @author Charles Xie
 */

import {
  AmbientLight,
  Box3,
  BufferGeometry,
  ConeBufferGeometry,
  DirectionalLight,
  Light,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Quaternion,
  Scene,
  Vector3,
  WebGLRenderer
} from "three";
import TextSprite from '@seregpie/three.text-sprite';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import {Util} from "../Util";

export abstract class Basic3D {

  private backgroundColor: string = "white";
  private axisLabelFontSize: number = 0.5;
  private axisLabelOffset: number = 0;
  protected scene: Scene;
  protected camera: PerspectiveCamera;
  protected renderer: WebGLRenderer;
  protected orbitControls: OrbitControls;
  protected trackballControls: TrackballControls;

  private boxSizeX: number = 0; // zero means no box
  private boxSizeY: number = 0;
  private boxSizeZ: number = 0;
  private xLabelSprite: TextSprite;
  private yLabelSprite: TextSprite;
  private zLabelSprite: TextSprite;
  private xAxisLabel: string = "x";
  private yAxisLabel: string = "y";
  private zAxisLabel: string = "z";
  private xAxisArrow: Mesh;
  private yAxisArrow: Mesh;
  private zAxisArrow: Mesh;
  private boxBottomFace: Line;
  private boxTopFace: Line;
  private boxLine1: Line;
  private boxLine2: Line;
  private boxLine3: Line;
  private boxLine4: Line;
  private boundingBox: Box3;
  private cameraLight: Light;
  private controlType: string = "Orbit";
  private requestInertiaId: number;
  private requestSpinId: number;
  private spinStep: number = 0.01 * Math.PI;
  private spinAxis: Vector3 = new Vector3(0, 1, 0);

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
    this.stopInertia();
  }

  setControlType(controlType: string) {
    this.controlType = controlType;
    if (this.orbitControls !== undefined) {
      this.orbitControls.dispose();
      this.orbitControls = undefined;
    }
    if (this.trackballControls !== undefined) {
      this.trackballControls.dispose();
      this.trackballControls = undefined;
    }
    switch (controlType) {
      case "Orbit":
        this.stopInertia();
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.05;
        this.orbitControls.addEventListener('change', () => {
          this.render(); // re-render if controls move/zoom
        });
        this.orbitControls.enableZoom = true;
        break;
      case "Trackball": // Trackball requires an animation loop, which is an overhead for static scenes
        this.trackballControls = new TrackballControls(this.camera, this.renderer.domElement);
        this.trackballControls.dynamicDampingFactor = 0.1;
        this.startInertia();
        break;
    }
  }

  getControlType(): string {
    return this.controlType;
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
    if (this.boxSizeX > 0 && this.boxSizeY > 0 && this.boxSizeZ > 0) {
      p = Math.min(this.boxSizeX, this.boxSizeY, this.boxSizeZ);
      r = p * 0.02;
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
    let cone = new Mesh(new ConeBufferGeometry(r / 2, 4 * r, 8), new MeshBasicMaterial({
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
    this.cameraLight = new DirectionalLight(0xffffff, 1);
    this.cameraLight.position.set(0, 0, 10);
    // this.camera.add(this.cameraLight); // adding cameraLight to camera doesn't seem to work for me
    this.scene.add(this.cameraLight);
    this.scene.add(new AmbientLight(0x666666));
  }

  render(): void {
    this.cameraLight.position.copy(this.camera.position); // adding cameraLight to camera doesn't seem to work for me
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
    switch (this.controlType) {
      case "Orbit":
        if (this.orbitControls !== undefined) this.orbitControls.reset();
        break;
      case "Trackball":
        if (this.trackballControls !== undefined) this.trackballControls.reset();
        break;
    }
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

  setSpinStep(spinStep: number): void {
    this.spinStep = spinStep;
  }

  getSpinStep(): number {
    return this.spinStep;
  }

  stopSpin(): void {
    if (this.requestSpinId) {
      cancelAnimationFrame(this.requestSpinId);
      this.requestSpinId = undefined;
    }
  }

  startSpin(): void {
    if (!this.requestSpinId) {
      this.requestSpinId = requestAnimationFrame(() => this.animateSpin());
    }
  }

  private animateSpin(): void {
    this.camera.position.applyQuaternion(new Quaternion().setFromAxisAngle(this.spinAxis, this.spinStep));
    this.camera.lookAt(this.scene.position);
    this.requestSpinId = undefined;
    this.render();
    this.startSpin();
  }

  stopInertia(): void {
    if (this.requestInertiaId) {
      cancelAnimationFrame(this.requestInertiaId);
      this.requestInertiaId = undefined;
    }
  }

  startInertia(): void {
    if (!this.requestInertiaId) {
      this.requestInertiaId = requestAnimationFrame(() => this.animateInertia());
    }
  }

  private animateInertia(): void {
    this.requestInertiaId = undefined;
    // only required if controls.enableDamping = true, or if controls.autoRotate = true
    switch (this.controlType) {
      case "Orbit":
        if (this.orbitControls !== undefined && this.orbitControls.enabled) {
          this.orbitControls.update();
        }
        break;
      case "Trackball":
        if (this.trackballControls !== undefined && this.trackballControls.enabled) {
          this.trackballControls.update();
        }
        break;
    }
    this.render();
    this.startInertia();
  }

}
