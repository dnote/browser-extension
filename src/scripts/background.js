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

function syncToStorage(state) {
  chrome.storage.sync.set({ state: filterState(state) }, () => {
    console.log("synced");
  });
}

// expose functions
window.syncToStorage = syncToStorage;
