/*
 * @author Charles Xie
 */

// @ts-ignore
import * as d3 from 'd3';
import {Basic3D} from "./Basic3D";
import {Color, DoubleSide, Face3, Geometry, Material, Mesh, MeshPhongMaterial, Vector3} from "three";
import {ColorSchemes} from "./ColorSchemes";

export class SurfacePlot extends Basic3D {

  private xgrid: number[];
  private ygrid: number[];
  private values: number[];
  private scaledValues: number[];
  private interpolateColor = d3.interpolateTurbo;

  private mesh: Mesh;
  private geometry: Geometry;
  private material: Material;

  constructor() {
    super();
    this.geometry = new Geometry();
    // let wireframeTexture = new THREE.TextureLoader().load(squareImage);
    // wireframeTexture.wrapS = THREE.RepeatWrapping;
    // wireframeTexture.wrapT = THREE.RepeatWrapping;
    // wireframeTexture.repeat.set(40, 40);
    this.material = new MeshPhongMaterial({
      side: DoubleSide,
      color: 0xffffff,
      vertexColors: true,
      transparent: true,
      //opacity: 0.5,
      //map: wireframeTexture,
      specular: 0x050505,
      shininess: 1,
      emissive: 0x111111
    });
    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  destroy() {
    super.destroy();
    this.geometry.dispose();
    this.material.dispose();
    this.scene.remove(this.mesh);
    this.scene.dispose();
  }

  setXyzData(nu: number, nv: number, dataX: number[], dataY: number[], dataZ: number[], scaleType: string): void {
    // somehow we have to remove the mesh, recreate the geometry, and re-add them back to the scene to chnage the colors
    this.scene.remove(this.mesh);
    this.geometry.dispose();
    this.geometry = new Geometry();
    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    for (let k = 0; k < dataX.length; k++) {
      this.geometry.vertices.push(new Vector3(dataX[k], dataY[k], dataZ[k]));
    }

    // scale values to (0, 1) for coloring
    let color = d3.scaleLinear().domain(d3.extent(dataZ)).interpolate(() => this.interpolateColor);

    // add cell faces (2 traingles per cell) to geometry
    for (let j = 0; j < nv - 1; j++) {
      for (let i = 0; i < nu - 1; i++) {
        let n0 = j * nu + i;
        let n1 = n0 + 1;
        let n2 = (j + 1) * nu + i + 1;
        let n3 = n2 - 1;
        let face1 = new Face3(n0, n1, n2);
        let face2 = new Face3(n2, n3, n0);
        face1.vertexColors[0] = new Color(color(dataZ[n0]));
        face1.vertexColors[1] = new Color(color(dataZ[n1]));
        face1.vertexColors[2] = new Color(color(dataZ[n2]));
        face2.vertexColors[0] = new Color(color(dataZ[n2]));
        face2.vertexColors[1] = new Color(color(dataZ[n3]));
        face2.vertexColors[2] = new Color(color(dataZ[n0]));
        this.geometry.faces.push(face1);
        this.geometry.faces.push(face2);
      }
    }

    // compute normals for shading
    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();
    // this.geometry.computeBoundingBox();
    // this.boundingBox = this.geometry.boundingBox;
    // this.drawAxisArrowsAndLabels();
  }

  setZData(x0: number, y0: number, dx: number, dy: number, nx: number, ny: number, data: number[], scaleType: string): void {
    // somehow we have to remove the mesh, recreate the geometry, and re-add them back to the scene to chnage the colors
    this.scene.remove(this.mesh);
    this.geometry.dispose();
    this.geometry = new Geometry();
    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

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
            this.geometry.vertices.push(new Vector3(this.xgrid[k], this.ygrid[k], tmp));
          }
        } else {
          for (let k = 0; k < n; k++) {
            this.scaledValues[k] = this.values[k];
            this.geometry.vertices.push(new Vector3(this.xgrid[k], this.ygrid[k], this.values[k]));
          }
        }
        break;
      default:
        if (zmin !== zmax) {
          let scale = 1 / (zmax - zmin);
          for (let k = 0; k < n; k++) {
            this.scaledValues[k] = (this.values[k] - zmin) * scale;
            this.geometry.vertices.push(new Vector3(this.xgrid[k], this.ygrid[k], this.values[k]));
          }
        } else {
          for (let k = 0; k < n; k++) {
            this.scaledValues[k] = this.values[k];
            this.geometry.vertices.push(new Vector3(this.xgrid[k], this.ygrid[k], this.values[k]));
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
        let face1 = new Face3(n0, n1, n2);
        let face2 = new Face3(n2, n3, n0);
        face1.vertexColors[0] = new Color(color(this.scaledValues[n0]));
        face1.vertexColors[1] = new Color(color(this.scaledValues[n1]));
        face1.vertexColors[2] = new Color(color(this.scaledValues[n2]));
        face2.vertexColors[0] = new Color(color(this.scaledValues[n2]));
        face2.vertexColors[1] = new Color(color(this.scaledValues[n3]));
        face2.vertexColors[2] = new Color(color(this.scaledValues[n0]));
        this.geometry.faces.push(face1);
        this.geometry.faces.push(face2);
      }
    }

    // compute normals for shading
    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();
  }

  setInterpolateColorScheme(scheme: string): void {
    this.interpolateColor = ColorSchemes.getInterpolateColorScheme(scheme);
  }

}
