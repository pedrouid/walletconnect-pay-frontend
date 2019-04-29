import { combineReducers } from "redux";
import admin from "./_admin";
import order from "./_order";

export default combineReducers({
  admin,
  order
});
