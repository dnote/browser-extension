import { NAVIGATE } from "../actions/location";

const initialState = {
  path: "/"
};

export default function(state = initialState, action) {
  switch (action.type) {
    case NAVIGATE:
      return {
        ...state,
        path: action.data.path
      };
    default:
      return state;
  }
}
