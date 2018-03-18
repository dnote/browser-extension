import { NAVIGATE } from "../actions/location";

const initialState = {
  path: "/",
  state: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case NAVIGATE:
      return {
        ...state,
        path: action.data.path,
        state: action.data.state || {}
      };
    default:
      return state;
  }
}
