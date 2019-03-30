import { post } from "../utils/fetch";
import config from "../utils/config";

export const UPDATE_DRAFT_CONTENT = "composer/UPDATE_DRAFT_CONTENT";

export function updateDraftContent(content) {
  return {
    type: UPDATE_DRAFT_CONTENT,
    data: {
      content
    }
  };
}

export function createNote(key, bookUUID, content) {
  return dispatch => {
    const payload = {
      book_uuid: bookUUID,
      content
    };

    return post(`${config.apiEndpoint}/v2/notes`, payload, {
      headers: {
        Authorization: `Bearer ${key}`,
        Version: config.version
      }
    });
  };
}

export function createBook(key, name) {
  return dispatch => {
    const payload = { name };

    return post(`${config.apiEndpoint}/v2/books`, payload, {
      headers: {
        Authorization: `Bearer ${key}`,
        Version: config.version
      }
    });
  };
}
