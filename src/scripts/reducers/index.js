import { combineReducers } from "redux";

import settings from "./settings";
import location from "./location";

export default combineReducers({
  settings,
  location
});
