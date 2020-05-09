/*
 * @author Charles Xie
 */

import * as d3 from 'd3';
import * as cloud from 'd3-cloud';
import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {flowchart} from "../Main";

export class WordCloud extends Block {

  private static readonly stopwords = "i,me,my,myself,we,us,our,ours,ourselves,you,your,yours,yourself,yourselves,he,him,his,himself,she,her,hers,herself,it,its,itself,they,them,their,theirs,themselves,what,which,who,whom,whose,this,that,these,those,am,is,are,was,were,be,been,being,have,has,had,having,do,does,did,doing,will,would,should,can,could,ought,i'm,you're,he's,she's,it's,we're,they're,i've,you've,we've,they've,i'd,you'd,he'd,she'd,we'd,they'd,i'll,you'll,he'll,she'll,we'll,they'll,isn't,aren't,wasn't,weren't,hasn't,haven't,hadn't,doesn't,don't,didn't,won't,wouldn't,shan't,shouldn't,can't,cannot,couldn't,mustn't,let's,that's,who's,what's,here's,there's,when's,where's,why's,how's,a,an,the,and,but,if,or,because,as,until,while,of,at,by,for,with,about,against,between,into,through,during,before,after,above,below,to,from,up,upon,down,in,out,on,off,over,under,again,further,then,once,here,there,when,where,why,how,all,any,both,each,few,more,most,other,some,such,no,nor,not,only,own,same,so,than,too,very,say,says,said,shall";
  private portI: Port;
  private words: string[];
  private wordCount: { [key: string]: number; } = {};
  private viewWindowColor: string = "white";
  private viewWindow: Rectangle;
  private barHeight: number;
  private readonly viewMargin = {
    left: <number>4,
    right: <number>3,
    top: <number>4,
    bottom: <number>4
  };
  private cloudInstance;
  private layout;
  private wordColors;
  private wordScales;
  private wordProperties = [];
  private interpolateColor = d3.interpolatePuRd;
  private colorScheme: string = "PuRd";
  private alignment: string = "Random";
  private exclusion: string[] = [];

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly exclusion: string[];
    readonly alignment: string;
    readonly colorScheme: string;
    readonly viewWindowColor: string;

    constructor(b: WordCloud) {
      this.name = b.name;
      this.uid = b.uid;
      this.x = b.x;
      this.y = b.y;
      this.width = b.width;
      this.height = b.height;
      this.exclusion = b.exclusion;
      this.alignment = b.alignment;
      this.colorScheme = b.colorScheme;
      this.viewWindowColor = b.viewWindowColor;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#EECCDD";
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 2;
    this.portI = new Port(this, true, "I", 0, this.barHeight + dh, false)
    this.ports.push(this.portI);
    this.marginX = 25;
    this.cloudInstance = cloud.default();
    this.viewWindow = new Rectangle(0, 0, 1, 1);
  }

  getCopy(): Block {
    let copy = new WordCloud("Wordcloud #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.exclusion = [...this.exclusion];
    copy.alignment = this.alignment;
    copy.colorScheme = this.colorScheme;
    copy.viewWindowColor = this.viewWindowColor;
    return copy;
  }

  destroy(): void {
  }

  reset(): void {
    super.reset();
    this.erase();
  }

  erase(): void {
  }

  setExclusion(exclusion: string[]): void {
    this.exclusion = [...exclusion];
  }

  getExclusion(): string[] {
    return this.exclusion.slice();
  }

  setWidth(width: number): void {
    super.setWidth(width)
    this.viewMargin.left = this.viewMargin.right = 10;
    this.viewWindow.width = this.width - this.viewMargin.left - this.viewMargin.right;
  }

  setHeight(height: number): void {
    super.setHeight(height);
    this.barHeight = Math.min(30, this.height / 3);
    this.viewMargin.top = this.viewMargin.bottom = 10;
    this.viewWindow.height = this.height - this.barHeight - this.viewMargin.top - this.viewMargin.bottom;
  }

  setAlignment(alignment: string): void {
    this.alignment = alignment;
  }

  getAlignment(): string {
    return this.alignment;
  }

  setViewWindowColor(viewWindowColor: string): void {
    this.viewWindowColor = viewWindowColor;
  }

  getViewWindowColor(): string {
    return this.viewWindowColor;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    switch (flowchart.blockView.getBlockStyle()) {
      case "Shade":
        let shade = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.barHeight);
        shade.addColorStop(0, "white");
        shade.addColorStop(this.iconic ? 0.2 : 0.1, Util.adjust(this.color, -20));
        shade.addColorStop(1, Util.adjust(this.color, -100));
        ctx.fillStyle = shade;
        break;
      case "Plain":
        ctx.fillStyle = this.color;
        break;
    }
    ctx.fillHalfRoundedRect(this.x, this.y, this.width, this.barHeight, this.radius, "Top");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y, this.width, this.barHeight, this.radius, "Top");
    if (!this.iconic) {
      ctx.lineWidth = 0.75;
      ctx.font = "14px Arial";
      ctx.fillStyle = "white";
      let count = Object.keys(this.wordCount).length;
      let title = this.name + (count <= 0 ? "" : " (" + count + " words)");
      let titleWidth = ctx.measureText(title).width;
      ctx.fillText(title, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
    }

    // draw the space
    ctx.fillStyle = "#FDFFFD";
    ctx.beginPath();
    ctx.fillHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.drawHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.beginPath();
    this.viewWindow.x = this.x + this.viewMargin.left;
    this.viewWindow.y = this.y + this.barHeight + this.viewMargin.top;
    this.viewWindow.width = this.width - this.viewMargin.left - this.viewMargin.right;
    this.viewWindow.height = this.height - this.barHeight - this.viewMargin.top - this.viewMargin.bottom;
    ctx.rect(this.viewWindow.x, this.viewWindow.y, this.viewWindow.width, this.viewWindow.height);
    ctx.fillStyle = this.viewWindowColor;
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    if (this.iconic) {
      ctx.fillStyle = "black";
      ctx.font = "8px Arial";
      let h = ctx.measureText("M").width - 2;
      ctx.fillText("W", this.viewWindow.x + this.viewWindow.width / 2 - ctx.measureText("W").width / 2, this.viewWindow.y + this.viewWindow.height / 2 + h / 2);
    }

    // draw wordcloud
    if (!this.iconic) {
      if (this.layout !== undefined) {
        ctx.save();
        ctx.translate(this.viewWindow.x + this.viewWindow.width / 2, this.viewWindow.y + this.viewWindow.height / 2)
        for (let d of this.wordProperties) {
          ctx.save();
          ctx.font = d.size + "px " + d.font;
          ctx.fillStyle = this.wordColors(d.value);
          ctx.translate(d.x, d.y);
          ctx.rotate(d.rotate * Math.PI / 180);
          let textWidth = ctx.measureText(d.key).width;
          ctx.fillText(d.key, -textWidth / 2, 0);
          ctx.restore();
        }
        ctx.restore();
      }
    }

    // draw the port
    ctx.font = this.iconic ? "9px Arial" : "12px Arial";
    ctx.strokeStyle = "black";
    for (let p of this.ports) {
      p.draw(ctx, this.iconic);
    }

    if (this.selected) {
      this.highlightSelection(ctx);
    }

  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    let text = this.portI.getValue();
    if (text === undefined || typeof text !== "string") return;
    this.words = text.split(/[ '\-\(\)\*":;\[\]|{},.!?\n]+/);
    this.wordCount = {};
    if (this.words.length === 1) {
      this.wordCount[this.words[0]] = 1;
    } else {
      this.words.forEach(word => {
        word = word.toLowerCase();
        if (word !== "" && WordCloud.stopwords.indexOf(word) === -1 && this.exclusion.indexOf(word) === -1 && word.length > 1) {
          if (this.wordCount[word]) {
            this.wordCount[word]++;
          } else {
            this.wordCount[word] = 1;
          }
        }
      })
    }
    let count = Object.keys(this.wordCount).length;
    if (count > 0) {
      let shorterSide = Math.min(this.viewWindow.width, this.viewWindow.height);
      this.wordScales = d3.scaleLinear().domain([0, d3.max(d3.entries(this.wordCount), d => d.value)]).range([10, shorterSide / 5]);
      this.wordColors = d3.scaleLinear().domain([0, d3.max(d3.entries(this.wordCount), d => d.value)]).interpolate(() => this.interpolateColor);
      this.wordProperties.length = 0;
      this.layout = this.cloudInstance.size([this.viewWindow.width, this.viewWindow.height])
        .words(d3.entries(this.wordCount))
        .font("Impact")
        .padding(5)
        .fontSize(d => this.wordScales(d.value))
        .text(d => d.key)
        .on("word", d => this.wordProperties.push(d));
      switch (this.alignment) {
        case "Horizontal":
          this.layout.rotate(0);
          break;
        case "Vertical":
          this.layout.rotate(90);
          break;
        case "Random":
          this.layout.rotate(() => (~~(Math.random() * 6) - 3) * 30);
          break;
      }
      this.layout.start();
    }
  }

  refreshView(): void {
    super.refreshView();
    this.viewMargin.top = 10;
    this.viewMargin.bottom = 10;
    this.viewMargin.left = 10;
    this.viewMargin.right = 10;
    let dh = (this.height - this.barHeight) / 2;
    this.portI.setY(this.barHeight + dh);
  }

  getColorScheme(): string {
    return this.colorScheme;
  }

  setColorScheme(colorScheme: string): void {
    this.colorScheme = colorScheme;
    switch (this.colorScheme) {
      case "Reds":
        this.interpolateColor = d3.interpolateReds;
        break;
      case "Greens":
        this.interpolateColor = d3.interpolateGreens;
        break;
      case "Blues":
        this.interpolateColor = d3.interpolateBlues;
        break;
      case "Greys":
        this.interpolateColor = d3.interpolateGreys;
        break;
      case "Oranges":
        this.interpolateColor = d3.interpolateOranges;
        break;
      case "Purples":
        this.interpolateColor = d3.interpolatePurples;
        break;
      case "RdYlBu":
        this.interpolateColor = d3.interpolateRdYlBu;
        break;
      case "RdYlGn":
        this.interpolateColor = d3.interpolateRdYlGn;
        break;
      case "RdGy":
        this.interpolateColor = d3.interpolateRdGy;
        break;
      case "RdBu":
        this.interpolateColor = d3.interpolateRdBu;
        break;
      case "PuOr":
        this.interpolateColor = d3.interpolatePuOr;
        break;
      case "PiYG":
        this.interpolateColor = d3.interpolatePiYG;
        break;
      case "PRGn":
        this.interpolateColor = d3.interpolatePRGn;
        break;
      case "BrBG":
        this.interpolateColor = d3.interpolateBrBG;
        break;
      case "YlOrRd":
        this.interpolateColor = d3.interpolateYlOrRd;
        break;
      case "YlOrBr":
        this.interpolateColor = d3.interpolateYlOrBr;
        break;
      case "PuRd":
        this.interpolateColor = d3.interpolatePuRd;
        break;
      case "RdPu":
        this.interpolateColor = d3.interpolateRdPu;
        break;
      case "YlGnBu":
        this.interpolateColor = d3.interpolateYlGnBu;
        break;
      case "YlGn":
        this.interpolateColor = d3.interpolateYlGn;
        break;
      case "BuGn":
        this.interpolateColor = d3.interpolateBuGn;
        break;
      case "OrRd":
        this.interpolateColor = d3.interpolateOrRd;
        break;
      case "GnBu":
        this.interpolateColor = d3.interpolateGnBu;
        break;
      case "BuPu":
        this.interpolateColor = d3.interpolateBuPu;
        break;
      case "PuBu":
        this.interpolateColor = d3.interpolatePuBu;
        break;
      case "PuBuGn":
        this.interpolateColor = d3.interpolatePuBuGn;
        break;
      case "Rainbow":
        this.interpolateColor = d3.interpolateRainbow;
        break;
      case "Sinebow":
        this.interpolateColor = d3.interpolateSinebow;
        break;
      case "Cubehelix":
        this.interpolateColor = d3.interpolateCubehelixDefault;
        break;
      case "Warm":
        this.interpolateColor = d3.interpolateWarm;
        break;
      case "Cool":
        this.interpolateColor = d3.interpolateCool;
        break;
      case "Cividis":
        this.interpolateColor = d3.interpolateCividis;
        break;
      case "Viridis":
        this.interpolateColor = d3.interpolateViridis;
        break;
      case "Spectral":
        this.interpolateColor = d3.interpolateSpectral;
        break;
      case "Inferno":
        this.interpolateColor = d3.interpolateInferno;
        break;
      case "Magma":
        this.interpolateColor = d3.interpolateMagma;
        break;
      case "Plasma":
        this.interpolateColor = d3.interpolatePlasma;
        break;
      default:
        this.interpolateColor = d3.interpolateTurbo;
        break;
    }
  }

}
