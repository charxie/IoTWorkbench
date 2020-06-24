/*
 * @author Charles Xie
 */

export class ElectricField1D {

  private intensity: number = 0.0001;
  private frequency: number = 0.05;
  private phase: number = 0;
  private duration: number = 10000000;

  constructor() {
  }

  copy(): ElectricField1D {
    let c = new ElectricField1D();
    c.intensity = this.intensity;
    c.frequency = this.frequency;
    c.phase = this.phase;
    c.duration = this.duration;
    return c;
  }

  public getValue(time: number): number {
    return this.intensity * Math.sin(this.frequency * time + this.phase);
  }

  public setPhase(phase: number): void {
    this.phase = phase;
  }

  public getPhase(): number {
    return this.phase;
  }

  public setIntensity(intensity: number): void {
    this.intensity = intensity;
  }

  public getIntensity(): number {
    return this.intensity;
  }

  public setFrequency(frequency: number): void {
    this.frequency = frequency;
  }

  public getFrequency(): number {
    return this.frequency;
  }

  public setDuration(duration: number): void {
    this.duration = duration;
  }

  public getDuration(): number {
    return this.duration;
  }

}
