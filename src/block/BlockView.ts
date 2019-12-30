/*
 * @author Charles Xie
 */

import {Flowchart} from "./Flowchart";
import {closeAllContextMenus, contextMenus, sound} from "../Main";
import {Movable} from "../Movable";
import {Block} from "./Block";
import {FunctionBlock} from "./FunctionBlock";
import {UnaryFunctionBlock} from "./UnaryFunctionBlock";
import {BinaryFunctionBlock} from "./BinaryFunctionBlock";
import {NegationBlock} from "./NegationBlock";
import {LogicBlock} from "./LogicBlock";
import {MathBlock} from "./MathBlock";
import {HatBlock} from "./HatBlock";
import {Port} from "./Port";
import {Connector} from "./Connector";
import {PortConnector} from "./PortConnector";
import {Slider} from "./Slider";

export class BlockView {

  flowchart: Flowchart;
  skipMainMouseEvent: boolean = false; // when a block is handling its own mouse events, set this flag true
  readonly canvas: HTMLCanvasElement;

  private selectedMovable: Movable;
  private selectedPort: Port;
  private selectedPortConnector: PortConnector;
  private mouseDownRelativeX: number;
  private mouseDownRelativeY: number;
  private draggedElementId: string;
  private connectorOntheFly: Connector;
  private gridSize: number = 100;
  private overWhat: any;

  constructor(canvasId: string, flowchart: Flowchart) {
    this.flowchart = flowchart;
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.canvas.addEventListener("mousedown", this.mouseDown.bind(this), false);
    this.canvas.addEventListener("mouseup", this.mouseUp.bind(this), false);
    this.canvas.addEventListener("mousemove", this.mouseMove.bind(this), false);
    this.canvas.addEventListener('contextmenu', this.openContextMenu.bind(this), false);
    document.addEventListener("mouseleave", this.mouseLeave.bind(this), false);

    this.connectorOntheFly = new Connector();

    let playground = document.getElementById("block-playground") as HTMLDivElement;

    // drag and drop support
    let that = this;
    playground.addEventListener("dragstart", function (e) {
      that.draggedElementId = (<HTMLElement>e.target).id;
    });

    // prevent default to allow drop
    playground.addEventListener("dragover", function (e) {
      e.preventDefault();
    }, false);

    playground.addEventListener("drop", function (e) {
      e.preventDefault();
      let id = (<HTMLElement>e.target).id;
      if (id == "block-view") {
        switch (that.draggedElementId) {
          case "unary-function-block":
            let unaryFunctionBlock = new UnaryFunctionBlock(e.offsetX, e.offsetY, 60, 80);
            unaryFunctionBlock.uid = "Unary Function Block #" + Date.now().toString(16);
            that.storeBlock(unaryFunctionBlock);
            break;
          case "binary-function-block":
            let binaryFunctionBlock = new BinaryFunctionBlock(e.offsetX, e.offsetY, 60, 100);
            binaryFunctionBlock.uid = "Binary Function Block #" + Date.now().toString(16);
            that.storeBlock(binaryFunctionBlock);
            break;
          case "logic-and-block":
            let andBlock = new LogicBlock(e.offsetX, e.offsetY, 60, 80, "AND Block", "AND");
            andBlock.uid = andBlock.name + " #" + Date.now().toString(16);
            that.storeBlock(andBlock);
            break;
          case "logic-not-block":
            let notBlock = new NegationBlock(e.offsetX, e.offsetY, 60, 80);
            notBlock.uid = notBlock.name + " #" + Date.now().toString(16);
            that.storeBlock(notBlock);
            break;
          case "math-add-block":
            let addBlock = new MathBlock(e.offsetX, e.offsetY, 60, 80, "Add Block", "+");
            addBlock.uid = addBlock.name + " #" + Date.now().toString(16);
            that.storeBlock(addBlock);
            break;
          case "slider-block":
            let slider = new Slider("Slider", e.offsetX, e.offsetY, 100, 60);
            slider.uid = slider.name + " #" + Date.now().toString(16);
            that.storeBlock(slider);
            break;
        }
      }
    }, false);
  }

  private storeBlock(block: Block): void {
    this.flowchart.blocks.push(block);
    this.draw();
    this.flowchart.storeBlocks();
    this.flowchart.storeBlockLocation(block);
  }

  public draw(): void {
    let ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    this.drawGrid(ctx);
    ctx.lineWidth = 3;
    for (let c of this.flowchart.connectors) {
      c.draw(ctx);
    }
    for (let b of this.flowchart.blocks) {
      b.draw(ctx);
    }
    if (this.selectedPort && !this.selectedPort.input) {
      this.connectorOntheFly.draw(ctx);
    }
  }

  public drawGrid(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    for (let i = 1; i <= this.canvas.height / this.gridSize; i++) {
      ctx.moveTo(0, i * this.gridSize);
      ctx.lineTo(this.canvas.width, i * this.gridSize);
    }
    for (let i = 1; i <= this.canvas.width / this.gridSize; i++) {
      ctx.moveTo(i * this.gridSize, 0);
      ctx.lineTo(i * this.gridSize, this.canvas.height);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

  // detect if (x, y) is inside this view
  public contains(x: number, y: number): boolean {
    return x > this.canvas.offsetLeft && x < this.canvas.offsetLeft + this.canvas.width && y > this.canvas.offsetTop && y < this.canvas.offsetTop + this.canvas.height;
  }

  public getX(): number {
    return 10;
  }

  public getY(): number {
    return 10;
  }

  public getWidth(): number {
    return this.canvas.width;
  }

  public getHeight(): number {
    return this.canvas.height;
  }

  private mouseDown(e: MouseEvent): void {
    this.selectedMovable = null;
    this.selectedPort = null;
    let x = e.offsetX;
    let y = e.offsetY;
    for (let i = this.flowchart.blocks.length - 1; i >= 0; i--) {
      if (this.flowchart.blocks[i].contains(x, y)) {
        this.selectedMovable = this.flowchart.blocks[i];
        break;
      }
    }
    if (this.selectedMovable != null) {
      this.mouseDownRelativeX = x - this.selectedMovable.getX();
      this.mouseDownRelativeY = y - this.selectedMovable.getY();
    } else {
      outerloop:
        for (let n = this.flowchart.blocks.length - 1; n >= 0; n--) {
          let block = this.flowchart.blocks[n];
          for (let p of block.ports) {
            if (p.near(x - block.x, y - block.y)) {
              this.selectedPort = p;
              if (this.selectedPort.input) {
                // if the selected port is an input, select one of its connectors
                this.selectedPortConnector = this.flowchart.getConnector(this.selectedPort);
              } else {
                // if the seleted port is an output, clicking on it starts a new connector
                let p = this.selectedPort.getAbsolutePoint();
                this.connectorOntheFly.x1 = p.x;
                this.connectorOntheFly.y1 = p.y;
              }
              break outerloop;
            }
          }
        }
    }

    for (let b of this.flowchart.blocks) {
      if (b instanceof Slider) {
        b.mouseDown(e);
      }
    }
  }

  private mouseUp(e: MouseEvent): void {
    if (!this.skipMainMouseEvent) {
      let x = e.offsetX;
      let y = e.offsetY;
      outerloop:
        for (let n = this.flowchart.blocks.length - 1; n >= 0; n--) {
          let block = this.flowchart.blocks[n];
          for (let p of block.ports) {
            if (p.input && p.near(x - block.x, y - block.y)) {
              if (this.flowchart.addPortConnector(this.selectedPort, p, "Port Connector #" + Date.now().toString(16))) {
                sound.play();
                this.flowchart.storePortConnectors();
              }
              break outerloop;
            }
          }
        }
      this.selectedMovable = null;
      this.selectedPort = null;
    }
    for (let b of this.flowchart.blocks) {
      if (b instanceof Slider) {
        b.mouseUp(e);
      }
    }
    this.draw();
    closeAllContextMenus(); // close all context menus upon mouse left click
  }

  private mouseMove(e: MouseEvent): void {
    if (!this.skipMainMouseEvent) {
      let x = e.offsetX;
      let y = e.offsetY;
      if (this.overWhat != null) {
        if (this.overWhat instanceof Port) {
          this.overWhat.close = false;
        }
        this.overWhat = null;
      }
      outerloop:
        for (let n = this.flowchart.blocks.length - 1; n >= 0; n--) {
          let block = this.flowchart.blocks[n];
          if (block.contains(x, y)) {
            this.overWhat = block;
            break;
          } else {
            for (let p of block.ports) {
              if (p.near(x - block.x, y - block.y)) {
                this.overWhat = p;
                break outerloop;
              }
            }
          }
        }

      if (this.selectedMovable != null) {
        this.moveTo(x, y, this.selectedMovable);
      } else if (this.selectedPort != null) {
        if (this.selectedPort.input) {
          if (this.selectedPortConnector) { // if the clicked port is an input and there is a connector to it
            this.flowchart.removePortConnector(this.selectedPortConnector);
            this.selectedPort = this.selectedPortConnector.output; // switch the selected port to the output end of the selected connector
            let p = this.selectedPort.getAbsolutePoint(); // this activates the connector on the fly that originates from the output end
            this.connectorOntheFly.x1 = p.x;
            this.connectorOntheFly.y1 = p.y;
            this.connectorOntheFly.x2 = e.offsetX;
            this.connectorOntheFly.y2 = e.offsetY;
            this.selectedPortConnector = null;
          }
        } else {
          this.connectorOntheFly.x2 = e.offsetX;
          this.connectorOntheFly.y2 = e.offsetY;
          if (this.overWhat instanceof Port) {
            this.overWhat.close = true;
          }
        }
      }
    }
    if (this.overWhat instanceof Port) {
      this.canvas.style.cursor = this.overWhat.input ? "default" : "grab";
    } else if (this.overWhat instanceof Block) {
      this.canvas.style.cursor = "move";
    } else {
      this.canvas.style.cursor = this.selectedPort != null ? "grabbing" : "default";
    }
    for (let b of this.flowchart.blocks) {
      if (b instanceof Slider) {
        b.mouseMove(e);
      }
    }
    this.draw();
  }

  private mouseLeave = (e: MouseEvent): void => {
    this.selectedMovable = null;
  };

  private openContextMenu(e: MouseEvent): void {
    e.preventDefault();
    let block = null;
    for (let i = this.flowchart.blocks.length - 1; i >= 0; i--) {
      if (this.flowchart.blocks[i].contains(e.offsetX, e.offsetY)) {
        block = this.flowchart.blocks[i];
        break;
      }
    }
    if (block instanceof MathBlock) {
      contextMenus.mathBlock.block = block;
      let menu = document.getElementById("math-block-context-menu") as HTMLMenuElement;
      menu.style.left = e.clientX + "px";
      menu.style.top = (e.clientY - document.getElementById("tabs").getBoundingClientRect().bottom) + "px";
      menu.classList.add("show-menu");
    } else if (block instanceof LogicBlock) {
      contextMenus.logicBlock.block = block;
      let menu = document.getElementById("logic-block-context-menu") as HTMLMenuElement;
      menu.style.left = e.clientX + "px";
      menu.style.top = (e.clientY - document.getElementById("tabs").getBoundingClientRect().bottom) + "px";
      menu.classList.add("show-menu");
    } else if (block instanceof FunctionBlock) {
      contextMenus.functionBlock.block = block;
      let menu = document.getElementById("function-block-context-menu") as HTMLMenuElement;
      menu.style.left = e.clientX + "px";
      menu.style.top = (e.clientY - document.getElementById("tabs").getBoundingClientRect().bottom) + "px";
      menu.classList.add("show-menu");
    } else if (block instanceof HatBlock) {
      contextMenus.hatBlock.block = block;
      let menu = document.getElementById("hat-block-context-menu") as HTMLMenuElement;
      menu.style.left = e.clientX + "px";
      menu.style.top = (e.clientY - document.getElementById("tabs").getBoundingClientRect().bottom) + "px";
      menu.classList.add("show-menu");
    } else if (block instanceof Slider) {
      contextMenus.slider.block = block;
      let menu = document.getElementById("slider-context-menu") as HTMLMenuElement;
      menu.style.left = e.clientX + "px";
      menu.style.top = (e.clientY - document.getElementById("tabs").getBoundingClientRect().bottom) + "px";
      menu.classList.add("show-menu");
    } else {
      let menu = document.getElementById("block-view-context-menu") as HTMLMenuElement;
      menu.style.left = e.clientX + "px";
      menu.style.top = (e.clientY - document.getElementById("tabs").getBoundingClientRect().bottom) + "px";
      menu.classList.add("show-menu");
    }
  }

  private moveTo(x: number, y: number, m: Movable): void {
    let dx = x - this.mouseDownRelativeX;
    let dy = y - this.mouseDownRelativeY;
    let xmax = this.canvas.width - m.getWidth();
    if (dx < 0) {
      dx = 0;
    } else if (dx > xmax) {
      dx = xmax;
    }
    let ymax = this.canvas.height - m.getHeight();
    if (dy < 0) {
      dy = 0;
    } else if (dy > ymax) {
      dy = ymax;
    }
    m.setX(dx);
    m.setY(dy);
    m.update();
    if (m instanceof Block) {
      this.flowchart.storeBlockLocation(m);
    }
  }

}
