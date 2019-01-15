/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * Portions Copyright (C) Philipp Kewisch, 2017-2019 */

const SHOW_MATCHES = browser.runtime.getManifest().page_action.show_matches;

async function resizeTab(tab) {
  let sizeinfo = (await browser.tabs.executeScript(tab.id, { file: "/content/determineSize.js" }))[0];
  let win = await browser.windows.get(tab.windowId);
  let changeinfo = {};
  if (sizeinfo.width) {
    changeinfo.width = sizeinfo.width + (win.width - sizeinfo.innerWidth);
  }
  if (sizeinfo.height) {
    changeinfo.height = sizeinfo.height + (win.height - sizeinfo.innerHeight);
  }

  // Take away from the left side of the window if we are on the right side of the screen.
  let center = win.left + (win.width / 2);
  if (center > screen.width / 2) {
    changeinfo.left = win.left - (changeinfo.width - win.width);
  }

  await browser.windows.update(tab.windowId, changeinfo);
}

async function tabUpdated(tabId, { url }, tab) {
  let prefs = await browser.storage.local.get({ autoresize: false });
  if (!prefs.autoresize) {
    return;
  }

  let urlmatches = SHOW_MATCHES.map(pattern => {
    return pattern.replace(/\*/, "");
  });

  if (url && urlmatches.some(match => url.startsWith(match))) {
    let windowTabs = await browser.tabs.query({ windowId: tab.windowId });
    if (windowTabs.length == 1) {
      // It is the only tab in the window, autoresize.
      resizeTab(tab);
    }
  }
}

browser.pageAction.onClicked.addListener(resizeTab);
browser.tabs.onUpdated.addListener(tabUpdated, { urls: SHOW_MATCHES });
