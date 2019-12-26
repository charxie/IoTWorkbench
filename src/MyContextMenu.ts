/*
 * @author Charles Xie
 */

export abstract class MyContextMenu {

  id: string;

  abstract getUi(): string;

  abstract addListeners(): void;

  render(selectorId: string): void {
    let element = document.getElementById(selectorId);
    element.innerHTML = this.getUi();
  }

}
