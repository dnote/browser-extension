const apis = ["storage"];

function Extension() {
  apis.forEach(api => {
    this[api] = null;

    try {
      if (chrome[api]) {
        this[api] = chrome[api];
      }
    } catch (e) {}

    try {
      if (window[api]) {
        this[api] = window[api];
      }
    } catch (e) {}

    try {
      if (browser[api]) {
        this[api] = browser[api];
      }
    } catch (e) {}

    try {
      this.api = browser.extension[api];
    } catch (e) {}
  });

  try {
    if (browser && browser.runtime) {
      this.runtime = browser.runtime;
    }
  } catch (e) {}

  try {
    if (browser && browser.browserAction) {
      this.browserAction = browser.browserAction;
    }
  } catch (e) {}
}

module.exports = new Extension();
