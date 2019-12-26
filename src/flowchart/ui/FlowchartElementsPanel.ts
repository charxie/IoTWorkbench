/*
 * @author Charles Xie
 */

export class FlowchartElementsPanel {

  getUi(): string {
    return `<h2 style="text-align: left; font-size: 18px; vertical-align: top; margin-top: 0; margin-bottom: 10px">
                <span style="font-size: 1.2em; color: teal; vertical-align: middle;"><i class="fas fa-cubes"></i></span> Elements</h2>
            <div id="components-scroller" style="overflow-y: auto; height: 400px; margin-top: 0; border-bottom: 2px solid lightgray; border-top: 2px solid lightgray">
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Logic</h3>
              <div class="row" style="margin-right: 10px; background-color: lightskyblue; border: 1px solid #b81900; border-radius: 4px">
                <div class="column">
                  <canvas draggable="true" id="r1" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;">
                </div>
              </div>
              <div class="vertical-divider"></div>
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> HATs</h3>
              <div class="row" style="margin-right: 10px;  background-color: lightblue; border: 1px solid #b81900; border-radius: 4px">
                <div class="column">
                  <canvas draggable="true" id="r2" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;">
               </div>
                <div class="column">
                  <canvas draggable="true" id="r3" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;">
               </div>
              </div>
            </div>`;
  }

  render(selectorId: string): void {
    let element = document.getElementById(selectorId);
    element.innerHTML = this.getUi();
  }

}
