const stateKey = "state";

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

function parseStorageItem(item) {
  if (!item) {
    return null;
  }

  return JSON.parse(item);
}

// saveState writes the given state to chrome.storage
export function saveState(state) {
  const filtered = filterState(state);
  const serialized = JSON.stringify(filtered);

  chrome.storage.local.set({ [stateKey]: serialized }, () => {
    console.log("synced state");
  });
}

// loadState loads and parses serialized state stored in chrome.storage
export function loadState(done) {
  chrome.storage.local.get("state", items => {
    const parsed = {
      ...items,
      state: parseStorageItem(items.state)
    };

    return done(parsed);
  });
}
