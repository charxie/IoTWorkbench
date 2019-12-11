/*
 * @author Charles Xie
 */

import {RainbowHat} from "./RainbowHat";
import {LineChart} from "./LineChart";
import {Workbench} from "./Workbench";
import {Movable} from "./Movable";

declare var firebase;

export class System {

  static database;

  workbench: Workbench;
  board: RainbowHat;
  temperatureGraph: LineChart;
  pressureGraph: LineChart;
  playground: HTMLElement;

  private selectedMovable: Movable;
  private mouseDownRelativeX: number;
  private mouseDownRelativeY: number;

  constructor() {

    if (!System.database) {
      let config = {
        apiKey: "${process.env.FIREBASE_API_KEY}",
        authDomain: "${process.env.AUTH_DOMAIN}",
        projectId: "${process.env.PROJECT_ID}",
        storageBucket: "${process.env.STORAGE_BUCKET}",
        messagingSenderId: "${process.env.MESSAGING_SENDER_ID}",
        databaseURL: "https://raspberry-pi-java.firebaseio.com"
      };
      firebase.initializeApp(config);
      // Get a reference to the database service
      System.database = firebase.database();
    }

    this.workbench = new Workbench("workbench");
    this.board = new RainbowHat("rainbow-hat");
    this.temperatureGraph = new LineChart("temperature-linechart", this.board.temperatureSensor);
    this.pressureGraph = new LineChart("pressure-linechart", this.board.barometricPressureSensor);

    this.playground = document.getElementById("playground");
    this.playground.addEventListener("mousedown", this.mouseDown, false);
    this.playground.addEventListener("mouseup", this.mouseUp, false);
    this.playground.addEventListener("mousemove", this.mouseMove, false);

  }

  private mouseDown = (e: MouseEvent): void => {
    e.preventDefault();
    let rect = this.playground.getBoundingClientRect();
    let x = e.clientX - rect.x;
    let y = e.clientY - rect.y;
    if (this.board.whichHandle(x - this.board.getX(), y - this.board.getY()) >= 0) {
      this.selectedMovable = this.board;
    } else if (this.temperatureGraph.isVisible() && this.temperatureGraph.onHandle(x - this.temperatureGraph.getX(), y - this.temperatureGraph.getY())) {
      this.selectedMovable = this.temperatureGraph;
    } else if (this.pressureGraph.isVisible() && this.pressureGraph.onHandle(x - this.pressureGraph.getX(), y - this.pressureGraph.getY())) {
      this.selectedMovable = this.pressureGraph;
    } else {
      this.selectedMovable = null;
    }
    if (this.selectedMovable != null) {
      this.mouseDownRelativeX = e.clientX - this.selectedMovable.getX();
      this.mouseDownRelativeY = e.clientY - this.selectedMovable.getY();
    }
  }

  private mouseUp = (e: MouseEvent): void => {
    e.preventDefault();
    this.selectedMovable = null;
  }

  private mouseMove = (e: MouseEvent): void => {
    e.preventDefault();
    if (this.selectedMovable != null) {
      this.moveTo(e.clientX, e.clientY, this.selectedMovable);
    }
  }

  private moveTo(x: number, y: number, m: Movable): void {
    let dx = x - this.mouseDownRelativeX;
    let dy = y - this.mouseDownRelativeY;
    let xmax = this.workbench.getWidth() - m.getWidth();
    if (dx < 0) {
      dx = 0;
    } else if (dx > xmax) {
      dx = xmax;
    }
    let ymax = this.workbench.getHeight() - m.getHeight();
    if (dy < 0) {
      dy = 0;
    } else if (dy > ymax) {
      dy = ymax;
    }
    m.setX(dx);
    m.setY(dy);
  }

}
