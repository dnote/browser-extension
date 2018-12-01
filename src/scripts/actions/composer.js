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

export function createNote(apiKey, bookUUID, content) {
  return dispatch => {
    const payload = {
      book_uuid: bookUUID,
      content
    };

    return post(`${config.apiEndpoint}/v1/notes`, payload, {
      headers: {
        Authorization: apiKey,
        Version: config.version
      }
    });
  };
}

export function createBook(apiKey, name) {
  return dispatch => {
    const payload = { name };

    return post(`${config.apiEndpoint}/v1/books`, payload, {
      headers: {
        Authorization: apiKey,
        Version: config.version
      }
    });
  };
}
