/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";

export class Beeper extends Block {

  private frequency: number = 800;
  private volume: number = 0.01;
  private oscillatorType: string = "sine"; // square, sine, triangle, sawtooth
  private portI: Port;
  private portV: Port;
  private portF: Port;
  private barHeight: number;
  private audioContext: AudioContext;
  private oscillator: OscillatorNode;
  private gain: GainNode;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly oscillatorType: string;
    readonly volume: number;
    readonly frequency: number;

    constructor(beeper: Beeper) {
      this.name = beeper.name;
      this.uid = beeper.uid;
      this.x = beeper.x;
      this.y = beeper.y;
      this.width = beeper.width;
      this.height = beeper.height;
      this.oscillatorType = beeper.oscillatorType;
      this.volume = beeper.volume;
      this.frequency = beeper.frequency;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#C0C0C0";
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 4;
    this.portI = new Port(this, true, "I", 0, this.barHeight + dh, false);
    this.portV = new Port(this, true, "V", 0, this.barHeight + 2 * dh, false);
    this.portF = new Port(this, true, "F", 0, this.barHeight + 3 * dh, false);
    this.ports.push(this.portI);
    this.ports.push(this.portV);
    this.ports.push(this.portF);
  }

  getCopy(): Block {
    let beeper = new Beeper("Beeper #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    beeper.oscillatorType = this.oscillatorType;
    beeper.volume = this.volume;
    beeper.frequency = this.frequency;
    return beeper;
  }

  destroy(): void {
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (e) {
        console.log(e.stack);
      }
    }
  }

  setOscillatorType(oscillatorType: string): void {
    this.oscillatorType = oscillatorType;
  }

  getOscillatorType(): string {
    return this.oscillatorType;
  }

  setVolume(volume: number): void {
    this.volume = volume;
    if (this.gain) {
      this.gain.gain.value = this.volume;
    }
  }

  getVolume(): number {
    return this.volume;
  }

  setFrequency(frequency: number): void {
    this.frequency = frequency;
    if (this.oscillator) {
      this.oscillator.frequency.value = this.frequency;
    }
  }

  getFrequency(): number {
    return this.frequency;
  }

  draw(ctx: CanvasRenderingContext2D): void {

    // draw the upper bar with shade
    let shade = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.barHeight);
    shade.addColorStop(0, "white");
    shade.addColorStop(this.iconic ? 0.4 : 0.2, Util.adjust(this.color, 100));
    shade.addColorStop(1, this.color);
    ctx.fillStyle = shade;
    ctx.fillHalfRoundedRect(this.x, this.y, this.width, this.barHeight, this.radius, "Top");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y, this.width, this.barHeight, this.radius, "Top");
    if (!this.iconic) {
      ctx.lineWidth = 0.75;
      ctx.font = "14px Arial";
      ctx.fillStyle = "black";
      let titleWidth = ctx.measureText(this.name).width;
      ctx.fillText(this.name, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
    }

    // draw the beeper area
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.fillHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");

    let centerX = this.x + this.width / 2;
    let centerY = this.y + (this.height + this.barHeight) / 2;
    let radius = this.iconic ? 2 : 8;
    ctx.fillStyle = "gray";
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    if (this.portI.getValue()) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "gray";
      let angle = 0.25 * Math.PI;
      for (let i = 0; i < 4; i++) {
        let r = radius + i * 5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, -angle, angle);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, Math.PI - angle, Math.PI + angle);
        ctx.stroke();
      }
    }

    // draw the port
    ctx.font = this.iconic ? "9px Arial" : "12px Arial";
    ctx.strokeStyle = "black";
    this.portI.draw(ctx, this.iconic);
    this.portV.draw(ctx, this.iconic);
    this.portF.draw(ctx, this.iconic);

    if (this.selected) {
      this.highlightSelection(ctx);
    }

  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    let volume = this.portV.getValue();
    if (volume) {
      this.volume = volume;
    }
    let frequency = this.portF.getValue();
    if (frequency) {
      this.frequency = frequency;
    }
    let on = this.portI.getValue();
    if (on == true) {
      this.startBeep();
    } else {
      this.stopBeep();
    }
  }

  refreshView(): void {
    super.refreshView();
    this.updateModel();
    let dh = (this.height - this.barHeight) / 4;
    this.portI.setY(this.barHeight + dh);
    this.portV.setY(this.barHeight + 2 * dh);
    this.portF.setY(this.barHeight + 3 * dh);
  }

  startBeep(): void {
    if (this.audioContext == null) {
      this.audioContext = new AudioContext();
    } else {
      this.audioContext.resume();
    }
    if (this.oscillator) {
      this.oscillator.disconnect();
    }
    this.oscillator = this.audioContext.createOscillator();
    if (this.gain) {
      this.gain.disconnect();
    }
    this.gain = this.audioContext.createGain();
    this.oscillator.connect(this.gain);
    this.gain.connect(this.audioContext.destination);
    if (this.oscillatorType == "sine" || this.oscillatorType == "square" || this.oscillatorType == "triangle" || this.oscillatorType == "sawtooth") {
      this.oscillator.type = this.oscillatorType;
    } else {
      this.oscillatorType = "sine";
    }
    this.oscillator.frequency.value = this.frequency;
    this.gain.gain.value = this.volume;
    this.oscillator.start();
  }

  stopBeep(): void {
    if (this.audioContext != null) {
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
      }
      if (this.gain) {
        this.gain.disconnect();
      }
      this.audioContext.suspend();
    }
  }

}
