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
  private mouseDownRelativeX: number;
  private mouseDownRelativeY: number;

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
    if (this.board.inside(e.clientX, e.clientY)) {
      this.selectedElement = this.board;
      this.mouseDownRelativeX = e.clientX - this.board.canvas.offsetLeft;
      this.mouseDownRelativeY = e.clientY - this.board.canvas.offsetTop;
    } else {
      this.selectedElement = null;
    }
  }

  private mouseUp = (e: MouseEvent): void => {
    e.preventDefault();
    this.selectedElement = null;
  }

  private mouseMove = (e: MouseEvent): void => {
    e.preventDefault();
    if (this.selectedElement == this.board) {
      let dx = e.clientX - this.mouseDownRelativeX;
      let dy = e.clientY - this.mouseDownRelativeY;
      let xmax = this.workbench.canvas.width - this.board.canvas.width;
      if (dx < 0) {
        dx = 0;
      } else if (dx > xmax) {
        dx = xmax;
      }
      let ymax = this.workbench.canvas.height - this.board.canvas.height;
      if (dy < 0) {
        dy = 0;
      } else if (dy > ymax) {
        dy = ymax;
      }
      this.board.canvas.style.left = dx + "px";
      this.board.canvas.style.top = dy + "px";
    }
  }

}
