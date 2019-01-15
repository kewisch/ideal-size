/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * Portions Copyright (C) Philipp Kewisch, 2019 */


async function requestPermissions() {
  let allPermissions = browser.runtime.getManifest().optional_permissions;

  return browser.permissions.request({
    origins: allPermissions.filter(perm => perm.includes(":")),
    permissions: allPermissions.filter(perm => !perm.includes(":"))
  });
}

document.getElementById("autoresize").addEventListener("click", async (event) => {
  if (!await requestPermissions()) {
    event.target.checked = false;
  }
  browser.storage.local.set({ autoresize: event.target.checked });
});


for (let node of document.querySelectorAll("[data-l10n-id]")) {
  node.textContent = browser.i18n.getMessage(node.getAttribute("data-l10n-id"));
}

(async function() {
  let prefs = await browser.storage.local.get({ autoresize: false });
  document.getElementById("autoresize").checked = prefs.autoresize;
})();
