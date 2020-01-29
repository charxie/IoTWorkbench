/*
 * Digital twin for the Rainbow HAT
 *
 * @author Charles Xie
 */

import {Hat} from "./Hat";
import {LedDisplay} from "./LedDisplay";
import {Buzzer} from "./Buzzer";
import {LedLight} from "./LedLight";
import {Button} from "./Button";
import {Sensor} from "./Sensor";
import {System} from "./System";
import {Util} from "../Util";
import {contextMenus, flowchart, system} from "../Main";
import {Rectangle} from "../math/Rectangle";
import {ColorPicker} from "../tools/ColorPicker";
import {SensorLineChart} from "./SensorLineChart";

// @ts-ignore
import rainbowHatImage from "../img/rainbow-hat.png";

export class RainbowHat extends Hat {

  public redLedLight: LedLight;
  public greenLedLight: LedLight;
  public blueLedLight: LedLight;
  public buttonA: Button;
  public buttonB: Button;
  public buttonC: Button;
  public buzzer: Buzzer;
  public temperatureSensor: Sensor;
  public barometricPressureSensor: Sensor;
  public rgbLedLights: LedLight[] = [];
  public alphanumericDisplays: LedDisplay[] = [];
  public decimalPointDisplays: LedDisplay[] = [];

  public temperatureGraph: SensorLineChart;
  public pressureGraph: SensorLineChart;

  selectedRgbLedLight: LedLight;
  stateKey: string = "rainbow_hat_default";

  private mouseOverObject: any;
  private boardImage: HTMLImageElement;

  constructor(canvasId: string, uid: string) {
    super(canvasId);

    this.uid = uid;
    this.canvas.addEventListener("mousedown", this.mouseDown, false);
    this.canvas.addEventListener("mouseup", this.mouseUp, false);
    this.canvas.addEventListener("mousemove", this.mouseMove, false);
    this.canvas.addEventListener('contextmenu', this.openContextMenu, false);

    this.redLedLight = new LedLight(this, "RL", "red", 4, 8, 10, 65, 233, 18, 8);
    this.greenLedLight = new LedLight(this, "GL", "green", 4, 8, 10, 147, 233, 18, 8);
    this.blueLedLight = new LedLight(this, "BL", "blue", 4, 8, 10, 230, 233, 18, 8);
    this.buttonA = new Button(this, "BA", 38, 245, 72, 24);
    this.buttonB = new Button(this, "BB", 120, 245, 72, 24);
    this.buttonC = new Button(this, "BC", 203, 245, 72, 24);
    this.buzzer = new Buzzer(this, "Piezo Buzzer", 35, 170, 20, 20);
    this.temperatureSensor = new Sensor(this, "TS", "°C", 152, 108, 12, 12);
    this.barometricPressureSensor = new Sensor(this, "PS", "hPa", 187, 115, 20, 10);
    this.rgbLedLights.push(new LedLight(this, "L1", "black", 16, 12, 2, 251, 78, 20, 20));
    this.rgbLedLights.push(new LedLight(this, "L2", "black", 16, 12, 2, 218, 62, 20, 20));
    this.rgbLedLights.push(new LedLight(this, "L3", "black", 16, 12, 2, 183, 53, 20, 20));
    this.rgbLedLights.push(new LedLight(this, "L4", "black", 16, 12, 2, 147, 50, 20, 20));
    this.rgbLedLights.push(new LedLight(this, "L5", "black", 16, 12, 2, 111, 53, 20, 20));
    this.rgbLedLights.push(new LedLight(this, "L6", "black", 16, 12, 2, 76, 62, 20, 20));
    this.rgbLedLights.push(new LedLight(this, "L7", "black", 16, 12, 2, 44, 78, 20, 20));
    this.alphanumericDisplays.push(new LedDisplay(this, "D1", 34, 214, 33, 65));
    this.alphanumericDisplays.push(new LedDisplay(this, "D2", 95, 214, 33, 65));
    this.alphanumericDisplays.push(new LedDisplay(this, "D3", 156, 214, 33, 65));
    this.alphanumericDisplays.push(new LedDisplay(this, "D4", 218, 214, 33, 65));
    this.decimalPointDisplays.push(new LedDisplay(this, "D5", 78, 214, 33, 65));
    this.decimalPointDisplays.push(new LedDisplay(this, "D6", 139, 214, 33, 65));
    this.decimalPointDisplays.push(new LedDisplay(this, "D7", 200, 214, 33, 65));
    this.decimalPointDisplays.push(new LedDisplay(this, "D8", 261, 214, 33, 65));
    for (let display of this.decimalPointDisplays) {
      display.fontSize = "40px";
    }

    this.handles.push(new Rectangle(5, 5, 30, 30));
    this.handles.push(new Rectangle(280, 5, 30, 30));
    this.handles.push(new Rectangle(280, 240, 30, 30));
    this.handles.push(new Rectangle(5, 240, 30, 30));

    this.boardImage = new Image();
    this.boardImage.src = rainbowHatImage;
    this.setY(20);

    this.updateFromFirebase();
  }

  public setSelectedRgbLedLightColor(color: string) {
    if (this.selectedRgbLedLight != null) {
      this.selectedRgbLedLight.color = color;
      this.draw();
      let list = [];
      for (let light of this.rgbLedLights) {
        let a = [];
        let c = Util.hexToRgb(light.color);
        a.push(c.r);
        a.push(c.g);
        a.push(c.b);
        list.push(a);
      }
      this.updateFirebase({rainbowRgb: list});
    }
  }

  public draw(): void {
    let ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    ctx.shadowOffsetX = 8;
    ctx.shadowOffsetY = 8;
    ctx.shadowColor = "rgb(96, 96, 96)";
    ctx.shadowBlur = 8;
    ctx.drawImage(this.boardImage, 0, 0);
    ctx.restore();
    this.redLedLight.draw(ctx);
    this.greenLedLight.draw(ctx);
    this.blueLedLight.draw(ctx);
    this.buttonA.draw(ctx);
    this.buttonB.draw(ctx);
    this.buttonC.draw(ctx);
    this.buzzer.draw(ctx);
    this.temperatureSensor.draw(ctx);
    this.barometricPressureSensor.draw(ctx);
    this.drawToolTips();
    for (let light of this.rgbLedLights) {
      light.draw(ctx);
    }
    for (let display of this.alphanumericDisplays) {
      display.draw(ctx);
    }
    for (let display of this.decimalPointDisplays) {
      display.draw(ctx);
    }
  }

  private openContextMenu = (e: MouseEvent): void => {
    e.preventDefault();
    let rect = this.canvas.getBoundingClientRect();
    let dx = e.clientX - rect.x;
    let dy = e.clientY - rect.y;
    this.selectedRgbLedLight = null;
    for (let light of this.rgbLedLights) {
      if (light.contains(dx, dy)) {
        this.selectedRgbLedLight = light;
        break;
      }
    }
    if (this.selectedRgbLedLight != null) {
      contextMenus.colorPicker.rainbowHat = this;
      let menu = document.getElementById(contextMenus.colorPicker.id) as HTMLMenuElement;
      menu.style.left = e.clientX + "px";
      menu.style.top = (e.clientY - document.getElementById("tabs").getBoundingClientRect().bottom) + "px";
      menu.classList.add("show-menu");
      if (system.colorPicker == null) {
        system.colorPicker = new ColorPicker();
      }
      system.colorPicker.setColorLabel(document.getElementById("colorpicker-label"));
      system.colorPicker.setColorCode(document.getElementById("colorpicker-hex-code") as HTMLInputElement);
      system.colorPicker.setSelectedColor(this.selectedRgbLedLight.color);
      system.colorPicker.draw();
      system.colorPicker.setSelectedPoint();
      document.getElementById("colorpicker-title").innerText = "RGB LED Light " + this.rgbLedLights.indexOf(this.selectedRgbLedLight);
    } else {
      contextMenus.rainbowHat.hat = this;
      let menu = document.getElementById(contextMenus.rainbowHat.id) as HTMLMenuElement;
      menu.style.left = e.clientX + "px";
      menu.style.top = (e.clientY - document.getElementById("tabs").getBoundingClientRect().bottom) + "px";
      menu.classList.add("show-menu");
      let attachMenuItem = document.getElementById("rainbow-hat-attach-menu-item") as HTMLElement;
      let detachMenuItem = document.getElementById("rainbow-hat-detach-menu-item") as HTMLElement;
      if (this.raspberryPi != null) {
        attachMenuItem.className = "menu-item disabled";
        detachMenuItem.className = "menu-item";
      } else {
        let i = this.whichRaspberryPi();
        attachMenuItem.className = i >= 0 ? "menu-item" : "menu-item disabled";
        detachMenuItem.className = "menu-item disabled";
      }
    }
  };

  private mouseDown = (e: MouseEvent): void => {

    e.preventDefault();

    let rect = this.canvas.getBoundingClientRect();
    let dx = e.clientX - rect.x;
    let dy = e.clientY - rect.y;
    let context = this.canvas.getContext("2d");

    if (this.redLedLight.toggle(dx, dy)) {
      this.updateFirebase({redLed: this.redLedLight.on});
      this.redLedLight.draw(context);
      return;
    }

    if (this.greenLedLight.toggle(dx, dy)) {
      this.updateFirebase({greenLed: this.greenLedLight.on});
      this.greenLedLight.draw(context);
      return;
    }

    if (this.blueLedLight.toggle(dx, dy)) {
      this.updateFirebase({blueLed: this.blueLedLight.on});
      this.blueLedLight.draw(context);
      return;
    }

    if (this.buttonA.contains(dx, dy)) {
      this.buttonA.on = true;
      this.buttonA.draw(context);
      this.redLedLight.on = true;
      this.redLedLight.draw(context);
      this.updateFirebase({redLed: true});
      this.buzzer.beepButton("A");
      return;
    }

    if (this.buttonB.contains(dx, dy)) {
      this.buttonB.on = true;
      this.buttonB.draw(context);
      this.greenLedLight.on = true;
      this.greenLedLight.draw(context);
      this.updateFirebase({greenLed: true});
      this.buzzer.beepButton("B");
      return;
    }

    if (this.buttonC.contains(dx, dy)) {
      this.buttonC.on = true;
      this.buttonC.draw(context);
      this.blueLedLight.on = true;
      this.blueLedLight.draw(context);
      this.updateFirebase({blueLed: true});
      this.buzzer.beepButton("C");
      return;
    }

  };

  private mouseUp = (e: MouseEvent): void => {

    e.preventDefault();

    let rect = this.canvas.getBoundingClientRect();
    let dx = e.clientX - rect.x;
    let dy = e.clientY - rect.y;
    let context = this.canvas.getContext("2d");

    if (this.buttonA.contains(dx, dy)) {
      this.buttonA.on = false;
      this.buttonA.draw(context);
      this.redLedLight.on = false;
      this.redLedLight.draw(context);
      this.updateFirebase({redLed: false});
      return;
    }

    if (this.buttonB.contains(dx, dy)) {
      this.buttonB.on = false;
      this.buttonB.draw(context);
      this.greenLedLight.on = false;
      this.greenLedLight.draw(context);
      this.updateFirebase({greenLed: false});
      return;
    }

    if (this.buttonC.contains(dx, dy)) {
      this.buttonC.on = false;
      this.buttonC.draw(context);
      this.blueLedLight.on = false;
      this.blueLedLight.draw(context);
      this.updateFirebase({blueLed: false});
      return;
    }

    if (this.temperatureSensor.contains(dx, dy)) {
      if (this.temperatureGraph == null) {
        this.temperatureGraph = system.addLineChart(this.temperatureSensor,
          e.pageX - this.canvas.width / 2, e.pageY - this.canvas.height * 4 / 5, "Temperature Line Chart #" + Date.now().toString(16));
      } else {
        this.temperatureGraph.setVisible(!this.temperatureGraph.isVisible());
      }
      if (this.temperatureGraph.isVisible()) {
        this.temperatureGraph.draw();
        this.temperatureGraph.bringForward();
      }
      system.storeLineChartStates();
      return;
    }

    if (this.barometricPressureSensor.contains(dx, dy)) {
      if (this.pressureGraph == null) {
        this.pressureGraph = system.addLineChart(this.barometricPressureSensor,
          e.pageX - this.canvas.width / 2, e.pageY - this.canvas.height * 4 / 5, "Pressure Line Chart #" + Date.now().toString(16));
      } else {
        this.pressureGraph.setVisible(!this.pressureGraph.isVisible());
      }
      if (this.pressureGraph.isVisible()) {
        this.pressureGraph.draw();
        this.pressureGraph.bringForward();
      }
      system.storeLineChartStates();
      return;
    }

  };

  private mouseMove = (e: MouseEvent): void => {

    e.preventDefault();

    let rect = this.canvas.getBoundingClientRect();
    let dx = e.clientX - rect.x;
    let dy = e.clientY - rect.y;

    if (this.redLedLight.contains(dx, dy)) {
      this.mouseOverObject = this.redLedLight;
      this.canvas.style.cursor = "pointer";
    } else if (this.greenLedLight.contains(dx, dy)) {
      this.mouseOverObject = this.greenLedLight;
      this.canvas.style.cursor = "pointer";
    } else if (this.blueLedLight.contains(dx, dy)) {
      this.mouseOverObject = this.blueLedLight;
      this.canvas.style.cursor = "pointer";
    } else if (this.buttonA.contains(dx, dy)) {
      this.mouseOverObject = this.buttonA;
      this.canvas.style.cursor = "pointer";
    } else if (this.buttonB.contains(dx, dy)) {
      this.mouseOverObject = this.buttonB;
      this.canvas.style.cursor = "pointer";
    } else if (this.buttonC.contains(dx, dy)) {
      this.mouseOverObject = this.buttonC;
      this.canvas.style.cursor = "pointer";
    } else if (this.temperatureSensor.contains(dx, dy)) {
      this.mouseOverObject = this.temperatureSensor;
      this.canvas.style.cursor = "pointer";
    } else if (this.barometricPressureSensor.contains(dx, dy)) {
      this.mouseOverObject = this.barometricPressureSensor;
      this.canvas.style.cursor = "pointer";
    } else if (this.handles[0].contains(dx, dy)) {
      this.mouseOverObject = this.handles[0];
      this.canvas.style.cursor = "move";
    } else if (this.handles[1].contains(dx, dy)) {
      this.mouseOverObject = this.handles[1];
      this.canvas.style.cursor = "move";
    } else if (this.handles[2].contains(dx, dy)) {
      this.mouseOverObject = this.handles[2];
      this.canvas.style.cursor = "move";
    } else if (this.handles[3].contains(dx, dy)) {
      this.mouseOverObject = this.handles[3];
      this.canvas.style.cursor = "move";
    } else {
      let onRgbLedLight = false;
      for (let light of this.rgbLedLights) {
        if (light.contains(dx, dy)) {
          this.mouseOverObject = light;
          this.canvas.style.cursor = "pointer";
          onRgbLedLight = true;
          break;
        }
      }
      if (!onRgbLedLight) {
        this.mouseOverObject = null;
        this.canvas.style.cursor = "default";
      }
    }
    this.draw();

  };

  drawToolTips(): void {
    let context = this.canvas.getContext('2d');
    let x = 0;
    let y = -25;
    if (this.mouseOverObject == this.redLedLight) {
      x += this.redLedLight.x + this.redLedLight.width / 2;
      y += this.redLedLight.y;
      context.drawTooltip(x, y, 20, 8, 10, 'Red LED light', true);
    } else if (this.mouseOverObject == this.greenLedLight) {
      x += this.greenLedLight.x + this.greenLedLight.width / 2;
      y += this.greenLedLight.y;
      context.drawTooltip(x, y, 20, 8, 10, 'Green LED light', true);
    } else if (this.mouseOverObject == this.blueLedLight) {
      x += this.blueLedLight.x + this.blueLedLight.width / 2;
      y += this.blueLedLight.y;
      context.drawTooltip(x, y, 20, 8, 10, 'Blue LED light', true);
    } else if (this.mouseOverObject == this.buttonA) {
      x += this.buttonA.x + this.buttonA.width / 2;
      y += this.buttonA.y;
      context.drawTooltip(x, y, 20, 8, 10, 'Button A', true);
    } else if (this.mouseOverObject == this.buttonB) {
      x += this.buttonB.x + this.buttonB.width / 2;
      y += this.buttonB.y;
      context.drawTooltip(x, y, 20, 8, 10, 'Button B', true);
    } else if (this.mouseOverObject == this.buttonC) {
      x += this.buttonC.x + this.buttonC.width / 2;
      y += this.buttonC.y;
      context.drawTooltip(x, y, 20, 8, 10, 'Button C', true);
    } else if (this.mouseOverObject == this.temperatureSensor) {
      x += this.temperatureSensor.x + this.temperatureSensor.width / 2;
      y += this.temperatureSensor.y;
      context.drawTooltip(x, y, 20, 8, 10, 'Temperature sensor', true);
    } else if (this.mouseOverObject == this.barometricPressureSensor) {
      x += this.barometricPressureSensor.x + this.barometricPressureSensor.width / 2;
      y += this.barometricPressureSensor.y;
      context.drawTooltip(x, y, 20, 8, 10, 'Barometric pressure sensor', true);
    } else if (this.mouseOverObject == this.handles[0]) {
      this.drawHandle(this.mouseOverObject, context);
      x += this.handles[0].getXmax() + 20;
      y += this.handles[0].getYmax() + 30;
      context.drawTooltip(x, y, 20, 8, 10, 'Upper-left handle', true);
    } else if (this.mouseOverObject == this.handles[1]) {
      this.drawHandle(this.mouseOverObject, context);
      x += this.handles[1].getXmin() - 30;
      y += this.handles[1].getYmax() + 30;
      context.drawTooltip(x, y, 20, 8, 10, 'Upper-right handle', true);
    } else if (this.mouseOverObject == this.handles[2]) {
      this.drawHandle(this.mouseOverObject, context);
      x += this.handles[2].getXmin() - 30;
      y += this.handles[2].getYmin() - 5;
      context.drawTooltip(x, y, 20, 8, 10, 'Lower-right handle', true);
    } else if (this.mouseOverObject == this.handles[3]) {
      this.drawHandle(this.mouseOverObject, context);
      x += this.handles[3].getXmax() + 20;
      y += this.handles[3].getYmin() - 5;
      context.drawTooltip(x, y, 20, 8, 10, 'Lower-left handle', true);
    }
  }

  updateFirebase(value): void {
    if (this.raspberryPi != null) {
      System.database.ref(this.stateKey).update(value);
    }
  }

  clearSensorData(): void {
    this.temperatureSensor.clear();
    this.barometricPressureSensor.clear();
  }

  turnoff(): void {
    this.redLedLight.on = false;
    this.greenLedLight.on = false;
    this.blueLedLight.on = false;
    for (let light of this.rgbLedLights) {
      light.on = false;
    }
    for (let i = 0; i < 4; i++) {
      this.alphanumericDisplays[i].setCharacter(null);
      this.decimalPointDisplays[i].setCharacter(null);
    }
    this.draw();
  }

  // by default, sensors transmit data every second. This can be adjusted through Firebase.
  updateFromFirebase(): void {
    let that = this;
    System.database.ref().on("value", function (snapshot) {
      if (that.raspberryPi != null) { // TODO: We should stop the incoming update instead of shortcircuiting here
        snapshot.forEach(function (child) {
          let childData = child.val();
          that.redLedLight.on = childData.redLed;
          that.greenLedLight.on = childData.greenLed;
          that.blueLedLight.on = childData.blueLed;
          that.buttonA.on = childData.redLed;
          that.buttonB.on = childData.greenLed;
          that.buttonC.on = childData.blueLed;
          if (that.redLedLight.on) {
            that.buzzer.beepButton("A");
          }
          if (that.greenLedLight.on) {
            that.buzzer.beepButton("B");
          }
          if (that.blueLedLight.on) {
            that.buzzer.beepButton("C");
          }
          if (childData.rainbowRgb) {
            for (let i = 0; i < that.rgbLedLights.length; i++) {
              let r = childData.rainbowRgb[i][0];
              let g = childData.rainbowRgb[i][1];
              let b = childData.rainbowRgb[i][2];
              that.rgbLedLights[i].on = r > 0 || g > 0 || b > 0;
              that.rgbLedLights[i].color = Util.rgbToHex(r, g, b);
            }
          }
          if (childData.allowTemperatureTransmission) {
            that.temperatureSensor.collectionInterval = childData.sensorDataCollectionInterval ? childData.sensorDataCollectionInterval * 0.001 : 1;
            if (childData.temperature !== that.temperatureSensor.data[that.temperatureSensor.data.length - 1]) {
              that.temperatureSensor.data.push(<number>childData.temperature);
              if (that.temperatureGraph) {
                that.temperatureGraph.draw();
              }
              let t: number = childData.temperature;
              let s: string = t.toString();
              let i: number = s.indexOf(".");
              if (i > 0 && i < 4) {
                that.decimalPointDisplays[i - 1].setCharacter(".");
              }
              let integerPart: string = s.substring(0, i);
              let decimalPart: string = s.substring(i + 1);
              s = (integerPart + decimalPart).substr(0, 4);
              for (i = 0; i < 4; i++) {
                that.alphanumericDisplays[i].setCharacter(s[i]);
              }
            }
          }
          if (childData.allowBarometricPressureTransmission) {
            that.barometricPressureSensor.collectionInterval = childData.sensorDataCollectionInterval ? childData.sensorDataCollectionInterval * 0.001 : 1;
            if (childData.barometricPressure !== that.barometricPressureSensor.data[that.barometricPressureSensor.data.length - 1]) {
              that.barometricPressureSensor.data.push(<number>childData.barometricPressure);
              if (that.pressureGraph) {
                that.pressureGraph.draw();
              }
              let t: number = childData.barometricPressure;
              let s: string = t.toString();
              let i: number = s.indexOf(".");
              if (i > 0 && i < 4) {
                that.decimalPointDisplays[i - 1].setCharacter(".");
              }
              let integerPart: string = s.substring(0, i);
              let decimalPart: string = s.substring(i + 1);
              s = (integerPart + decimalPart).substr(0, 4);
              for (i = 0; i < 4; i++) {
                that.alphanumericDisplays[i].setCharacter(s[i]);
              }
            }
          }
          that.draw();
        });
      }
    });
  }

  public getProperties(): string {
    let rgbLedHtml: string = "";
    for (let i = 0; i < this.rgbLedLights.length; i++) {
      rgbLedHtml += "<tr><td>RGB LED Light</td><td>" + this.rgbLedLights[i].name + "</td><td>" + this.rgbLedLights[i].color + "</td></tr>";
    }
    return `<div style="font-size: 90%; overflow-y: auto;">
              <table class="w3-table-all w3-left w3-hoverable">
                <thead>
                  <tr class="w3-gray">
                  <th>Component</th>
                  <th>Name</th>
                  <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Momentary Button A</td>
                    <td>${this.buttonA.name}</td>
                    <td>${this.buttonA.on}</td>
                  </tr>
                  <tr>
                    <td>Momentary Button B</td>
                    <td>${this.buttonB.name}</td>
                    <td>${this.buttonB.on}</td>
                  </tr>
                  <tr>
                    <td>Momentary Button C</td>
                    <td>${this.buttonC.name}</td>
                    <td>${this.buttonC.on}</td>
                  </tr>
                  <tr>
                    <td>Red LED Light</td>
                    <td>${this.redLedLight.name}</td>
                    <td>${this.redLedLight.on}</td>
                  </tr>
                  <tr>
                    <td>Green LED Light</td>
                    <td>${this.greenLedLight.name}</td>
                    <td>${this.greenLedLight.on}</td>
                  </tr>
                  <tr>
                    <td>Blue LED Light</td>
                    <td>${this.blueLedLight.name}</td>
                    <td>${this.blueLedLight.on}</td>
                  </tr>
                  <tr>
                    <td>Temperature Sensor</td>
                    <td>${this.temperatureSensor.name}</td>
                    <td>${this.temperatureSensor.data.length > 0 ? this.temperatureSensor.data[this.temperatureSensor.data.length - 1].toFixed(2) : "NA"}</td>
                  </tr>
                  <tr>
                    <td>Barometric Pressure Sensor</td>
                    <td>${this.barometricPressureSensor.name}</td>
                    <td>${this.barometricPressureSensor.data.length > 0 ? this.barometricPressureSensor.data[this.barometricPressureSensor.data.length - 1].toFixed(2) : "NA"}</td>
                  </tr>` + rgbLedHtml + `
                </tbody>
              </table>
            </div>`;
  }

}
