import * as React from "react";
import * as ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./redux";
import App from "./App";

import { globalStyle } from "./styles";

declare global {
  // tslint:disable-next-line
  interface Window {
    ethereum: any;
    web3: any;
    browserHistory: any;
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
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </>,
  document.getElementById("root")
);
