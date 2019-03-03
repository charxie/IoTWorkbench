/*
 * @author Charles Xie
 */

'use strict';

function LineChart(id, name, data, minimumValue, maximumValue) {

  let that = this;

  this.id = id;
  this.name = name;
  this.data = data;
  this.minimumValue = minimumValue;
  this.maximumValue = maximumValue;

  let canvas;
  let ctx;
  let dx, dy;
  let margin = {
    left: 30,
    right: 20,
    top: 20,
    bottom: 30
  };

  this.draw = function () {

    canvas = document.getElementById(id);

    if (canvas == null || canvas == undefined) return;
    canvas.addEventListener('click', onMouseClick, false);
    canvas.addEventListener('dblclick', onMouseDoubleClick, false);
    canvas.addEventListener('mousemove', onMouseMove, false);
    canvas.addEventListener('mouseleave', onMouseLeave, false);
    canvas.addEventListener('touchmove', onTouchMove, false);

    ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (data) {
      drawGraphWindow();
      drawLineCharts(data);
    }

  }

  function drawLineCharts(data) {
    let sum = 0;
    for (var i = 0; i < data.length; i++) {
      sum += data[i];
    }
    let graphWindowWidth = canvas.width - margin.left - margin.right;
    let graphWindowHeight = canvas.height - margin.bottom - margin.top;
    dx = graphWindowWidth / (data.length - 1);
    dy = 0.8 * graphWindowHeight / (maximumValue - minimumValue);

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.font = "8px Arial";
    ctx.fillStyle = 'black';
    ctx.beginPath();
    let horizontalAxisY = canvas.height - margin.bottom;
    let tmpX = margin.left;
    let tmpY = (data[0] - minimumValue) * dy;
    ctx.moveTo(tmpX, horizontalAxisY - tmpY);
    ctx.fillText(1, tmpX - 4, horizontalAxisY + 10);
    for (let i = 1; i < data.length; i++) {
      tmpX = margin.left + dx * i;
      tmpY = (data[i] - minimumValue) * dy;
      ctx.lineTo(tmpX, horizontalAxisY - tmpY);
      if ((i + 1) % 5 == 0 || data.length < 10) {
        ctx.fillText(i + 1, tmpX - 4, horizontalAxisY + 10);
      }
    }
    ctx.stroke();

    ctx.fillStyle = 'red';
    for (let i = 0; i < data.length; i++) {
      tmpX = margin.left + dx * i;
      tmpY = (data[i] - minimumValue) * dy;
      ctx.beginPath();
      ctx.arc(tmpX, horizontalAxisY - tmpY, 2, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
    }

    ctx.font = "10px Arial";
    let xAxisLabel = 'Time (s)';
    ctx.fillText(xAxisLabel, margin.left + graphWindowWidth / 2 - ctx.measureText(xAxisLabel).width / 2, horizontalAxisY + 20);
    ctx.save();
    ctx.translate(15, canvas.height / 2 + 30);
    ctx.rotate(-Math.PI / 2);
    let yAxisLabel = "Temperature (°C)"
    ctx.fillText(yAxisLabel, 0, 0);
    ctx.restore();
  }

  function drawGraphWindow() {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin.left, canvas.height - margin.bottom);
    ctx.lineTo(canvas.width - margin.right, canvas.height - margin.bottom);
    ctx.lineTo(canvas.width - margin.right, margin.top);
    ctx.lineTo(margin.left, margin.top);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(margin.left, margin.top, canvas.width - margin.left - margin.right, canvas.height - margin.top - margin.bottom);
  }

  function onMouseMove(event) {
    event.preventDefault();
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left - margin.left;
    let y = event.clientY - rect.top;
    that.draw();
  }

  function onMouseLeave(event) {
    event.preventDefault();
    that.draw();
  }

  function onTouchMove(event) {
    event.preventDefault();
  }

  function onMouseClick(event) {
    event.preventDefault();
  }

  function onMouseDoubleClick(event) {
    event.preventDefault();
  }

}
