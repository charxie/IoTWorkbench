/*
 * Copyright 2015, The Engineering Computation Laboratory, The Concord Consortium
 *
 * @author Charles Xie
 *
 */

'use strict';

var canvas;

function init() {

  canvas = document.getElementById("board");
  var ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, 2 * Math.PI);
  ctx.stroke();

}
