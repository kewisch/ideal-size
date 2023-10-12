function determineSize() {
  let size = {};

  if (document.location.hostname == "docs.google.com") {
    let pagewidth = document.querySelector(".kix-page-paginated")?.offsetWidth;
    if (!pagewidth) {
      let canvas = document.querySelector("canvas.kix-canvas-tile-content");
      if (canvas) {
        pagewidth = findCanvasContentWidth(canvas);
      }
    }

    let viewscroller = document.querySelector(".kix-domviewscroller-inner")?.offsetWidth ?? 0;

    let sidebarwidth = document.querySelector(".left-sidebar-container")?.offsetWidth ?? 0;
    let companionwidth = document.querySelector(".docs-companion-app-switcher-container")?.offsetWidth ?? 0;
    let firstcomment = document.querySelector(".docos-replyview-comment");
    let commentwidth = firstcomment ? firstcomment.offsetWidth + 24 : 0;

    size.width = sidebarwidth + Math.max(pagewidth, viewscroller) + commentwidth + companionwidth + 100;
  } else if (document.location.hostname == "bugzilla.mozilla.org") {
    size.width = 1024;
  } else if (document.location.hostname == "github.com") {
    size.width = 1020;
  } else if (document.location.hostname == "developer.mozilla.org") {
    size.width = 1450;
  } else if (document.location.hostname == "www.di.fm") {
    size.width = 450;
    size.height = 600;
  } else if (document.location.hostname.endsWith(".greenhouse.io")) {
    size.width = (Number(window.getComputedStyle(document.querySelector("#wrapper"))["max-width"].replace(/[^0-9]+/g, "")) || 1200) * 1.025;
  }

  size.innerWidth = window.innerWidth;
  size.innerHeight = window.innerHeight;

  return size;
}

function findCanvasContentWidth(canvas) {
  function nonwhite(index) {
    let red = data[index];
    let green = data[index + 1];
    let blue = data[index + 2];
    let alpha = data[index + 3];

    // If not white and has some opacity
    return (!(red === 255 && green === 255 && blue === 255) && alpha !== 0);
  }

  let ctx = canvas.getContext("2d");
  let data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let leftBoundary, rightBoundary;

  /* eslint-disable no-labels */

  boundaries:
  for (let x = 0; !leftBoundary && x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      let index = (y * canvas.width + x) * 4;
      if (nonwhite(index)) {
        leftBoundary = x;
        break boundaries;
      }
    }
  }

  boundaries:
  for (let x = canvas.width - 1; x >= 0; x--) {
    for (let y = 0; y < canvas.height; y++) {
      let index = (y * canvas.width + x) * 4;
      if (nonwhite(index)) {
        rightBoundary = x;
        break boundaries;
      }
    }
  }
  /* eslint-enable no-labels */

  if (!leftBoundary || !rightBoundary) {
    return 0; // Canvas is empty or fully white
  }

  return rightBoundary - leftBoundary + 1;
}

// return size
determineSize();
