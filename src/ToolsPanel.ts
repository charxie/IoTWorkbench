/*
 * @author Charles Xie
 */

export class ToolsPanel {

  getUi(): string {
    return `<h1><span style="background-color: #1c94c4">Tools</span></h1><h2>Boards</h2>`;
  }

  render(selectorId: string): void {
    let element = document.getElementById(selectorId);
    element.innerHTML = this.getUi();
  }

}
