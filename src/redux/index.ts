import { combineReducers, createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import admin from "./_admin";
import order from "./_order";

export const reducers = combineReducers({
  admin,
  order
});

export const store = createStore(reducers, applyMiddleware(ReduxThunk));
