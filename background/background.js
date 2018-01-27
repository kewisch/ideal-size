/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * Portions Copyright (C) Philipp Kewisch, 2017 */

browser.pageAction.onClicked.addListener((tab) => {
  browser.tabs.executeScript(tab.id, { file: "/content/determineSize.js" }).then(([sizeinfo]) => {
    browser.windows.get(tab.windowId).then((window) => {
      let changeinfo = {};
      if (sizeinfo.width) {
        changeinfo.width = sizeinfo.width + (window.width - sizeinfo.innerWidth);
      }
      if (sizeinfo.height) {
        changeinfo.height = sizeinfo.height + (window.height - sizeinfo.innerHeight);
      }

      browser.windows.update(tab.windowId, changeinfo);
    });
  });
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!tab || !tab.url) {
    return;
  }

  updatePageAction(tab);
});

function updatePageAction(tab) {
  let url = new URL(tab.url);
  let show = false;
  switch (url.hostname) {
    case "docs.google.com":
      if (url.pathname.startsWith("/document")) {
        show = true;
      }
      break;
    case "bugzilla.mozilla.org":
    case "github.com":
    case "developer.mozilla.org":
      show = true;
      break;
  }

  if (show) {
    browser.pageAction.show(tab.id);
  } else {
    browser.pageAction.hide(tab.id);
  }
}
