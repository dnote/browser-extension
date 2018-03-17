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

export function createNote(apiKey, bookName, content) {
  return dispatch => {
    const payload = {
      book_name: bookName,
      content
    };

    return post(`${config.apiEndpoint}/v1/notes`, payload, {
      headers: {
        Authorization: apiKey
      }
    });
  };
}
