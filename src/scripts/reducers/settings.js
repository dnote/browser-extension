import { UPDATE } from "../actions/settings";

const initialState = {
  apiKey: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE:
      return {
        ...state,
        ...action.data.settings
      };
    default:
      return state;
  }
}
