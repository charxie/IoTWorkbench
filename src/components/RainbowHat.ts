/*
 * @author Charles Xie
 */

import {Hat} from "./Hat";
import {RaspberryPi} from "./RaspberryPi";
import {LedDisplay} from "./LedDisplay";
import {Buzzer} from "./Buzzer";
import {LedLight} from "./LedLight";
import {Button} from "./Button";
import {Sensor} from "./Sensor";
import {System} from "../System";
import {system} from "../Main";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {ColorPicker} from "../tools/ColorPicker";

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

  indexOfSelectedRgbLedLight: number = -1;
  private stateId: string = "rainbow_hat_default";
  private mouseOverObject: any;
  private boardImage: HTMLImageElement;

  constructor(canvasId: string, uid: string) {
    super(canvasId);

    this.uid = uid;
    this.canvas.addEventListener("mousedown", this.mouseDown, false);
    this.canvas.addEventListener("mouseup", this.mouseUp, false);
    this.canvas.addEventListener("mousemove", this.mouseMove, false);
    this.canvas.addEventListener('contextmenu', this.openContextMenu, false);

    this.redLedLight = new LedLight(this, "LED Light", "red", 4, 8, 10, 65, 233, 18, 8);
    this.greenLedLight = new LedLight(this, "LED Light", "green", 4, 8, 10, 147, 233, 18, 8);
    this.blueLedLight = new LedLight(this, "LED Light", "blue", 4, 8, 10, 230, 233, 18, 8);
    this.buttonA = new Button(this, "Button A", 38, 245, 72, 24);
    this.buttonB = new Button(this, "Button B", 120, 245, 72, 24);
    this.buttonC = new Button(this, "Button C", 203, 245, 72, 24);
    this.buzzer = new Buzzer(this, "Piezo Buzzer", 35, 170, 20, 20);
    this.temperatureSensor = new Sensor(this, "Temperature", "°C", 152, 108, 12, 12);
    this.barometricPressureSensor = new Sensor(this, "Pressure", "hPa", 187, 115, 20, 10);
    this.rgbLedLights.push(new LedLight(this, "RGB LED Light", "black", 16, 12, 2, 251, 78, 20, 20));
    this.rgbLedLights.push(new LedLight(this, "RGB LED Light", "black", 16, 12, 2, 218, 62, 20, 20));
    this.rgbLedLights.push(new LedLight(this, "RGB LED Light", "black", 16, 12, 2, 183, 53, 20, 20));
    this.rgbLedLights.push(new LedLight(this, "RGB LED Light", "black", 16, 12, 2, 147, 50, 20, 20));
    this.rgbLedLights.push(new LedLight(this, "RGB LED Light", "black", 16, 12, 2, 111, 53, 20, 20));
    this.rgbLedLights.push(new LedLight(this, "RGB LED Light", "black", 16, 12, 2, 76, 62, 20, 20));
    this.rgbLedLights.push(new LedLight(this, "RGB LED Light", "black", 16, 12, 2, 44, 78, 20, 20));
    this.alphanumericDisplays.push(new LedDisplay(this, "LED Display", 34, 214, 33, 65));
    this.alphanumericDisplays.push(new LedDisplay(this, "LED Display", 95, 214, 33, 65));
    this.alphanumericDisplays.push(new LedDisplay(this, "LED Display", 156, 214, 33, 65));
    this.alphanumericDisplays.push(new LedDisplay(this, "LED Display", 218, 214, 33, 65));
    this.decimalPointDisplays.push(new LedDisplay(this, "LED Display", 78, 214, 33, 65));
    this.decimalPointDisplays.push(new LedDisplay(this, "LED Display", 139, 214, 33, 65));
    this.decimalPointDisplays.push(new LedDisplay(this, "LED Display", 200, 214, 33, 65));
    this.decimalPointDisplays.push(new LedDisplay(this, "LED Display", 261, 214, 33, 65));
    for (let i = 0; i < this.decimalPointDisplays.length; i++) {
      this.decimalPointDisplays[i].fontSize = "40px";
    }

    this.handles.push(new Rectangle(5, 5, 30, 30));
    this.handles.push(new Rectangle(290, 5, 30, 30));
    this.handles.push(new Rectangle(290, 250, 30, 30));
    this.handles.push(new Rectangle(5, 250, 30, 30));

    this.boardImage = new Image();
    this.boardImage.src = rainbowHatImage;
    this.setY(20);

    this.updateFromFirebase();
  }

  public setSelectedRgbLedLightColor(color: string) {
    if (this.indexOfSelectedRgbLedLight >= 0) {
      this.rgbLedLights[this.indexOfSelectedRgbLedLight].color = color;
      this.draw();
      let list = [];
      for (let i = 0; i < this.rgbLedLights.length; i++) {
        let a = [];
        let c = Util.hexToRgb(this.rgbLedLights[i].color);
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
    for (let i = 0; i < this.rgbLedLights.length; i++) {
      this.rgbLedLights[i].draw(ctx);
    }
    for (let i = 0; i < this.alphanumericDisplays.length; i++) {
      this.alphanumericDisplays[i].draw(ctx);
    }
    for (let i = 0; i < this.decimalPointDisplays.length; i++) {
      this.decimalPointDisplays[i].draw(ctx);
    }
  }

  public whichRaspberryPi(): number {
    let r1 = new Rectangle(this.getX(), this.getY(), this.getWidth(), this.getHeight());
    for (let i = system.mcus.length - 1; i >= 0; i--) {
      let mcu = system.mcus[i];
      if (mcu instanceof RaspberryPi) {
        let a = 20;
        if (r1.intersectRect(new Rectangle(mcu.getX() + a, mcu.getY() + a, mcu.getWidth() - 2 * a, mcu.getHeight() - 2 * a))) {
          return i;
        }
      }
    }
    return -1;
  }

  public attach(raspberryPi: RaspberryPi): void {
    super.attach(raspberryPi);
    if (raspberryPi != null) {
      this.setX(raspberryPi.getX());
      this.setY(raspberryPi.getY());
      localStorage.setItem("Attachment: " + this.getUid(), raspberryPi.uid);
    } else {
      localStorage.removeItem("Attachment: " + this.getUid());
    }
  }

  private openContextMenu = (e: MouseEvent): void => {
    e.preventDefault();
    this.selected = true;
    let rect = this.canvas.getBoundingClientRect();
    let dx = e.clientX - rect.x;
    let dy = e.clientY - rect.y;
    this.indexOfSelectedRgbLedLight = -1;
    for (let i = 0; i < this.rgbLedLights.length; i++) {
      if (this.rgbLedLights[i].contains(dx, dy)) {
        this.indexOfSelectedRgbLedLight = i;
        break;
      }
    }
    if (this.indexOfSelectedRgbLedLight >= 0) {
      let menu = document.getElementById("colorpicker-context-menu") as HTMLMenuElement;
      menu.style.left = e.clientX + "px";
      menu.style.top = (e.clientY - document.getElementById("tabs").getBoundingClientRect().bottom) + "px";
      menu.classList.add("show-menu");
      if (system.colorPicker == null) {
        system.colorPicker = new ColorPicker();
      }
      system.colorPicker.setColorLabel(document.getElementById("colorpicker-label"));
      system.colorPicker.setColorCode(document.getElementById("colorpicker-hex-code") as HTMLInputElement);
      system.colorPicker.setSelectedColor(this.rgbLedLights[this.indexOfSelectedRgbLedLight].color);
      system.colorPicker.draw();
      system.colorPicker.setSelectedPoint();
      document.getElementById("colorpicker-title").innerText = "RGB LED Light " + this.indexOfSelectedRgbLedLight;
    } else {
      let menu = document.getElementById("rainbow-hat-context-menu") as HTMLMenuElement;
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
      system.temperatureGraph.setVisible(!system.temperatureGraph.isVisible());
      if (system.temperatureGraph.isVisible()) {
        system.temperatureGraph.draw();
        system.temperatureGraph.bringForward();
      }
      localStorage.setItem("Visible: " + system.temperatureGraph.getUid(), system.temperatureGraph.isVisible() ? "true" : "false");
      return;
    }

    if (this.barometricPressureSensor.contains(dx, dy)) {
      system.pressureGraph.setVisible(!system.pressureGraph.isVisible());
      if (system.pressureGraph.isVisible()) {
        system.pressureGraph.draw();
        system.pressureGraph.bringForward();
      }
      localStorage.setItem("Visible: " + system.pressureGraph.getUid(), system.pressureGraph.isVisible() ? "true" : "false");
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
      for (let i = 0; i < this.rgbLedLights.length; i++) {
        if (this.rgbLedLights[i].contains(dx, dy)) {
          this.mouseOverObject = this.rgbLedLights[i];
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
    System.database.ref(this.stateId).update(value);
  }

  // by default, sensors transmit data every second. This can be adjusted through Firebase.
  updateFromFirebase(): void {
    let that = this;
    System.database.ref().on("value", function (snapshot) {
      snapshot.forEach(function (child) {
        let childData = child.val();
        that.redLedLight.on = childData.redLed;
        that.greenLedLight.on = childData.greenLed;
        that.blueLedLight.on = childData.blueLed;
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
          that.temperatureSensor.data.push(<number>childData.temperature);
          system.temperatureGraph.draw();
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
        if (childData.allowBarometricPressureTransmission) {
          that.barometricPressureSensor.collectionInterval = childData.sensorDataCollectionInterval ? childData.sensorDataCollectionInterval * 0.001 : 1;
          that.barometricPressureSensor.data.push(<number>childData.barometricPressure);
          system.pressureGraph.draw();
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
        that.draw();
      });
    });
  }

}
