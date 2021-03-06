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
import {Attachment} from "./Attachment";
import {Movable} from "../Movable";
import {closeAllContextMenus, flowchart, getInstanceString} from "../Main";
import {Rectangle} from "../math/Rectangle";
import {ColorPicker} from "../tools/ColorPicker";
import {SensorLineChart} from "./SensorLineChart";
import {Util} from "../Util";

declare var firebase;

export class System {

  static database;

  workbench: Workbench;
  mcus: Mcu[] = [];
  hats: Hat[] = [];
  lineCharts: SensorLineChart[] = [];
  playground: HTMLElement;
  colorPicker: ColorPicker;

  private selectedMovable: Movable;
  private mouseDownRelativeX: number;
  private mouseDownRelativeY: number;
  private draggedElementId: string;
  private touchStartInWorkbench: boolean;
  private longPressStartTime: number;
  private static readonly longPressTime: number = 1000;

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
    this.playground.addEventListener("touchstart", this.touchStart.bind(this), false);
    this.playground.addEventListener("touchend", this.touchEnd.bind(this), false);
    this.playground.addEventListener("touchmove", this.touchMove.bind(this), false);
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
      that.drop((<HTMLElement>e.target).id, e.clientX, e.clientY);
    }, false);
  }

  private drop(id: string, x: number, y: number): void {
    switch (this.draggedElementId) {
      case "raspberry-pi-image":
        if (id === "workbench") {
          this.addRaspberryPi("Raspberry Pi #" + Date.now().toString(16), x, y, true);
          this.storeMcuStates();
        }
        break;
      case "rainbow-hat-image":
        if (id === "workbench" || id.startsWith("raspberry-pi")) {
          this.addHatByAction("Rainbow HAT", x, y);
        }
        break;
      case "sense-hat-image":
        if (id === "workbench" || id.startsWith("raspberry-pi")) {
          this.addHatByAction("Sense HAT", x, y);
        }
        break;
      case "capacitive-touch-hat-image":
        if (id === "workbench" || id.startsWith("raspberry-pi")) {
          this.addHatByAction("Capacitive Touch HAT", x, y);
        }
        break;
      case "unicorn-hat-image":
        if (id === "workbench" || id.startsWith("raspberry-pi")) {
          this.addHatByAction("Unicorn HAT", x, y);
        }
        break;
      case "crickit-hat-image":
        if (id === "workbench" || id.startsWith("raspberry-pi")) {
          this.addHatByAction("Crickit HAT", x, y);
        }
        break;
      case "pan-tilt-hat-image":
        if (id === "workbench" || id.startsWith("raspberry-pi")) {
          this.addHatByAction("Pan-Tilt HAT", x, y);
        }
        break;
    }
  }

  clear(): void {
    this.removeAllHats();
    this.removeAllRaspberryPis();
  }

  /* Raspberry Pi methods */

  getRaspberryPiById(uid: string): RaspberryPi {
    for (let m of this.mcus) {
      if (m instanceof RaspberryPi) {
        if (m.uid == uid) {
          return <RaspberryPi>m;
        }
      }
    }
    return null;
  }

  removeRaspberryPiByIndex(selectedIndex: number): void {
    let canvas = this.mcus[selectedIndex].canvas;
    this.playground.removeChild(canvas);
    this.mcus.splice(selectedIndex, 1);
    this.storeMcuStates();
  }

  removeRaspberryPi(raspberryPi: RaspberryPi): void {
    this.removeRaspberryPiByIndex(this.mcus.indexOf(raspberryPi));
  }

  removeAllRaspberryPis(): void {
    for (let m of this.mcus) {
      this.playground.removeChild(m.canvas);
      if (m instanceof RaspberryPi) {
        m.hat = null;
      }
    }
    this.mcus.length = 0;
    this.storeMcuStates();
  }

  addRaspberryPi(uid: string, x: number, y: number, shiftToCenter: boolean): RaspberryPi {
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
    if (shiftToCenter) {
      pi.setX(x - canvas.width / 2);
      pi.setY(y - canvas.height / 2);
    } else {
      pi.setX(x);
      pi.setY(y);
    }
    this.draw();
    return pi;
  }

  whichRaspberryPi(x: number, y: number): number {
    for (let m of this.mcus) {
      if (m instanceof RaspberryPi) {
        if (new Rectangle(m.getX(), m.getY(), m.getWidth(), m.getHeight()).contains(x, y)) {
          return this.mcus.indexOf(m);
        }
      }
    }
    return -1;
  }

  /* HAT methods */

  addHatByAction(name: string, x: number, y: number): Hat {
    let hat = this.addHat(name, x, y, name + " #" + Date.now().toString(16), true);
    this.storeHatStates();
    if (this.whichRaspberryPi(x, y) >= 0) {
      hat.tryAttach();
    }
    let blockName = name + " Block";
    flowchart.addBlock(blockName, 10, 10, hat.uid.replace(name, blockName));
    return hat;
  }

  getHatById(uid: string): Hat {
    for (let h of this.hats) {
      if (h.uid == uid) {
        return h;
      }
    }
    return null;
  }

  private removeHatByIndex(selectedIndex: number): void {
    let canvas = this.hats[selectedIndex].canvas;
    this.playground.removeChild(canvas);
    this.hats.splice(selectedIndex, 1);
    this.storeHatStates();
  }

  removeHat(hat: Hat): void {
    this.removeHatByIndex(this.hats.indexOf(hat));
  }

  removeHatAndBlock(hat: Hat): void {
    this.removeHatByIndex(this.hats.indexOf(hat));
    let s = hat.uid.substring(0, hat.uid.indexOf("#") - 1);
    let blockId = hat.uid.replace(s, s + " Block");
    flowchart.removeBlock(blockId);
  }

  removeAllHats(): void {
    for (let h of this.hats) {
      this.playground.removeChild(h.canvas);
      h.raspberryPi = null;
      let s = h.uid.substring(0, h.uid.indexOf("#") - 1);
      let blockId = h.uid.replace(s, s + " Block");
      flowchart.removeBlock(blockId);
    }
    this.hats.length = 0;
    this.storeHatStates();
  }

  addHat(type: string, x: number, y: number, uid: string, shiftToCenter: boolean): Hat {
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
        canvas.height = 280;
        hat = new RainbowHat(canvas.id, uid);
        break;
      case "Sense HAT":
        canvas.id = "sense-hat-" + this.hats.length;
        canvas.width = 330;
        canvas.height = 275;
        hat = new SenseHat(canvas.id, uid);
        break;
      case "Capacitive Touch HAT":
        canvas.id = "capacitive-touch-hat-" + this.hats.length;
        canvas.width = 330;
        canvas.height = 280;
        hat = new CapacitiveTouchHat(canvas.id, uid);
        break;
      case "Unicorn HAT":
        canvas.id = "unicorn-hat-" + this.hats.length;
        canvas.width = 330;
        canvas.height = 370;
        hat = new UnicornHat(canvas.id, uid);
        break;
      case "Crickit HAT":
        canvas.id = "crickit-hat-" + this.hats.length;
        canvas.width = 330;
        canvas.height = 280;
        hat = new CrickitHat(canvas.id, uid);
        break;
      case "Pan-Tilt HAT":
        canvas.id = "pan-tilt-hat-" + this.hats.length;
        canvas.width = 330;
        canvas.height = 280;
        hat = new PanTiltHat(canvas.id, uid);
        break;
    }
    if (hat != null) {
      this.hats.push(hat);
      if (shiftToCenter) {
        hat.setX(x - canvas.width / 2);
        hat.setY(y - canvas.height / 2);
      } else {
        hat.setX(x);
        hat.setY(y);
      }
      this.draw();
    }
    return hat;
  }

  whichHat(x: number, y: number): Hat {
    for (let hat of this.hats) {
      let r = new Rectangle(hat.getX(), hat.getY(), hat.getWidth(), hat.getHeight());
      if (r.contains(x, y)) {
        return hat;
      }
    }
    return null;
  }

  /* line chart methods */

  getLineChartById(uid: string): SensorLineChart {
    for (let c of this.lineCharts) {
      if (c.uid == uid) {
        return c;
      }
    }
    return null;
  }

  removeLineChartByIndex(selectedIndex: number): void {
    let canvas = this.lineCharts[selectedIndex].canvas;
    this.playground.removeChild(canvas);
    this.lineCharts.splice(selectedIndex, 1);
  }

  removeLineChart(lineChart: SensorLineChart): void {
    this.removeLineChartByIndex(this.lineCharts.indexOf(lineChart));
  }

  addLineChart(s: Sensor, x: number, y: number, uid: string): SensorLineChart {
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
    let lineChart: SensorLineChart = new SensorLineChart(canvas.id, uid, s);
    this.lineCharts.push(lineChart);
    lineChart.setX(x);
    lineChart.setY(y);
    lineChart.setVisible(true);
    this.draw();
    return lineChart;
  }

  whichLineChart(x: number, y: number): SensorLineChart {
    for (let c of this.lineCharts) {
      let r = new Rectangle(c.getX(), c.getY(), c.getWidth(), c.getHeight());
      if (r.contains(x, y)) {
        return c;
      }
    }
    return null;
  }

  /* draw and mouse */

  draw(): void {
    this.workbench.draw();
    for (let m of this.mcus) {
      m.draw();
    }
    for (let h of this.hats) {
      h.draw();
    }
  }

  private touchStart(e: TouchEvent): void {
    //e.preventDefault();
    let touch = e.touches[0];
    this.touchStartInWorkbench = Util.containsInRect(touch.clientX, touch.clientY, this.workbench.canvas.getBoundingClientRect());
    if (this.touchStartInWorkbench) {
      this.playground.dispatchEvent(new MouseEvent("mousedown", {clientX: touch.clientX, clientY: touch.clientY}));
      this.longPressStartTime = Date.now();
    } else {
      this.selectedMovable = null;
    }
  }

  private touchMove(e: TouchEvent): void {
    if (this.selectedMovable !== null) { // distable default scrolling when a component is selected
      e.preventDefault();
    }
    let touch = e.touches[0];
    if (Util.containsInRect(touch.clientX, touch.clientY, this.workbench.canvas.getBoundingClientRect())) {
      this.playground.dispatchEvent(new MouseEvent("mousemove", {clientX: touch.clientX, clientY: touch.clientY}));
      this.longPressStartTime = Date.now();
    }
  }

  private touchEnd(e: TouchEvent): void {
    if (this.selectedMovable !== null) { // distable default scrolling when a component is selected
      e.preventDefault();
    }
    let touch = e.changedTouches[0];
    if (this.touchStartInWorkbench) {
      if (Date.now() - this.longPressStartTime > System.longPressTime) {
        this.playground.dispatchEvent(new MouseEvent("contextmenu", {clientX: touch.clientX, clientY: touch.clientY}));
      } else {
        // for some reason, in Chrome on Android, touch.clientX and touch.clientY return 0 here.
        this.playground.dispatchEvent(new MouseEvent("mouseup", {clientX: touch.pageX, clientY: touch.pageY}));
      }
    } else {
      this.draggedElementId = (<HTMLElement>e.target).id;
      let rect = this.workbench.canvas.getBoundingClientRect();
      if (Util.containsInRect(touch.clientX, touch.clientY, rect)) {
        this.drop("workbench", touch.clientX, touch.clientY);
      }
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
    }
  };

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
      this.storeHatStates();
      if (m.raspberryPi != null) {
        m.raspberryPi.setX(m.getX());
        m.raspberryPi.setY(m.getY());
        this.storeMcuStates();
      }
    } else if (m instanceof RaspberryPi) {
      this.storeMcuStates();
      if (m.hat != null) {
        m.hat.setX(m.getX());
        m.hat.setY(m.getY());
        this.storeHatStates();
      }
    } else if (m instanceof SensorLineChart) {
      this.storeLineChartStates();
    }
  }

  // storage methods

  updateLocalStorage(): void {
    this.storeMcuStates();
    this.storeHatStates();
    this.storeAttachments();
  }

  saveMcuStatesTo(mcuStates): void {
    for (let m of this.mcus) {
      mcuStates.push(new Mcu.State(m));
    }
  }

  storeMcuStates(): void {
    let mcuStates = [];
    this.saveMcuStatesTo(mcuStates);
    localStorage.setItem(getInstanceString("MCU States"), JSON.stringify(mcuStates));
  }

  saveHatStatesTo(hatStates): void {
    for (let h of this.hats) {
      hatStates.push(new Hat.State(h));
    }
  }

  storeHatStates(): void {
    let hatStates = [];
    this.saveHatStatesTo(hatStates);
    localStorage.setItem(getInstanceString("HAT States"), JSON.stringify(hatStates));
  }

  saveAttachments(attachmentStates): void {
    for (let h of this.hats) {
      if (h.raspberryPi != null) {
        attachmentStates.push(new Attachment(h.raspberryPi, h));
      }
    }
  }

  storeAttachments(): void {
    let attachmentStates = [];
    this.saveAttachments(attachmentStates);
    localStorage.setItem(getInstanceString("Attachments"), JSON.stringify(attachmentStates));
  }

  storeLineChartStates(): void {
    let states = [];
    for (let h of this.hats) {
      if (h instanceof RainbowHat) {
        states.push(new SensorLineChart.State(h.temperatureGraph));
        states.push(new SensorLineChart.State(h.pressureGraph));
      }
    }
    localStorage.setItem(getInstanceString("Line Chart States"), JSON.stringify(states));
  }

}
