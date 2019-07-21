import * as React from "react";
import * as ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { history, store } from "./redux";
import App from "./App";

import { globalStyle } from "./styles";

declare global {
  // tslint:disable-next-line
  interface Window {
    ethereum: any;
    web3: any;
    Box: any;
    box: any;
    space: any;
  }
}

const GlobalStyle = createGlobalStyle`
  ${globalStyle}
`;

ReactDOM.render(
  <>
    <GlobalStyle />
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </>,
  document.getElementById("root")
);
