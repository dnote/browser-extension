import { combineReducers } from "redux";

import settings from "./settings";
import location from "./location";
import composer from "./composer";

export default combineReducers({
  settings,
  location,
  composer
});
