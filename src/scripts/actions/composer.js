import { get, post } from "../utils/fetch";
import config from "../utils/config";

export const START_FETCHING_BOOKS = "composer/START_FETCHING_BOOKS";
export const RECEIVE_BOOKS = "composer/RECEIVE_BOOKS";
export const RECEIVE_BOOKS_ERROR = "composer/RECEIVE_BOOKS_ERROR";
export const UPDATE_DRAFT_CONTENT = "composer/UPDATE_DRAFT_CONTENT";

function startFetchingBooks() {
  return {
    type: START_FETCHING_BOOKS
  };
}

function receiveBooks(books) {
  return {
    type: RECEIVE_BOOKS,
    data: {
      books
    }
  };
}

function receiveBooksError(error) {
  return {
    type: RECEIVE_BOOKS_ERROR,
    data: {
      error
    }
  };
}

export function updateDraftContent(content) {
  return {
    type: UPDATE_DRAFT_CONTENT,
    data: {
      content
    }
  };
}

export function fetchBooks(apiKey) {
  return dispatch => {
    dispatch(startFetchingBooks());

    get(`${config.apiEndpoint}/v1/books`, {
      headers: {
        Authorization: apiKey
      }
    })
      .then(books => {
        dispatch(receiveBooks(books));
      })
      .catch(err => {
        console.log("error fetching books", err);
        dispatch(receiveBooksError(err));
      });
  };
}

function syncActions(apiKey, actions) {
  return post(`${config.apiEndpoint}/v1/sync`, actions, {
    headers: {
      Authorization: apiKey
    }
  });
}

export function createNote(apiKey, bookName, content) {
  return dispatch => {
    const actions = [
      {
        type: "add_note",
        data: { book_name: bookName, content },
        timestamp: Math.floor(Date.now() / 1000)
      }
    ];

    syncActions(apiKey, actions).catch(err => {
      console.log("error creating note", err);
    });
  };
}
