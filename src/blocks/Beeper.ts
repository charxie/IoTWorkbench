/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";

export class Beeper extends Block {

  private frequency: number = 800;
  private volume: number = 0.01;
  private portI: Port;
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

    constructor(beeper: Beeper) {
      this.name = beeper.name;
      this.uid = beeper.uid;
      this.x = beeper.x;
      this.y = beeper.y;
      this.width = beeper.width;
      this.height = beeper.height;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#C0C0C0";
    this.portI = new Port(this, true, "I", 0, this.height / 2, false);
    this.ports.push(this.portI);
    this.audioContext = new AudioContext();
  }

  getCopy(): Block {
    return new Beeper("Beeper #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
  }

  destroy(): void {
  }

  draw(ctx: CanvasRenderingContext2D): void {

    // draw the upper bar with shade
    this.barHeight = Math.min(30, this.height / 3);
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

    if (this.ports[0].getValue()) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "gray";
      let centerX = this.x + this.width / 2;
      let centerY = this.y + this.height / 2 + this.barHeight / 2;
      let angle = 0.25 * Math.PI;
      for (let i = 0; i < 4; i++) {
        let r = 5 + i * 5;
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

    if (this.selected) {
      this.highlightSelection(ctx);
    }

  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    let v = this.portI.getValue();
    if (v == true) {
      this.startBeep(1, 800);
    } else {
      this.stopBeep();
    }
  }

  refreshView(): void {
    this.updateModel();
    this.portI.setY(this.height / 2);
  }

  startBeep(volume: number, frequency: number): void {
    this.audioContext.resume();
    this.oscillator = this.audioContext.createOscillator();
    this.gain = this.audioContext.createGain();
    this.oscillator.connect(this.gain);
    this.gain.connect(this.audioContext.destination);
    this.oscillator.type = "square";
    this.oscillator.frequency.value = this.frequency;
    this.gain.gain.value = this.volume;
    this.oscillator.start();
  }

  stopBeep(): void {
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
