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

  private static readonly common = "poop,i,me,my,myself,we,us,our,ours,ourselves,you,your,yours,yourself,yourselves,he,him,his,himself,she,her,hers,herself,it,its,itself,they,them,their,theirs,themselves,what,which,who,whom,whose,this,that,these,those,am,is,are,was,were,be,been,being,have,has,had,having,do,does,did,doing,will,would,should,can,could,ought,i'm,you're,he's,she's,it's,we're,they're,i've,you've,we've,they've,i'd,you'd,he'd,she'd,we'd,they'd,i'll,you'll,he'll,she'll,we'll,they'll,isn't,aren't,wasn't,weren't,hasn't,haven't,hadn't,doesn't,don't,didn't,won't,wouldn't,shan't,shouldn't,can't,cannot,couldn't,mustn't,let's,that's,who's,what's,here's,there's,when's,where's,why's,how's,a,an,the,and,but,if,or,because,as,until,while,of,at,by,for,with,about,against,between,into,through,during,before,after,above,below,to,from,up,upon,down,in,out,on,off,over,under,again,further,then,once,here,there,when,where,why,how,all,any,both,each,few,more,most,other,some,such,no,nor,not,only,own,same,so,than,too,very,say,says,said,shall";
  private portI: Port;
  private wordCount: { [key: string]: number; } = {};
  private viewWindowColor: string = "white";
  private viewWindow: Rectangle;
  private barHeight: number;
  private wordColors;
  private readonly viewMargin = {
    left: <number>4,
    right: <number>3,
    top: <number>4,
    bottom: <number>4
  };

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly viewWindowColor: string;

    constructor(b: WordCloud) {
      this.name = b.name;
      this.uid = b.uid;
      this.x = b.x;
      this.y = b.y;
      this.width = b.width;
      this.height = b.height;
      this.viewWindowColor = b.viewWindowColor;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#EE8866";
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 2;
    this.portI = new Port(this, true, "I", 0, this.barHeight + dh, false)
    this.ports.push(this.portI);
    this.viewWindow = new Rectangle(0, 0, 1, 1);
    this.marginX = 25;
    this.wordColors = d3.scaleLinear()
      .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
      .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);
  }

  getCopy(): Block {
    let copy = new WordCloud("Word Cloud #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
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
      ctx.save();
      ctx.translate(this.viewWindow.x, this.viewWindow.y);
      let count = Object.keys(this.wordCount).length;
      if (count > 0) {
        cloud.size([this.viewWindow.width, this.viewWindow.height])
          .words(this.wordCount)
          .font("Impact")
          .padding(5)
          .rotate(0)
          .on("end", this.drawWords);
      }
      ctx.restore();
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

  private drawWords(words): void {
    let fill = d3.scale.category20();
    d3.select("#block-view")
      .append("g")
      .attr("transform", "translate(" + this.viewWindow.width / 2 + "," + this.viewWindow.height / 2 + ")")
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .text(d => d.text)
      .style("font-size", d => d.size + "px")
      .style("font-family", d => d.font)
      .style("fill", (d, i) => fill(i))
      .attr("text-anchor", "middle")
      .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")");
  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    let text = this.portI.getValue();
    text = "physics chemistry physics";
    if (text === undefined) return;
    let words = text.split(/[ '\-\(\)\*":;\[\]|{},.!?]+/);
    if (words.length === 1) {
      this.wordCount[words[0]] = 1;
    } else {
      words.forEach(word => {
        word = word.toLowerCase();
        if (word !== "" && WordCloud.common.indexOf(word) === -1 && word.length > 1) {
          if (this.wordCount[word]) {
            this.wordCount[word]++;
          } else {
            this.wordCount[word] = 1;
          }
        }
      })
    }
    console.log(this.wordCount)
  }

  refreshView(): void {
    super.refreshView();
    this.viewMargin.top = 10;
    this.viewMargin.bottom = 40;
    this.viewMargin.left = 70;
    this.viewMargin.right = 16;
    let dh = (this.height - this.barHeight) / 2;
    this.portI.setY(this.barHeight + dh);
  }

}
