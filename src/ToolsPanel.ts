/*
 * @author Charles Xie
 */

export class ToolsPanel {

  getUi(): string {
    return `<div style="overflow-y: auto; height:300px;"><h1>Tools</h1><h2>Boards</h2></div>`;
  }

  render(selectorId: string): void {
    let element = document.getElementById(selectorId);
    element.innerHTML = this.getUi();
  }

}
