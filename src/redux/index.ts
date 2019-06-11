import { combineReducers, createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import admin from "./_admin";
import demo from "./_demo";
import notification from "./_notification";
import modal from "./_modal";
import order from "./_order";

export const reducers = combineReducers({
  admin,
  demo,
  notification,
  modal,
  order
});

export const store = createStore(reducers, applyMiddleware(ReduxThunk));
