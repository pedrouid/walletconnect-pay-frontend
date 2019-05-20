import { combineReducers } from "redux";
import admin from "./_admin";
import notification from "./_notification";
import order from "./_order";

export default combineReducers({
  admin,
  notification,
  order
});
