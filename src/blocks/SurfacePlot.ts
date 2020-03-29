/*
 * @author Charles Xie
 */

import * as d3 from 'd3';
// @ts-ignore
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export class SurfacePlot {

  private xgrid: number[];
  private ygrid: number[];
  private values: number[];
  private interpolateColor = d3.interpolateTurbo;

  private scene: THREE.Scene;
  private geometry: THREE.Geometry;
  private material: THREE.Material;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  constructor() {
    this.scene = new THREE.Scene();
    this.geometry = new THREE.Geometry();
    this.material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      color: 0xffffff,
      vertexColors: true,
      specular: 0x050505,
      shininess: 1,
      emissive: 0x111111,
    });
    this.scene.add(new THREE.Mesh(this.geometry, this.material));
    this.createAxes();
    this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true, preserveDrawingBuffer: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(500, 500);
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    this.camera.position.z = 10;
    let controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.addEventListener('change', () => {
      this.renderer.render(this.scene, this.camera); // re-render if controls move/zoom
    });
    controls.enableZoom = true;
    this.createLights();
  }

  setBackgroundColor(color: string): void {
    this.renderer.setClearColor(color, 1);
  }

  setInterpolateColorScheme(scheme: string): void {
    switch (scheme) {
      case "Turbo":
        this.interpolateColor = d3.interpolateTurbo;
        break;
      case "Spectral":
        this.interpolateColor = d3.interpolateSpectral;
        break;
    }
  }

  setData(x0: number, y0: number, dx: number, dy: number, nx: number, ny: number, data: number[], scaleType: string) {
    let n = nx * ny;
    if (this.xgrid === undefined || this.xgrid.length !== n) {
      this.xgrid = new Array(n);
    }
    if (this.ygrid === undefined || this.ygrid.length !== n) {
      this.ygrid = new Array(n);
    }
    if (this.xgrid[0] === undefined || this.xgrid[0] !== x0 || this.xgrid[1] - this.xgrid[0] !== dx) {
      for (let j = 0, k = 0; j < ny; ++j) {
        for (let i = 0; i < nx; ++i, ++k) {
          this.xgrid[k] = x0 + i * dx;
        }
      }
    }
    if (this.ygrid[0] === undefined || this.ygrid[0] !== y0 || this.ygrid[1] - this.ygrid[0] !== dy) {
      for (let j = 0, k = 0; j < ny; ++j) {
        for (let i = 0; i < nx; ++i, ++k) {
          this.ygrid[k] = y0 + j * dy;
        }
      }
    }
    this.values = data;

    this.geometry.vertices.length = 0;
    switch (scaleType) {
      case "Logarithmic":
        let zmin = d3.min(this.values);
        for (let k = 0; k < n; k++) {
          this.geometry.vertices.push(new THREE.Vector3(this.xgrid[k], this.ygrid[k], Math.log(this.values[k] - zmin + 1)));
        }
        break;
      default:
        for (let k = 0; k < n; k++) {
          this.geometry.vertices.push(new THREE.Vector3(this.xgrid[k], this.ygrid[k], this.values[k]));
        }
        break;
    }

    // use d3 for color scale
    let color = d3.scaleLinear().domain(d3.extent(this.values)).interpolate(() => {
      return this.interpolateColor;
    });

    // add cell faces (2 traingles per cell) to geometry
    for (let j = 0; j < ny - 1; j++) {
      for (let i = 0; i < nx - 1; i++) {
        let n0 = j * nx + i;
        let n1 = n0 + 1;
        let n2 = (j + 1) * nx + i + 1;
        let n3 = n2 - 1;
        let face1 = new THREE.Face3(n0, n1, n2);
        let face2 = new THREE.Face3(n2, n3, n0);
        face1.vertexColors[0] = new THREE.Color(color(this.values[n0]));
        face1.vertexColors[1] = new THREE.Color(color(this.values[n1]));
        face1.vertexColors[2] = new THREE.Color(color(this.values[n2]));
        face2.vertexColors[0] = new THREE.Color(color(this.values[n2]));
        face2.vertexColors[1] = new THREE.Color(color(this.values[n3]));
        face2.vertexColors[2] = new THREE.Color(color(this.values[n0]));
        this.geometry.faces.push(face1);
        this.geometry.faces.push(face2);
      }
    }

    // compute normals for shading
    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();

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

}
