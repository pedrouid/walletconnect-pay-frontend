import * as React from "react";
import * as ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import ReduxThunk from "redux-thunk";
import reducers from "./reducers";
import App from "./App";

import { globalStyle } from "./styles";

declare global {
  // tslint:disable-next-line
  interface Window {
    ethereum: any;
    web3: any;
    browserHistory: any;
  }
}

const GlobalStyle = createGlobalStyle`
  ${globalStyle}
`;

const store = createStore(reducers, applyMiddleware(ReduxThunk));

ReactDOM.render(
  <>
    <GlobalStyle />
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </>,
  document.getElementById("root")
);
