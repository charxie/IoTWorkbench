/*
 * @author Charles Xie
 */

export class Sound {

  audioElement;

  constructor() {
    this.audioElement = document.createElement("audio");
    this.audioElement.setAttribute("preload", "auto");
    this.audioElement.setAttribute("controls", "none");
    this.audioElement.style.display = "none";
    document.body.appendChild(this.audioElement);
  }

  setSource(src: string): void {
    this.audioElement.src = src;
  }

  play(): void {
    this.audioElement.play();
  }

  stop(): void {
    this.audioElement.pause();
  }

}
