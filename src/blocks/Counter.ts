/*
 * @author Charles Xie
 */

let workerCount = 0;
let workerPaused = false;
let workerInterval = 500;
let workerRepeat = 1000000;

function timedCount() {
  if (!workerPaused && workerCount < workerRepeat) {
    workerCount++;
    // @ts-ignore: If I add the targetOrigin, then the browser doesn't recognize the signature
    postMessage(workerCount);
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
}, false);

timedCount();
