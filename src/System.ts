/*
 * @author Charles Xie
 */

import {RainbowHat} from "./RainbowHat";
import {LineChart} from "./LineChart";
import {Workbench} from "./Workbench";

declare var firebase;

export class System {

  static database;

  workbench: Workbench;
  board: RainbowHat;
  temperatureGraph: LineChart;
  pressureGraph: LineChart;
  playground: HTMLElement;

  private selectedElement: any;
  private mouseDownX: number;
  private mouseDownY: number;

  constructor() {

    if (!System.database) {
      let config = {
        apiKey: "AIzaSyAT_mdZ9yMGg6BWkB1NWPIqAjXtP4cBwcA",
        authDomain: "raspberry-pi-java.firebaseapp.com",
        databaseURL: "https://raspberry-pi-java.firebaseio.com",
        projectId: "raspberry-pi-java",
        storageBucket: "raspberry-pi-java.appspot.com",
        messagingSenderId: "498912746820"
      };
      firebase.initializeApp(config);
      // Get a reference to the database service
      System.database = firebase.database();
    }

    this.workbench = new Workbench("workbench");
    this.board = new RainbowHat("rainbow-hat");
    this.temperatureGraph = new LineChart("temperature-linechart", "Temperature", this.board.temperature, 15, 20);
    this.pressureGraph = new LineChart("pressure-linechart", "Pressure", this.board.pressure, 100, 2000);

    this.playground = document.getElementById("playground");
    this.playground.addEventListener("mousedown", this.mouseDown, false);
    this.playground.addEventListener("mouseup", this.mouseUp, false);
    this.playground.addEventListener("mousemove", this.mouseMove, false);

  }

  private mouseDown = (e: MouseEvent): void => {

    e.preventDefault();

    this.mouseDownX = e.clientX;
    this.mouseDownY = e.clientY;
    this.selectedElement = null;

    if (this.board.inside(this.mouseDownX, this.mouseDownY)) {
      this.selectedElement = this.board;
    }

  }

  private mouseUp = (e: MouseEvent): void => {

    e.preventDefault();
    let dx = e.clientX;
    let dy = e.clientY;
    this.selectedElement = null;

  }

  private mouseMove = (e: MouseEvent): void => {

    e.preventDefault();

    let dx = e.clientX - this.mouseDownX;
    let dy = e.clientY - this.mouseDownY;

    if (this.selectedElement == this.board) {
      this.board.canvas.style.left = dx + "px";
      this.board.canvas.style.top = dy + "px";
    }

  }

}
