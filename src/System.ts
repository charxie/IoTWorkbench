/*
 * @author Charles Xie
 */

import {Workbench} from "./Workbench";
import {RaspberryPi} from "./RaspberryPi";
import {RainbowHat} from "./RainbowHat";
import {LineChart} from "./LineChart";
import {Movable} from "./Movable";
import {ColorPicker} from "./ColorPicker";

declare var firebase;

export class System {

  static database;

  workbench: Workbench;
  raspberryPi: RaspberryPi;
  rainbowHat: RainbowHat;
  temperatureGraph: LineChart;
  pressureGraph: LineChart;
  playground: HTMLElement;
  colorPicker: ColorPicker;

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

    this.playground = document.getElementById("digital-twins-playground");
    this.playground.addEventListener("mousedown", this.mouseDown, false);
    this.playground.addEventListener("mouseup", this.mouseUp, false);
    this.playground.addEventListener("mousemove", this.mouseMove, false);
    document.addEventListener("mouseleave", this.mouseLeave, false);

  }

  draw(): void {
    this.workbench.draw();
    this.raspberryPi.draw();
    this.rainbowHat.draw();
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
    menu = document.getElementById("colorpicker-context-menu") as HTMLMenuElement;
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
      this.storeLocation(this.selectedMovable);
    }
  };

  private storeLocation(m: Movable): void {
    localStorage.setItem("X: " + m.getUid(), m.getX().toString());
    localStorage.setItem("Y: " + m.getUid(), m.getY().toString());
    if (m instanceof RainbowHat) {
      if (m.raspberryPi != null) {
        localStorage.setItem("X: " + m.raspberryPi.getUid(), m.raspberryPi.getX().toString());
        localStorage.setItem("Y: " + m.raspberryPi.getUid(), m.raspberryPi.getY().toString());
      }
    } else if (m instanceof RaspberryPi) {
      if (m.hat != null) {
        localStorage.setItem("X: " + m.hat.getUid(), m.hat.getX().toString());
        localStorage.setItem("Y: " + m.hat.getUid(), m.hat.getY().toString());
      }
    }
  }

  private moveTo(x: number, y: number, m: Movable): void {
    let dx = x - this.mouseDownRelativeX;
    let dy = y - this.mouseDownRelativeY;
    let xmax = this.workbench.getX() + this.workbench.getWidth() - m.getWidth();
    if (dx < this.workbench.getX()) {
      dx = this.workbench.getX();
    } else if (dx > xmax) {
      dx = xmax;
    }
    let ymax = this.workbench.getY() + this.workbench.getHeight() - m.getHeight();
    if (dy < this.workbench.getY()) {
      dy = this.workbench.getY();
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
