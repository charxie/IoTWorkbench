/*
 * @author Charles Xie
 */

// @ts-ignore
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as d3 from 'd3';

export class SurfacePlot {

  private xgrid: number[];
  private ygrid: number[];
  private values: number[];
  private scaledValues: number[];
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
    if (this.scaledValues === undefined || this.scaledValues.length !== this.values.length) {
      this.scaledValues = new Array(this.values.length);
    }

    this.geometry.vertices.length = 0;
    let zmin = d3.min(this.values);
    let zmax = d3.max(this.values);
    switch (scaleType) {
      case "Logarithmic":
        if (zmin !== zmax) {
          let scale = 1 / Math.log(zmax - zmin + 1);
          let tmp;
          for (let k = 0; k < n; k++) {
            tmp = Math.log((this.values[k] - zmin + 1));
            this.scaledValues[k] = tmp * scale;
            this.geometry.vertices.push(new THREE.Vector3(this.xgrid[k], this.ygrid[k], tmp));
          }
        } else {
          for (let k = 0; k < n; k++) {
            this.scaledValues[k] = this.values[k];
            this.geometry.vertices.push(new THREE.Vector3(this.xgrid[k], this.ygrid[k], this.values[k]));
          }
        }
        break;
      default:
        if (zmin !== zmax) {
          let scale = 1 / (zmax - zmin);
          for (let k = 0; k < n; k++) {
            this.scaledValues[k] = (this.values[k] - zmin) * scale;
            this.geometry.vertices.push(new THREE.Vector3(this.xgrid[k], this.ygrid[k], this.values[k]));
          }
        } else {
          for (let k = 0; k < n; k++) {
            this.scaledValues[k] = this.values[k];
            this.geometry.vertices.push(new THREE.Vector3(this.xgrid[k], this.ygrid[k], this.values[k]));
          }
        }
        break;
    }

    // scale values to (0, 1) for coloring
    let color = d3.scaleLinear().domain(d3.extent(this.scaledValues)).interpolate(() => {
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
        face1.vertexColors[0] = new THREE.Color(color(this.scaledValues[n0]));
        face1.vertexColors[1] = new THREE.Color(color(this.scaledValues[n1]));
        face1.vertexColors[2] = new THREE.Color(color(this.scaledValues[n2]));
        face2.vertexColors[0] = new THREE.Color(color(this.scaledValues[n2]));
        face2.vertexColors[1] = new THREE.Color(color(this.scaledValues[n3]));
        face2.vertexColors[2] = new THREE.Color(color(this.scaledValues[n0]));
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

  setBackgroundColor(color: string): void {
    this.renderer.setClearColor(color, 1);
  }

  setInterpolateColorScheme(scheme: string): void {
    switch (scheme) {
      case "YlOrRd":
        this.interpolateColor = d3.interpolateYlOrRd;
        break;
      case "YlOrBr":
        this.interpolateColor = d3.interpolateYlOrBr;
        break;
      case "YlPuRd":
        this.interpolateColor = d3.interpolateYlPuRd;
        break;
      case "YlRdPu":
        this.interpolateColor = d3.interpolateYlRdPu;
        break;
      case "YlGnBu":
        this.interpolateColor = d3.interpolateYlGnBu;
        break;
      case "YlGn":
        this.interpolateColor = d3.interpolateYlGn;
        break;
      case "BuGn":
        this.interpolateColor = d3.interpolateBuGn;
        break;
      case "OrRd":
        this.interpolateColor = d3.interpolateOrRd;
        break;
      case "GnBu":
        this.interpolateColor = d3.interpolateGnBu;
        break;
      case "BuPu":
        this.interpolateColor = d3.interpolateBuPu;
        break;
      case "PuBu":
        this.interpolateColor = d3.interpolatePuBu;
        break;
      case "PuBuGn":
        this.interpolateColor = d3.interpolatePuBuGn;
        break;
      case "Rainbow":
        this.interpolateColor = d3.interpolateRainbow;
        break;
      case "Sinebow":
        this.interpolateColor = d3.interpolateSinebow;
        break;
      case "Cubehelix":
        this.interpolateColor = d3.interpolateCubehelixDefault;
        break;
      case "Warm":
        this.interpolateColor = d3.interpolateWarm;
        break;
      case "Cool":
        this.interpolateColor = d3.interpolateCool;
        break;
      case "Cividis":
        this.interpolateColor = d3.interpolateCividis;
        break;
      case "Viridis":
        this.interpolateColor = d3.interpolateViridis;
        break;
      case "Spectral":
        this.interpolateColor = d3.interpolateSpectral;
        break;
      case "Inferno":
        this.interpolateColor = d3.interpolateInferno;
        break;
      case "Magma":
        this.interpolateColor = d3.interpolateMagma;
        break;
      case "Plasma":
        this.interpolateColor = d3.interpolatePlasma;
        break;
      default:
        this.interpolateColor = d3.interpolateTurbo;
        break;
    }
  }

}
