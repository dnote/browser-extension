import {
  START_FETCHING_BOOKS,
  RECEIVE_BOOKS,
  RECEIVE_BOOKS_ERROR,
  UPDATE_DRAFT_CONTENT
} from "../actions/composer";

const booksInitialState = {
  items: [],
  isFetching: false,
  isFetched: false,
  error: null
};

const draftInitialState = {
  content: ""
};

const initialState = {
  books: booksInitialState,
  draft: draftInitialState
};

function booksReducer(state = booksInitialState, action) {
  switch (action.type) {
    case START_FETCHING_BOOKS:
      return {
        ...state,
        isFetching: true,
        isFetched: false
      };
    case RECEIVE_BOOKS:
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        items: action.data.books
      };
    case RECEIVE_BOOKS_ERROR:
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

function draftReducer(state = draftInitialState, action) {
  switch (action.type) {
    case UPDATE_DRAFT_CONTENT:
      return {
        ...state,
        content: action.data.content
      };
    default:
      return state;
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case START_FETCHING_BOOKS:
    case RECEIVE_BOOKS:
    case RECEIVE_BOOKS_ERROR:
      return {
        ...state,
        books: booksReducer(state.books, action)
      };
    case UPDATE_DRAFT_CONTENT:
      return {
        ...state,
        draft: draftReducer(state.draft, action)
      };
    default:
      return state;
  }
}
