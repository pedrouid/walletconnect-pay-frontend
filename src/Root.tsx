import * as React from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import ReduxThunk from "redux-thunk";
import reducers from "./reducers";
import App from "./App";

const store = createStore(reducers, applyMiddleware(ReduxThunk));

const Root = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

export default Root;
