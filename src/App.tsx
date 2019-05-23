import * as React from "react";
import styled from "styled-components";
import { Switch, Route } from "react-router-dom";
// import Notification from "./components/Notification";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

import logo from "./assets/logo.png";

import { colors } from "./styles";

const SLayout = styled.div`
  height: 100%;
  width: 100%;
  max-height: 100vh;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const SHeader = styled.div`
  width: 100%;
  background-color: rgb(${colors.dark});
  color: rgb(${colors.white});
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 82px;
`;

const SBranding = styled.h1`
  text-transform: uppercase;
  font-size: 24px;
  margin: 4px 0px;
  margin-left: 10px;
`;

const SLogo = styled.img`
  border-radius: 4px;
  width: 40px;
  height: 40px;
`;

const SContent = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 82px);
  max-height: 100vh;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const App = () => (
  <SLayout>
    <SHeader>
      <SLogo src={logo} alt="" />
      <SBranding>{"WalletConnect Pay"}</SBranding>
    </SHeader>

    <SContent>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </SContent>

    {/* TODO: Fix Notification Render Error */}
    {/* <Notification /> */}
  </SLayout>
);

export default App;
