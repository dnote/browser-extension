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

      // get ids of deleted books and that of a currently selected book
      const deletedIds = [];
      const newItems = [];
      let selectedId = null;

      const booksMap = books.reduce(function(acc, cur) {
        acc[cur.id] = cur;
        return acc;
      }, {});

      state.items.forEach(item => {
        if (!booksMap[item.id] && !item.isNew) {
          deletedIds.push(item.id);
        }
        if (item.isNew) {
          newItems.push(item);
        }
        if (item.selected) {
          selectedId = item.id;
        }
      });

      const items = books
        .filter(item => {
          return deletedIds.indexOf(item.id) === -1;
        })
        .map(item => {
          const selected = selectedId === item.id;

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
          const selected = item.id === action.data.bookId;

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
          return item.id !== action.data.bookId;
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
