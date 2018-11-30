function determineSize() {
  let size = {};
  let PADDING = 20;

  switch (document.location.hostname) {
    case "docs.google.com": {
      let pagewidth = document.querySelector(".kix-zoomdocumentplugin-outer").offsetWidth;
      let sidebarwidth = document.querySelector(".left-sidebar-container").offsetWidth;
      let companionwidth = document.querySelector(".docs-companion-app-switcher-container").offsetWidth;
      let firstcomment = document.querySelector(".docos-replyview-comment");
      let commentwidth = firstcomment ? firstcomment.offsetWidth + 24 : 0;

      // 163 is the min width of the sidebar, don't want more than that
      size.width = Math.min(sidebarwidth, 163) + pagewidth + commentwidth + + companionwidth + PADDING;
      break;
    }

    case "bugzilla.mozilla.org":
      size.width = 1024;
      break;
    case "github.com":
      size.width = 1020;
      break;
    case "developer.mozilla.org":
      size.width = 1450;
      break;
  }

  size.innerWidth = window.innerWidth;
  size.innerHeight = window.innerHeight;

  return size;
}

// return size
determineSize();
