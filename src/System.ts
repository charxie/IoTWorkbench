/*
 * @author Charles Xie
 */

import {Workbench} from "./Workbench";
import {RaspberryPi} from "./RaspberryPi";
import {RainbowHat} from "./RainbowHat";
import {LineChart} from "./LineChart";
import {Movable} from "./Movable";

declare var firebase;
declare global {
  interface CanvasRenderingContext2D {
    drawTooltip(x, y, h, r, margin, text, centered);

    drawRoundedRect(x, y, w, h, r);

    fillRoundedRect(x, y, w, h, r);
  }
}

export class System {

  static database;

  workbench: Workbench;
  raspberryPi: RaspberryPi;
  rainbowHat: RainbowHat;
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
    this.raspberryPi = new RaspberryPi("raspberry-pi");
    this.rainbowHat = new RainbowHat("rainbow-hat");
    this.temperatureGraph = new LineChart("temperature-linechart", this.rainbowHat.temperatureSensor);
    this.pressureGraph = new LineChart("pressure-linechart", this.rainbowHat.barometricPressureSensor);

    this.playground = document.getElementById("playground");
    this.playground.addEventListener("mousedown", this.mouseDown, false);
    this.playground.addEventListener("mouseup", this.mouseUp, false);
    this.playground.addEventListener("mousemove", this.mouseMove, false);
    this.playground.addEventListener("mouseleave", this.mouseLeave, false);

  }

  private mouseDown = (e: MouseEvent): void => {
    e.preventDefault();
    let rect = this.playground.getBoundingClientRect();
    let x = e.clientX - rect.x;
    let y = e.clientY - rect.y;
    if (this.rainbowHat.whichHandle(x - this.rainbowHat.getX(), y - this.rainbowHat.getY()) >= 0) {
      this.selectedMovable = this.rainbowHat;
    } else if (this.temperatureGraph.isVisible() && this.temperatureGraph.onHandle(x - this.temperatureGraph.getX(), y - this.temperatureGraph.getY())) {
      this.selectedMovable = this.temperatureGraph;
    } else if (this.pressureGraph.isVisible() && this.pressureGraph.onHandle(x - this.pressureGraph.getX(), y - this.pressureGraph.getY())) {
      this.selectedMovable = this.pressureGraph;
    } else if (this.raspberryPi.whichHandle(x - this.raspberryPi.getX(), y - this.raspberryPi.getY()) >= 0) {
      this.selectedMovable = this.raspberryPi;
    } else {
      this.selectedMovable = null;
    }
    if (this.selectedMovable != null) {
      this.mouseDownRelativeX = e.clientX - this.selectedMovable.getX();
      this.mouseDownRelativeY = e.clientY - this.selectedMovable.getY();
    }
  };

  private mouseUp = (e: MouseEvent): void => {
    e.preventDefault();
    this.selectedMovable = null;
    // close all menus upon mouse left click
    let menu = document.getElementById("workbench-context-menu") as HTMLMenuElement;
    menu.classList.remove("show-menu");
    menu = document.getElementById("raspberry-pi-context-menu") as HTMLMenuElement;
    menu.classList.remove("show-menu");
    menu = document.getElementById("rainbow-hat-context-menu") as HTMLMenuElement;
    menu.classList.remove("show-menu");
    menu = document.getElementById("linechart-context-menu") as HTMLMenuElement;
    menu.classList.remove("show-menu");
  };

  private mouseLeave = (e: MouseEvent): void => {
    e.preventDefault();
    this.selectedMovable = null;
  };

  private mouseMove = (e: MouseEvent): void => {
    e.preventDefault();
    if (this.selectedMovable != null) {
      this.moveTo(e.clientX, e.clientY, this.selectedMovable);
      localStorage.setItem("X: " + this.selectedMovable.getUid(), this.selectedMovable.getX().toString());
      localStorage.setItem("Y: " + this.selectedMovable.getUid(), this.selectedMovable.getY().toString());
    }
  };

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
    if (m instanceof RainbowHat) {
      if (m.raspberryPi != null) {
        m.raspberryPi.setX(m.getX());
        m.raspberryPi.setY(m.getY());
      }
    } else if (m instanceof RaspberryPi) {
      if (m.hat != null) {
        m.hat.setX(m.getX());
        m.hat.setY(m.getY());
      }
    }
  }

}
