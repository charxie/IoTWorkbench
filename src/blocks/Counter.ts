/*
 * @author Charles Xie
 */

let workerCount = 0;
let workerPaused = false;
let workerInterval = 500;
let workerRepeat = 1000000;
let workerName;

function timedCount() {
  // console.log(workerName + ": " + workerCount);
  if (!workerPaused && workerCount < workerRepeat) {
    // @ts-ignore: If I add the targetOrigin, then the browser doesn't recognize the signature
    postMessage(workerCount);
    workerCount++;
  }
  setTimeout(timedCount, workerInterval);
}

self.addEventListener('message', function (e) {
  if (e.data.cmd != undefined) {
    switch (e.data.cmd) {
      case "Start":
        workerPaused = false;
        break;
      case "Pause":
        workerPaused = true;
        break;
    }
  }
  if (e.data.interval != undefined) workerInterval = e.data.interval;
  if (e.data.repeat != undefined) workerRepeat = e.data.repeat;
  if (e.data.count != undefined) workerCount = e.data.count;
  if (e.data.name != undefined) workerName = e.data.name;
}, false);

timedCount();
