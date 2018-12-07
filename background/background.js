/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * Portions Copyright (C) Philipp Kewisch, 2017 */

browser.pageAction.onClicked.addListener((tab) => {
  browser.tabs.executeScript(tab.id, { file: "/content/determineSize.js" }).then(([sizeinfo]) => {
    browser.windows.get(tab.windowId).then((win) => {
      let changeinfo = {};
      if (sizeinfo.width) {
        changeinfo.width = sizeinfo.width + (win.width - sizeinfo.innerWidth);
      }
      if (sizeinfo.height) {
        changeinfo.height = sizeinfo.height + (win.height - sizeinfo.innerHeight);
      }

      // Take away from the left side of the window if we are on the right side of the screen.
      let center = win.left + (win.width / 2)
      if (center > screen.width / 2) {
        changeinfo.left = win.left - (changeinfo.width - win.width);
      }

      browser.windows.update(tab.windowId, changeinfo);
    });
  });
});

if (navigator.userAgent.includes("Chrome") || parseInt((navigator.userAgent.match(/Firefox\/([0-9]+)/) || [])[1], 10) < 59) {
  let urlmatches = browser.runtime.getManifest().page_action.show_matches.map(pattern => {
    return pattern.replace(/\*/, "");
  });

  let updateTab = (tab) => {
    if (tab.url && urlmatches.some(match => tab.url.startsWith(match))) {
      browser.pageAction.show(tab.id);
    } else {
      browser.pageAction.hide(tab.id);
    }
  };

  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    updateTab(tab);
  });

  browser.tabs.onActivated.addListener(async ({ tabId }) => {
    let tab = await browser.tabs.get(tabId);
    updateTab(tab);
  });
}
