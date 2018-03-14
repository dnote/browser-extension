function filterState(state) {
  return {
    ...state,
    books: {
      ...state.books,
      items: state.books.items.filter(item => {
        return !item.isNew || item.selected;
      })
    }
  };
}

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(request) {
    if (request.type === "closed") {
      const { state } = request;

      chrome.storage.sync.set({ state: filterState(state) }, () => {
        console.log("persisted");
      });
    }
  });
});
