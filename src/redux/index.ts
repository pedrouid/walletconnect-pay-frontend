import { combineReducers, applyMiddleware, compose, createStore } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import ReduxThunk from "redux-thunk";
import admin from "./_admin";
import demo from "./_demo";
import notification from "./_notification";
import modal from "./_modal";
import order from "./_order";

export const history = createBrowserHistory();

export const reducers = combineReducers({
  router: connectRouter(history),
  admin,
  demo,
  notification,
  modal,
  order
});

export const store = createStore(
  reducers,
  compose(applyMiddleware(routerMiddleware(history), ReduxThunk))
);
