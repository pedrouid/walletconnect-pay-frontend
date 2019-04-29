import * as React from "react";
import * as ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";

import Root from "./Root";
import { globalStyle } from "./styles";
const GlobalStyle = createGlobalStyle`
  ${globalStyle}
`;

ReactDOM.render(
  <>
    <GlobalStyle />
    <Root />
  </>,
  document.getElementById("root")
);
