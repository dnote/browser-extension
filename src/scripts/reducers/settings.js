import { RECEIVE_USER } from "../actions/settings";

const initialState = {
  apiKey: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_USER:
      return {
        ...state,
        user: action.data.user
      };
    default:
      return state;
  }
}
