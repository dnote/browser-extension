import { UPDATE, RESET } from "../actions/settings";

const initialState = {
  sessionKey: '',
  sessionKeyExpiry: 0,
  cipherKey: ''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE:
      return {
        ...state,
        ...action.data.settings
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
}
