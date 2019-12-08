/*
 * @author Charles Xie
 */

import {Board} from "./Board";
import {LedLight} from "./LedLight";
import {Button} from "./Button";
import {System} from "./System";
import {Sensor} from "./Sensor";

declare global {
  interface CanvasRenderingContext2D {
    drawTooltip(x, y, h, r, margin, text, centered);

    drawRoundedRect(x, y, w, h, r);

    fillRoundedRect(x, y, w, h, r);
  }
}

export class RainbowHat extends Board {

  private stateId = 'iot_workbench_default';

  public redLedLight: LedLight;
  public greenLedLight: LedLight;
  public blueLedLight: LedLight;
  public buttonA: Button;
  public buttonB: Button;
  public buttonC: Button;
  public temperatureSensor: Sensor;
  public barometricPressureSensor: Sensor;

  private mouseMoveObject;

  constructor(x: number, y: number, width: number, height: number) {
    super("rainbow-hat", x, y, width, height);
    this.redLedLight = new LedLight(this, 'red', 100, 258, 18, 8);
    this.greenLedLight = new LedLight(this, 'green', 182, 258, 18, 8);
    this.blueLedLight = new LedLight(this, 'blue', 264, 258, 18, 8);
    this.buttonA = new Button(this, 72, 270, 72, 22);
    this.buttonB = new Button(this, 155, 270, 72, 22);
    this.buttonC = new Button(this, 238, 270, 72, 22);
    this.temperatureSensor = new Sensor(this, 186, 133, 10, 10);
    this.barometricPressureSensor = new Sensor(this, 228, 141, 8, 8);
  }

  public draw(context: CanvasRenderingContext2D): void {
    super.draw(context);
    this.redLedLight.draw(context);
    this.greenLedLight.draw(context);
    this.blueLedLight.draw(context);
    this.buttonA.draw(context);
    this.buttonB.draw(context);
    this.buttonC.draw(context);
    this.drawToolTips(context);
  }

  public drawToolTips(context: CanvasRenderingContext2D) {
    let x = this.x;
    let y = this.y - 25;
    if (this.mouseMoveObject == this.redLedLight) {
      x += this.redLedLight.x + this.redLedLight.width / 2;
      y += this.redLedLight.y;
      context.drawTooltip(x, y, 20, 8, 10, 'Red LED light', true);
    } else if (this.mouseMoveObject == this.greenLedLight) {
      x += this.greenLedLight.x + this.greenLedLight.width / 2;
      y += this.greenLedLight.y;
      context.drawTooltip(x, y, 20, 8, 10, 'Green LED light', true);
    } else if (this.mouseMoveObject == this.blueLedLight) {
      x += this.blueLedLight.x + this.blueLedLight.width / 2;
      y += this.blueLedLight.y;
      context.drawTooltip(x, y, 20, 8, 10, 'Blue LED light', true);
    } else if (this.mouseMoveObject == this.buttonA) {
      x += this.buttonA.x + this.buttonA.width / 2;
      y += this.buttonA.y;
      context.drawTooltip(x, y, 20, 8, 10, 'Button A', true);
    } else if (this.mouseMoveObject == this.buttonB) {
      x += this.buttonB.x + this.buttonB.width / 2;
      y += this.buttonB.y;
      context.drawTooltip(x, y, 20, 8, 10, 'Button B', true);
    } else if (this.mouseMoveObject == this.buttonC) {
      x += this.buttonC.x + this.buttonC.width / 2;
      y += this.buttonC.y;
      context.drawTooltip(x, y, 20, 8, 10, 'Button C', true);
    } else if (this.mouseMoveObject == this.temperatureSensor) {
      x += this.temperatureSensor.x + this.temperatureSensor.width / 2;
      y += this.temperatureSensor.y;
      context.drawTooltip(x, y, 20, 8, 10, 'Temperature Sensor', true);
    } else if (this.mouseMoveObject == this.barometricPressureSensor) {
      x += this.barometricPressureSensor.x + this.barometricPressureSensor.width / 2;
      y += this.barometricPressureSensor.y;
      context.drawTooltip(x, y, 20, 8, 10, 'Barometric Pressure Sensor', true);
    }

  }

  public mouseDown(canvas: HTMLCanvasElement, e: MouseEvent): void {

    e.preventDefault();

    let rect = canvas.getBoundingClientRect();
    let dx = e.clientX - rect.x - this.x;
    let dy = e.clientY - rect.y - this.y;
    let context = canvas.getContext("2d");

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

    if (this.buttonA.inside(dx, dy)) {
      this.buttonA.on = true;
      this.buttonA.draw(context);
      this.redLedLight.on = true;
      this.redLedLight.draw(context);
      this.updateFirebase({redLed: true});
      return;
    }

    if (this.buttonB.inside(dx, dy)) {
      this.buttonB.on = true;
      this.buttonB.draw(context);
      this.greenLedLight.on = true;
      this.greenLedLight.draw(context);
      this.updateFirebase({greenLed: true});
      return;
    }

    if (this.buttonC.inside(dx, dy)) {
      this.buttonC.on = true;
      this.buttonC.draw(context);
      this.blueLedLight.on = true;
      this.blueLedLight.draw(context);
      this.updateFirebase({blueLed: true});
      return;
    }

  }

  public mouseUp(canvas: HTMLCanvasElement, e: MouseEvent): void {

    e.preventDefault();

    let rect = canvas.getBoundingClientRect();
    let dx = e.clientX - rect.x - this.x;
    let dy = e.clientY - rect.y - this.y;
    let context = canvas.getContext("2d");

    if (this.buttonA.inside(dx, dy)) {
      this.buttonA.on = false;
      this.buttonA.draw(context);
      this.redLedLight.on = false;
      this.redLedLight.draw(context);
      this.updateFirebase({redLed: false});
      return;
    }

    if (this.buttonB.inside(dx, dy)) {
      this.buttonB.on = false;
      this.buttonB.draw(context);
      this.greenLedLight.on = false;
      this.greenLedLight.draw(context);
      this.updateFirebase({greenLed: false});
      return;
    }

    if (this.buttonC.inside(dx, dy)) {
      this.buttonC.on = false;
      this.buttonC.draw(context);
      this.blueLedLight.on = false;
      this.blueLedLight.draw(context);
      this.updateFirebase({blueLed: false});
      return;
    }

  }

  public mouseMove(canvas: HTMLCanvasElement, e: MouseEvent): void {

    e.preventDefault();

    let rect = canvas.getBoundingClientRect();
    let dx = e.clientX - rect.x - this.x;
    let dy = e.clientY - rect.y - this.y;
    let context = canvas.getContext("2d");

    if (this.redLedLight.inside(dx, dy)) {
      this.mouseMoveObject = this.redLedLight;
    } else if (this.greenLedLight.inside(dx, dy)) {
      this.mouseMoveObject = this.greenLedLight;
    } else if (this.blueLedLight.inside(dx, dy)) {
      this.mouseMoveObject = this.blueLedLight;
    } else if (this.buttonA.inside(dx, dy)) {
      this.mouseMoveObject = this.buttonA;
    } else if (this.buttonB.inside(dx, dy)) {
      this.mouseMoveObject = this.buttonB;
    } else if (this.buttonC.inside(dx, dy)) {
      this.mouseMoveObject = this.buttonC;
    } else if (this.temperatureSensor.inside(dx, dy)) {
      this.mouseMoveObject = this.temperatureSensor;
    } else if (this.barometricPressureSensor.inside(dx, dy)) {
      this.mouseMoveObject = this.barometricPressureSensor;
    } else {
      this.mouseMoveObject = null;
    }

    this.draw(context);

  }

  private updateFirebase(value): void {
    System.database.ref(this.stateId).update(value);
  }

  private updateFromFirebase(): void {
    System.database.ref().on("value", function (snapshot) {
      snapshot.forEach(function (child) {
        let childData = child.val();
        this.redLedLight.on = childData.redLed;
        this.greenLedLight.on = childData.greenLed;
        this.blueLedLight.on = childData.blueLed;
        //temperature.push(<number>childData.temperature);
      });
    });
  }

}
