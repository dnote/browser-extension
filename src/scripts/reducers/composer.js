import { UPDATE_DRAFT_CONTENT } from "../actions/composer";

const initialState = {
  content: ""
};

export default function(state = initialState, action) {
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
