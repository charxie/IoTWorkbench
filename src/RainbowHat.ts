/*
 * @author Charles Xie
 */

import {Board} from "./Board";
import {LedLight} from "./LedLight";
import {Button} from "./Button";
import {System} from "./System";
import {Sensor} from "./Sensor";
import {system} from "./Main";
import {Rectangle} from "./math/Rectangle";

// @ts-ignore
import rainbowHatImage from "./img/rainbow-hat.png";

export class RainbowHat extends Board {

  public redLedLight: LedLight;
  public greenLedLight: LedLight;
  public blueLedLight: LedLight;
  public buttonA: Button;
  public buttonB: Button;
  public buttonC: Button;
  public temperatureSensor: Sensor;
  public barometricPressureSensor: Sensor;

  public handles: Rectangle[] = [];

  private stateId: string = "rainbow_hat_default";
  private mouseOverObject: any;
  private boardImage: HTMLImageElement;

  constructor(canvasId: string) {
    super(canvasId);

    this.canvas.addEventListener("mousedown", this.mouseDown, false);
    this.canvas.addEventListener("mouseup", this.mouseUp, false);
    this.canvas.addEventListener("mousemove", this.mouseMove, false);
    this.canvas.addEventListener('contextmenu', this.openContextMenu, false);

    this.redLedLight = new LedLight(this, 'red', 65, 233, 18, 8);
    this.greenLedLight = new LedLight(this, 'green', 147, 233, 18, 8);
    this.blueLedLight = new LedLight(this, 'blue', 230, 233, 18, 8);
    this.buttonA = new Button(this, 38, 245, 72, 24);
    this.buttonB = new Button(this, 120, 245, 72, 24);
    this.buttonC = new Button(this, 203, 245, 72, 24);
    this.temperatureSensor = new Sensor(this, "Temperature", "°C", 152, 108, 12, 12);
    this.barometricPressureSensor = new Sensor(this, "Pressure", "hPa", 187, 115, 20, 10);

    this.handles.push(new Rectangle(5, 5, 30, 30));
    this.handles.push(new Rectangle(290, 5, 30, 30));
    this.handles.push(new Rectangle(290, 250, 30, 30));
    this.handles.push(new Rectangle(5, 250, 30, 30));

    this.boardImage = new Image();
    this.boardImage.src = rainbowHatImage;

    this.updateFromFirebase();
  }

  public draw(): void {
    let context = this.canvas.getContext('2d');
    context.drawImage(this.boardImage, 0, 0);
    this.redLedLight.draw(context);
    this.greenLedLight.draw(context);
    this.blueLedLight.draw(context);
    this.buttonA.draw(context);
    this.buttonB.draw(context);
    this.buttonC.draw(context);
    this.temperatureSensor.draw(context);
    this.barometricPressureSensor.draw(context);
    this.drawToolTips();
  }

  private openContextMenu = (e: MouseEvent): void => {
    e.preventDefault();
    let menu = document.getElementById("board-context-menu") as HTMLMenuElement;
    menu.style.left = e.clientX + "px";
    menu.style.top = e.clientY + "px";
    menu.classList.add("show-menu");
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
      return;
    }

    if (this.buttonB.contains(dx, dy)) {
      this.buttonB.on = true;
      this.buttonB.draw(context);
      this.greenLedLight.on = true;
      this.greenLedLight.draw(context);
      this.updateFirebase({greenLed: true});
      return;
    }

    if (this.buttonC.contains(dx, dy)) {
      this.buttonC.on = true;
      this.buttonC.draw(context);
      this.blueLedLight.on = true;
      this.blueLedLight.draw(context);
      this.updateFirebase({blueLed: true});
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
      return;
    }

    if (this.barometricPressureSensor.contains(dx, dy)) {
      system.pressureGraph.setVisible(!system.pressureGraph.isVisible());
      if (system.pressureGraph.isVisible()) {
        system.pressureGraph.draw();
        system.pressureGraph.bringForward();
      }
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
      this.mouseOverObject = null;
      this.canvas.style.cursor = "default";
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
      context.drawTooltip(x, y, 20, 8, 10, 'Temperature Sensor', true);
    } else if (this.mouseOverObject == this.barometricPressureSensor) {
      x += this.barometricPressureSensor.x + this.barometricPressureSensor.width / 2;
      y += this.barometricPressureSensor.y;
      context.drawTooltip(x, y, 20, 8, 10, 'Barometric Pressure Sensor', true);
    } else if (this.mouseOverObject == this.handles[0]) {
      x += this.handles[0].getXmax() + 20;
      y += this.handles[0].getYmax() + 30;
      context.drawTooltip(x, y, 20, 8, 10, 'Upper-left handle', true);
    } else if (this.mouseOverObject == this.handles[1]) {
      x += this.handles[1].getXmin() - 30;
      y += this.handles[1].getYmax() + 30;
      context.drawTooltip(x, y, 20, 8, 10, 'Upper-right handle', true);
    } else if (this.mouseOverObject == this.handles[2]) {
      x += this.handles[2].getXmin() - 30;
      y += this.handles[2].getYmin() - 5;
      context.drawTooltip(x, y, 20, 8, 10, 'Lower-right handle', true);
    } else if (this.mouseOverObject == this.handles[3]) {
      x += this.handles[3].getXmax() + 20;
      y += this.handles[3].getYmin() - 5;
      context.drawTooltip(x, y, 20, 8, 10, 'Lower-left handle', true);
    }
  }

  whichHandle(x: number, y: number): number {
    for (let i = 0; i < this.handles.length; i++) {
      if (this.handles[i].contains(x, y)) return i;
    }
    return -1;
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
        if (childData.allowTemperatureTransmission) {
          that.temperatureSensor.collectionInterval = childData.sensorDataCollectionInterval ? childData.sensorDataCollectionInterval * 0.001 : 1;
          that.temperatureSensor.data.push(<number>childData.temperature);
          system.temperatureGraph.draw();
        }
        if (childData.allowBarometricPressureTransmission) {
          that.barometricPressureSensor.collectionInterval = childData.sensorDataCollectionInterval ? childData.sensorDataCollectionInterval * 0.001 : 1;
          that.barometricPressureSensor.data.push(<number>childData.barometricPressure);
          system.pressureGraph.draw();
        }
        that.draw();
      });
    });
  }

}
