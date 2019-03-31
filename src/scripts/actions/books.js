import { get } from "../utils/fetch";
import config from "../utils/config";
import { aes256GcmDecrypt } from '../utils/crypto'
import { b64ToBuf, bufToUtf8 } from '../utils/encoding'

export const START_FETCHING = "books/START_FETCHING";
export const RECEIVE = "books/RECEIVE";
export const RECEIVE_ERROR = "books/RECEIVE_ERROR";
export const SELECT = "books/SELECT";
export const ADD = "books/ADD";
export const REMOVE = "books/REMOVE";

function startFetchingBooks() {
  return {
    type: START_FETCHING
  };
}

function receiveBooks(books) {
  return {
    type: RECEIVE,
    data: {
      books
    }
  };
}

export function selectBook(uuid) {
  return {
    type: SELECT,
    data: {
      uuid
    }
  };
}

export function addBook(book) {
  return {
    type: ADD,
    data: {
      book
    }
  };
}

export function removeBook(bookId) {
  return {
    type: REMOVE,
    data: {
      uuid
    }
  };
}

function receiveBooksError(error) {
  return {
    type: RECEIVE_ERROR,
    data: {
      error
    }
  };
}

export async function decryptBook(book, cipherKeyBuf) {
  const labelDec = await aes256GcmDecrypt(cipherKeyBuf, b64ToBuf(book.label));

  return {
    ...book,
    label: bufToUtf8(labelDec)
  };
}

export function fetchBooks(key, cipherKey) {
  console.log('cipherKey',cipherKey);
  return dispatch => {
    dispatch(startFetchingBooks());

    console.log('here');
    const cipherKeyBuf = b64ToBuf(cipherKey)
    console.log('cipherKeyBuf', cipherKeyBuf);

    get(`${config.apiEndpoint}/v1/books`, {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(books => {
        const p = books.map(book => {
          return decryptBook(book, cipherKeyBuf)
        })

        return Promise.all(p).then(booksDec => {
          dispatch(receiveBooks(booksDec));
        })
      })
      .catch(err => {
        console.log("error fetching books", err);
        dispatch(receiveBooksError(err));
      });
  };
}
