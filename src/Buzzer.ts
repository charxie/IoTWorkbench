/*
 * @author Charles Xie
 */

import {Board} from "./Board";
import {ElectronicComponent} from "./ElectronicComponent";
import {system} from "./Main";

export class Buzzer implements ElectronicComponent {

  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  on: boolean;

  private readonly board: Board;
  private audioContext: AudioContext;

  constructor(board: Board, name: string, x: number, y: number, width: number, height: number) {
    this.board = board;
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    if (this.on) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "white";
      let centerX = this.x + this.width / 2;
      let centerY = this.y + this.height / 2;
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
    ctx.restore();
  }

  public contains(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }

  public beep(volume: number, frequency: number, duration: number): void {
    this.on = true;
    if (this.audioContext == null) this.audioContext = new AudioContext();
    let v = this.audioContext.createOscillator();
    let u = this.audioContext.createGain();
    v.connect(u);
    v.frequency.value = frequency;
    v.type = "square";
    u.connect(this.audioContext.destination);
    u.gain.value = volume * 0.01;
    v.start(this.audioContext.currentTime);
    v.stop(this.audioContext.currentTime + duration * 0.001);
    let that = this;
    setTimeout(function () {
      that.on = false;
      system.rainbowHat.draw();
    }, 200);
  }

}
