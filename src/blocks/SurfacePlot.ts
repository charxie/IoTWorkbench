/*
 * @author Charles Xie
 */

import * as d3 from 'd3';
// @ts-ignore
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export class SurfacePlot {

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  constructor() {

    this.scene = new THREE.Scene();

    // Structured (n * m) grid of data. Point coordinates are (xgrid, ygrid)
    var n = 101, m = 101;
    var nverts = n * m;
    var values = new Array(n * m);
    var xgrid = new Array(n * m);
    var ygrid = new Array(n * m);
    for (var j = 0., k = 0; j < m; ++j) {
      for (var i = 0.; i < n; ++i, ++k) {
        xgrid[k] = -5 + i * 0.1;
        ygrid[k] = -5 + j * 0.1;
        let x2 = xgrid[k] * xgrid[k] + ygrid[k] - 11;
        let y2 = xgrid[k] + ygrid[k] * ygrid[k] - 7;
        values[k] = x2 * x2 + y2 * y2;
      }
    }

    // Obtain centre of grid and scale factors
    var xmin = d3.min(xgrid);
    var xmax = d3.max(xgrid);
    var xmid = 0.5 * (xmin + xmax);
    var xrange = xmax - xmin;

    var ymin = d3.min(ygrid);
    var ymax = d3.max(ygrid);
    var ymid = 0.5 * (ymin + ymax);
    var yrange = ymax - ymin;

    var zmin = d3.min(values);
    var zmax = d3.max(values);
    var zmid = 0.5 * (zmin + zmax);
    var zrange = zmax - zmin;

    const scaleX = 1 / xrange;
    const scaleY = 1 / yrange;
    const scaleZ = 1 / zrange;

    // Use d3 for color scale
    let color = d3.scaleLinear().domain(d3.extent(values)).interpolate(() => {
      return d3.interpolateTurbo;
    });

    // Initialise threejs geometry
    let geometry = new THREE.Geometry();

    // Add grid vertices to geometry
    for (var k = 0; k < nverts; ++k) {
      var newvert = new THREE.Vector3((xgrid[k] - xmid) * scaleX, (ygrid[k] - ymid) * scaleY, (values[k] - zmid) * scaleZ);
      geometry.vertices.push(newvert);
    }

    // Add cell faces (2 traingles per cell) to geometry
    for (var j = 0; j < m - 1; j++) {
      for (var i = 0; i < n - 1; i++) {
        var n0 = j * n + i;
        var n1 = n0 + 1;
        var n2 = (j + 1) * n + i + 1;
        var n3 = n2 - 1;
        let face1 = new THREE.Face3(n0, n1, n2);
        let face2 = new THREE.Face3(n2, n3, n0);
        face1.vertexColors[0] = new THREE.Color(color(values[n0]));
        face1.vertexColors[1] = new THREE.Color(color(values[n1]));
        face1.vertexColors[2] = new THREE.Color(color(values[n2]));
        face2.vertexColors[0] = new THREE.Color(color(values[n2]));
        face2.vertexColors[1] = new THREE.Color(color(values[n3]));
        face2.vertexColors[2] = new THREE.Color(color(values[n0]));
        geometry.faces.push(face1);
        geometry.faces.push(face2);
      }
    }

    // Compute normals for shading
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    //let material = new THREE.MeshStandardMaterial({color: 0xcccccc, roughness: 0.1, metalness: 0.1});
    let material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      color: 0xffffff,
      vertexColors: true,
      specular: 0x050505,
      shininess: 10,
      emissive: 0x111111,
    });

    // Add Mesh to scene
    this.scene.add(new THREE.Mesh(geometry, material));

    // draw the three axes
    let points = [];
    points.push(new THREE.Vector3(-10, 0, 0));
    points.push(new THREE.Vector3(10, 0, 0));
    let lineMaterial = new THREE.LineBasicMaterial({color: 0xff0000});
    let lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    let xAxis = new THREE.Line(lineGeometry, lineMaterial);
    this.scene.add(xAxis);

    points = [];
    points.push(new THREE.Vector3(0, -10, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    lineMaterial = new THREE.LineBasicMaterial({color: 0x00ff00});
    lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    let yAxis = new THREE.Line(lineGeometry, lineMaterial);
    this.scene.add(yAxis);

    points = [];
    points.push(new THREE.Vector3(0, 0, -10));
    points.push(new THREE.Vector3(0, 0, 10));
    lineMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});
    lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    let zAxis = new THREE.Line(lineGeometry, lineMaterial);
    this.scene.add(zAxis);

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(300, 300);

    // Define the camera
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10);
    this.camera.position.z = 2;

    // Add controls
    let controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.addEventListener('change', () => {
      this.renderer.render(this.scene, this.camera); // re-render if controls move/zoom
    });
    controls.enableZoom = true;

    // Light above
    let light = new THREE.PointLight(0xffffff);
    light.position.set(0, 0, 3);
    this.scene.add(light);

    // Light below
    light = new THREE.PointLight(0xffffff);
    light.position.set(0, 0, -3);
    this.scene.add(light);

    // Ambient light
    this.scene.add(new THREE.AmbientLight(0x222222));

    this.renderer.render(this.scene, this.camera);

  }

  getDomElement(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

}
