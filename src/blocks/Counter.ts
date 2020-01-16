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
  switch (e.data.cmd) {
    case "Start":
      workerPaused = false;
      break;
    case "Pause":
      workerPaused = true;
      break;
  }
  workerInterval = e.data.interval;
  workerRepeat = e.data.repeat;
}, false);

timedCount();
