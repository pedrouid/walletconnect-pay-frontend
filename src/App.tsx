import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
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
  public static contextTypes = {
    router: PropTypes.object.isRequired
  };
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
            <Route
              exact
              path="/signup"
              render={routerProps => {
                if (!this.props.web3) {
                  return <Redirect to="/" />;
                }
                return <SignUp {...routerProps} />;
              }}
            />
            <Route
              exact
              path="/admin"
              render={routerProps => {
                if (!this.props.web3 && !this.props.businessName) {
                  return <Redirect to="/" />;
                }
                return <Admin {...routerProps} />;
              }}
            />
            <Route component={NotFound} />
          </Switch>
        </SContent>
      </SLayout>
    );
  }
}

const reduxProps = (reduxState: any) => ({
  web3: reduxState.admin.web3,
  businessName: reduxState.admin.businessName
});

export default withRouter(connect(
  reduxProps,
  null
)(App) as any);
