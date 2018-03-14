import { combineReducers } from "redux";

import settings from "./settings";
import location from "./location";
import composer from "./composer";
import books from "./books";

export default combineReducers({
  settings,
  location,
  composer,
  books
});
