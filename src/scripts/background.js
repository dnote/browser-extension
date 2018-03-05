chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(request) {
    if (request.type === "closed") {
      const { state } = request;

      chrome.storage.sync.set({ state }, () => {
        console.log("persisted");
      });
    }
  });
});
