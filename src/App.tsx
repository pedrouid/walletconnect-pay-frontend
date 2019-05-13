import * as React from "react";
import styled from "styled-components";
import { Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import Order from "./pages/Order";
import Admin from "./pages/Admin";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

const SLayout = styled.div`
  height: 100%;
  width: 100%;
  max-height: 100vh;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const SContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  overflow-x: hidden;
  overflow-y: hidden;
`;

class App extends React.Component<any, any> {
  public componentDidMount() {
    window.browserHistory = this.context.router.history;
  }
  public render() {
    return (
      <SLayout>
        <SContent>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/order" component={Order} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/admin" component={Admin} />
            <Route component={NotFound} />
          </Switch>
        </SContent>
      </SLayout>
    );
  }
}

export default App;
