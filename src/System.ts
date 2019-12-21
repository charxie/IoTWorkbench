/*
 * @author Charles Xie
 */

import {Movable} from "./Movable";
import {Workbench} from "./Workbench";
import {RaspberryPi} from "./components/RaspberryPi";
import {RainbowHat} from "./components/RainbowHat";
import {LineChart} from "./tools/LineChart";
import {ColorPicker} from "./tools/ColorPicker";
import {Mcu} from "./components/Mcu";
import {system} from "./Main";
import {Rectangle} from "./math/Rectangle";

declare var firebase;

export class System {

  static database;

  workbench: Workbench;
  mcus: Mcu[] = [];
  rainbowHat: RainbowHat;
  temperatureGraph: LineChart;
  pressureGraph: LineChart;
  playground: HTMLElement;
  colorPicker: ColorPicker;

  private selectedMovable: Movable;
  private mouseDownRelativeX: number;
  private mouseDownRelativeY: number;
  private draggedElementId: string;

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
    this.rainbowHat = new RainbowHat("rainbow-hat");
    this.temperatureGraph = new LineChart("temperature-linechart", this.rainbowHat.temperatureSensor);
    this.pressureGraph = new LineChart("pressure-linechart", this.rainbowHat.barometricPressureSensor);

    this.playground = document.getElementById("digital-twins-playground") as HTMLDivElement;
    this.playground.addEventListener("mousedown", this.mouseDown, false);
    this.playground.addEventListener("mouseup", this.mouseUp, false);
    this.playground.addEventListener("mousemove", this.mouseMove, false);
    document.addEventListener("mouseleave", this.mouseLeave, false);

    // drag and drop support
    let that = this;
    this.playground.addEventListener("dragstart", function (e) {
      that.draggedElementId = (<HTMLElement>e.target).id;
    });
    this.playground.addEventListener("drag", function (e) {
      // console.log("dragging: " + (<HTMLElement>e.target).id);
    });
    this.playground.addEventListener("dragend", function (e) {
      // console.log("end drag: " + (<HTMLElement>e.target).id);
    });

    // prevent default to allow drop
    this.playground.addEventListener("dragover", function (e) {
      e.preventDefault();
    }, false);
    this.playground.addEventListener("drop", function (e) {
      e.preventDefault();
      console.log("drop: " + that.draggedElementId + ", " + (<HTMLElement>e.target).id);
      if ((<HTMLElement>e.target).id == "workbench") {
        switch (that.draggedElementId) {
          case "raspberry-pi-image":
            let pi = that.addRaspberryPi(e.offsetX, e.offsetY, "Raspberry Pi " + Date.now().toString(16));
            that.storeMcuSequence();
            that.storeLocation(pi);
            break;
          case "rainbow-hat-image":
            break;
        }
      }
    }, false);
  }

  removeRaspberryPi(selectedIndex: number): void {
    let canvas = system.mcus[selectedIndex].canvas;
    this.playground.removeChild(canvas);
    system.mcus.splice(selectedIndex, 1);
    this.storeMcuSequence();
  }

  addRaspberryPi(x: number, y: number, uid: string): RaspberryPi {
    let canvas = document.createElement("canvas");
    canvas.id = "raspberry-pi-" + this.mcus.length;
    canvas.width = 435;
    canvas.height = 295;
    canvas.style.display = "block";
    canvas.style.margin = "auto";
    canvas.style.position = "absolute";
    canvas.style.left = "10px; top: 10px; z-index: 49;";
    this.playground.appendChild(canvas);
    let pi = new RaspberryPi(canvas.id, uid);
    this.mcus.push(pi);
    pi.setX(x - canvas.width / 2);
    pi.setY(y - canvas.height / 2);
    this.draw();
    return pi;
  }

  whichRaspberryPi(x: number, y: number): number {
    for (let i = 0; i < system.mcus.length; i++) {
      let mcu = system.mcus[i];
      if (mcu instanceof RaspberryPi) {
        let r = new Rectangle(mcu.getX(), mcu.getY(), mcu.getWidth(), mcu.getHeight());
        if (r.contains(x, y)) {
          return i;
        }
      }
    }
    return -1;
  }

  deselectAll(): void {
    for (let i = 0; i < system.mcus.length; i++) {
      system.mcus[i].selected = false;
    }
  }

  draw(): void {
    this.workbench.draw();
    let i;
    for (i = 0; i < this.mcus.length; i++) {
      this.mcus[i].draw();
    }
    this.rainbowHat.draw();
  }

  private mouseDown = (e: MouseEvent): void => {
    let rect = this.playground.getBoundingClientRect();
    let x = e.clientX - rect.x;
    let y = e.clientY - rect.y;
    this.selectedMovable = null;
    if (this.rainbowHat.whichHandle(x - this.rainbowHat.getX(), y - this.rainbowHat.getY()) >= 0) {
      this.selectedMovable = this.rainbowHat;
    } else if (this.temperatureGraph.isVisible() && this.temperatureGraph.onHandle(x - this.temperatureGraph.getX(), y - this.temperatureGraph.getY())) {
      this.selectedMovable = this.temperatureGraph;
    } else if (this.pressureGraph.isVisible() && this.pressureGraph.onHandle(x - this.pressureGraph.getX(), y - this.pressureGraph.getY())) {
      this.selectedMovable = this.pressureGraph;
    } else {
      let i;
      for (i = 0; i < this.mcus.length; i++) {
        if (this.mcus[i].whichHandle(x - this.mcus[i].getX(), y - this.mcus[i].getY()) >= 0) {
          this.selectedMovable = this.mcus[i];
          break;
        }
      }
    }
    if (this.selectedMovable != null) {
      this.mouseDownRelativeX = e.clientX - this.selectedMovable.getX();
      this.mouseDownRelativeY = e.clientY - this.selectedMovable.getY();
    }
  };

  private mouseUp = (e: MouseEvent): void => {
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
    this.selectedMovable = null;
  };

  private mouseMove = (e: MouseEvent): void => {
    if (this.selectedMovable != null) {
      this.moveTo(e.clientX, e.clientY, this.selectedMovable);
      this.storeLocation(this.selectedMovable);
    }
  };

  storeMcuSequence(): void {
    let s: string = "";
    for (let i = 0; i < this.mcus.length; i++) {
      s += this.mcus[i].getUid() + ", ";
    }
    localStorage.setItem("MCU Sequence", s.substring(0, s.length - 2));
  }

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
