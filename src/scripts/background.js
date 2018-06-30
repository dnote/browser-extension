// filterState filters the given state to be suitable for reuse upon next app
// load
function filterState(state) {
  return {
    ...state,
    location: {
      ...state.location,
      path: "/"
    },
    books: {
      ...state.books,
      items: state.books.items.filter(item => {
        return !item.isNew || item.selected;
      })
    }
  };
}

function syncToStorage(state) {
  chrome.storage.local.set({ state: filterState(state) }, () => {
    console.log("synced");
  });
}

// expose functions
window.syncToStorage = syncToStorage;
