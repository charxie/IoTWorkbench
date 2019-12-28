/*
 * @author Charles Xie
 */

import {Workbench} from "./Workbench";
import {Mcu} from "./Mcu";
import {RaspberryPi} from "./RaspberryPi";
import {Hat} from "./Hat";
import {RainbowHat} from "./RainbowHat";
import {Sensor} from "./Sensor";
import {SenseHat} from "./SenseHat";
import {CapacitiveTouchHat} from "./CapacitiveTouchHat";
import {UnicornHat} from "./UnicornHat";
import {CrickitHat} from "./CrickitHat";
import {PanTiltHat} from "./PanTiltHat";
import {Movable} from "../Movable";
import {closeAllContextMenus, flowchart} from "../Main";
import {Rectangle} from "../math/Rectangle";
import {ColorPicker} from "../tools/ColorPicker";
import {LineChart} from "../tools/LineChart";

declare var firebase;

export class System {

  static database;

  workbench: Workbench;
  mcus: Mcu[] = [];
  hats: Hat[] = [];
  lineCharts: LineChart[] = [];
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
    this.playground = document.getElementById("model-playground") as HTMLDivElement;
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
      // console.log("drop: " + that.draggedElementId + ", " + (<HTMLElement>e.target).id);
      let id = (<HTMLElement>e.target).id;
      switch (that.draggedElementId) {
        case "raspberry-pi-image":
          if (id == "workbench") {
            that.storeLocation(that.addRaspberryPi(e.offsetX, e.offsetY, "Raspberry Pi #" + Date.now().toString(16)));
            that.storeMcuSequence();
          }
          break;
        case "rainbow-hat-image":
          if (id == "workbench" || id.startsWith("raspberry-pi")) {
            that.addHatByAction("Rainbow HAT", e.offsetX, e.offsetY);
          }
          break;
        case "sense-hat-image":
          if (id == "workbench" || id.startsWith("raspberry-pi")) {
            that.addHatByAction("Sense HAT", e.offsetX, e.offsetY);
          }
          break;
        case "capacitive-touch-hat-image":
          if (id == "workbench" || id.startsWith("raspberry-pi")) {
            that.addHatByAction("Capacitive Touch HAT", e.offsetX, e.offsetY);
          }
          break;
        case "unicorn-hat-image":
          if (id == "workbench" || id.startsWith("raspberry-pi")) {
            that.addHatByAction("Unicorn HAT", e.offsetX, e.offsetY);
          }
          break;
        case "crickit-hat-image":
          if (id == "workbench" || id.startsWith("raspberry-pi")) {
            that.addHatByAction("Crickit HAT", e.offsetX, e.offsetY);
          }
          break;
        case "pan-tilt-hat-image":
          if (id == "workbench" || id.startsWith("raspberry-pi")) {
            that.addHatByAction("Pan-Tilt HAT", e.offsetX, e.offsetY);
          }
          break;
      }
    }, false);
  }

  addHatByAction(name: string, x: number, y: number): Hat {
    let hat = this.addHat(name, x, y, name + " #" + Date.now().toString(16));
    this.storeLocation(hat);
    this.storeHatSequence();
    if (this.whichRaspberryPi(x, y) >= 0) {
      hat.tryAttach();
    }
    return hat;
  }

  /* Raspberry Pi methods */

  getRaspberryPiById(uid: string): RaspberryPi {
    for (let i = 0; i < this.mcus.length; i++) {
      if (this.mcus[i] instanceof RaspberryPi) {
        if (this.mcus[i].uid == uid) {
          return <RaspberryPi>this.mcus[i];
        }
      }
    }
    return null;
  }

  removeRaspberryPiByIndex(selectedIndex: number): void {
    let canvas = this.mcus[selectedIndex].canvas;
    this.playground.removeChild(canvas);
    this.mcus.splice(selectedIndex, 1);
    this.storeMcuSequence();
  }

  removeRaspberryPi(raspberryPi: RaspberryPi): void {
    this.removeRaspberryPiByIndex(this.mcus.indexOf(raspberryPi));
  }

  addRaspberryPi(x: number, y: number, uid: string): RaspberryPi {
    let canvas = document.createElement("canvas");
    canvas.id = "raspberry-pi-" + this.mcus.length;
    canvas.width = 435;
    canvas.height = 295;
    canvas.style.display = "block";
    canvas.style.margin = "auto";
    canvas.style.position = "absolute";
    canvas.style.zIndex = "49";
    this.playground.appendChild(canvas);
    let pi = new RaspberryPi(canvas.id, uid);
    this.mcus.push(pi);
    pi.setX(x - canvas.width / 2);
    pi.setY(y - canvas.height / 2);
    this.draw();
    return pi;
  }

  whichRaspberryPi(x: number, y: number): number {
    for (let i = 0; i < this.mcus.length; i++) {
      let mcu = this.mcus[i];
      if (mcu instanceof RaspberryPi) {
        let r = new Rectangle(mcu.getX(), mcu.getY(), mcu.getWidth(), mcu.getHeight());
        if (r.contains(x, y)) {
          return i;
        }
      }
    }
    return -1;
  }

  /* HAT methods */

  getHatById(uid: string): Hat {
    for (let i = 0; i < this.hats.length; i++) {
      if (this.mcus[i].uid == uid) {
        return this.hats[i];
      }
    }
    return null;
  }

  private removeHatByIndex(selectedIndex: number): void {
    let canvas = this.hats[selectedIndex].canvas;
    this.playground.removeChild(canvas);
    this.hats.splice(selectedIndex, 1);
    this.storeHatSequence();
  }

  removeHat(hat: Hat): void {
    this.removeHatByIndex(this.hats.indexOf(hat));
    let s = hat.uid.substring(0, hat.uid.indexOf("#") - 1);
    let blockId = hat.uid.replace(s, s + " Block");
    flowchart.removeBlock(blockId);
  }

  addHat(type: string, x: number, y: number, uid: string): Hat {
    let canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.style.margin = "auto";
    canvas.style.position = "absolute";
    canvas.style.left = "10px";
    canvas.style.top = "10px";
    canvas.style.zIndex = "99";
    this.playground.appendChild(canvas);
    let hat = null;
    switch (type) {
      case "Rainbow HAT":
        canvas.id = "rainbow-hat-" + this.hats.length;
        canvas.width = 330;
        canvas.height = 290;
        hat = new RainbowHat(canvas.id, uid);
        break;
      case "Sense HAT":
        canvas.id = "sense-hat-" + this.hats.length;
        canvas.width = 330;
        canvas.height = 290;
        hat = new SenseHat(canvas.id, uid);
        break;
      case "Capacitive Touch HAT":
        canvas.id = "capacitive-touch-hat-" + this.hats.length;
        canvas.width = 330;
        canvas.height = 290;
        hat = new CapacitiveTouchHat(canvas.id, uid);
        break;
      case "Unicorn HAT":
        canvas.id = "unicorn-hat-" + this.hats.length;
        canvas.width = 330;
        canvas.height = 380;
        hat = new UnicornHat(canvas.id, uid);
        break;
      case "Crickit HAT":
        canvas.id = "crickit-hat-" + this.hats.length;
        canvas.width = 330;
        canvas.height = 290;
        hat = new CrickitHat(canvas.id, uid);
        break;
      case "Pan-Tilt HAT":
        canvas.id = "pan-tilt-hat-" + this.hats.length;
        canvas.width = 330;
        canvas.height = 290;
        hat = new PanTiltHat(canvas.id, uid);
        break;
    }
    if (hat != null) {
      this.hats.push(hat);
      hat.setX(x - canvas.width / 2);
      hat.setY(y - canvas.height / 2);
      this.draw();
      let blockId = uid.replace(type, type + " Block");
      let block = flowchart.addBlock(type + " Block", 10, 10, blockId);
      let blockX = localStorage.getItem("X: " + blockId);
      let blockY = localStorage.getItem("Y: " + blockId);
      if (blockX && blockY) {
        block.setX(parseInt(blockX));
        block.setY(parseInt(blockY));
      }
    }
    return hat;
  }

  whichHat(x: number, y: number): number {
    for (let i = 0; i < this.hats.length; i++) {
      let hat = this.hats[i];
      let r = new Rectangle(hat.getX(), hat.getY(), hat.getWidth(), hat.getHeight());
      if (r.contains(x, y)) {
        return i;
      }
    }
    return -1;
  }

  /* line chart methods */

  getLineChartById(uid: string): LineChart {
    for (let i = 0; i < this.lineCharts.length; i++) {
      if (this.lineCharts[i].uid == uid) {
        return this.lineCharts[i];
      }
    }
    return null;
  }

  removeLineChartByIndex(selectedIndex: number): void {
    let canvas = this.lineCharts[selectedIndex].canvas;
    this.playground.removeChild(canvas);
    this.lineCharts.splice(selectedIndex, 1);
    //this.storeLineChartSequence();
  }

  removeLineChart(lineChart: LineChart): void {
    this.removeLineChartByIndex(this.lineCharts.indexOf(lineChart));
  }

  addLineChart(s: Sensor, x: number, y: number, uid: string): LineChart {
    let canvas = document.createElement("canvas");
    canvas.style.margin = "auto";
    canvas.style.position = "absolute";
    canvas.style.left = "10px";
    canvas.style.top = "10px";
    canvas.style.zIndex = "101";
    canvas.style.boxShadow = "5px 5px 5px gray";
    canvas.style.border = "2px solid #006699";
    canvas.style.borderRadius = "8px";
    canvas.width = 420;
    canvas.height = 300;
    canvas.id = "line-chart-" + this.lineCharts.length;
    this.playground.appendChild(canvas);
    let lineChart: LineChart = new LineChart(canvas.id, uid, s);
    this.lineCharts.push(lineChart);
    lineChart.setX(x);
    lineChart.setY(y);
    lineChart.setVisible(true);
    this.draw();
    return lineChart;
  }

  whichLineChart(x: number, y: number): number {
    for (let i = 0; i < this.lineCharts.length; i++) {
      let c = this.lineCharts[i];
      let r = new Rectangle(c.getX(), c.getY(), c.getWidth(), c.getHeight());
      if (r.contains(x, y)) {
        return i;
      }
    }
    return -1;
  }

  /* draw and mouse */

  draw(): void {
    this.workbench.draw();
    let i;
    for (i = 0; i < this.mcus.length; i++) {
      this.mcus[i].draw();
    }
    for (i = 0; i < this.hats.length; i++) {
      this.hats[i].draw();
    }
  }

  private mouseDown = (e: MouseEvent): void => {
    let rect = this.playground.getBoundingClientRect();
    let x = e.clientX - rect.x;
    let y = e.clientY - rect.y;
    this.selectedMovable = null;
    for (let i = this.hats.length - 1; i >= 0; i--) {
      if (this.hats[i] instanceof RainbowHat) {
        let r = <RainbowHat>this.hats[i];
        if (r.temperatureGraph != null && r.temperatureGraph.isVisible() && r.temperatureGraph.onHandle(x - r.temperatureGraph.getX(), y - r.temperatureGraph.getY())) {
          this.selectedMovable = r.temperatureGraph;
        } else if (r.pressureGraph != null && r.pressureGraph.isVisible() && r.pressureGraph.onHandle(x - r.pressureGraph.getX(), y - r.pressureGraph.getY())) {
          this.selectedMovable = r.pressureGraph;
        }
      }
    }
    // always prioritize HATs over Raspberry Pi
    for (let i = this.hats.length - 1; i >= 0; i--) {
      if (this.hats[i].whichHandle(x - this.hats[i].getX(), y - this.hats[i].getY()) >= 0) {
        this.selectedMovable = this.hats[i];
        break;
      }
    }
    if (this.selectedMovable == null) {
      for (let i = this.mcus.length - 1; i >= 0; i--) {
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
    closeAllContextMenus(); // close all menus upon mouse left click
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

  storeHatSequence(): void {
    let s: string = "";
    for (let i = 0; i < this.hats.length; i++) {
      s += this.hats[i].getUid() + ", ";
    }
    localStorage.setItem("HAT Sequence", s.substring(0, s.length - 2));
  }

  private storeLocation(m: Movable): void {
    if (m instanceof LineChart) { // line charts are not independent, they are associated with sensors
      let c = <LineChart>m;
      localStorage.setItem(c.name + " X @" + c.sensor.board.getUid(), m.getX().toString());
      localStorage.setItem(c.name + " Y @" + c.sensor.board.getUid(), m.getY().toString());
    } else {
      localStorage.setItem("X: " + m.getUid(), m.getX().toString());
      localStorage.setItem("Y: " + m.getUid(), m.getY().toString());
      if (m instanceof Hat) {
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
    if (m instanceof Hat) {
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
