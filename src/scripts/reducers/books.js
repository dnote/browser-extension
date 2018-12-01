import {
  START_FETCHING,
  RECEIVE,
  SELECT,
  RECEIVE_ERROR,
  ADD,
  REMOVE
} from "../actions/books";

const initialState = {
  items: [],
  isFetching: false,
  isFetched: false,
  error: null
};

function mapItem(item, selected) {
  return {
    ...item,
    selected
  };
}

export default function(state = initialState, action) {
  switch (action.type) {
    case START_FETCHING:
      return {
        ...state,
        isFetching: true,
        isFetched: false
      };
    case RECEIVE: {
      const { books } = action.data;

      // get uuids of deleted books and that of a currently selected book
      const deletedIds = [];
      const newItems = [];
      let selectedUUID = null;

      const booksMap = books.reduce(function(acc, cur) {
        acc[cur.uuid] = cur;
        return acc;
      }, {});

      state.items.forEach(item => {
        if (!booksMap[item.uuid] && !item.isNew) {
          deletedIds.push(item.uuid);
        }
        if (item.isNew) {
          newItems.push(item);
        }
        if (item.selected) {
          selectedUUID = item.uuid;
        }
      });

      const items = books
        .filter(item => {
          return deletedIds.indexOf(item.uuid) === -1;
        })
        .map(item => {
          const selected = selectedUUID === item.uuid;

          return mapItem(item, selected);
        });

      return {
        ...state,
        isFetching: false,
        isFetched: true,
        items: [...items, ...newItems]
      };
    }
    case SELECT:
      console.log("@@state.items", state.items);

      return {
        ...state,
        items: state.items.map(item => {
          const selected = item.uuid === action.data.uuid;

          return {
            ...item,
            selected
          };
        })
      };
    case ADD: {
      return {
        ...state,
        items: [...state.items, action.data.book]
      };
    }
    case REMOVE: {
      return {
        ...state,
        items: state.items.filter(item => {
          return item.uuid !== action.data.uuid;
        })
      };
    }
    case RECEIVE_ERROR:
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        error: action.data.error
      };
    default:
      return state;
  }
}
