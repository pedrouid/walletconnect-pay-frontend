import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import {
  Route,
  Switch,
  withRouter
  // Redirect
} from "react-router-dom";
import { connect } from "react-redux";
import Home from "./pages/Home";
import Order from "./pages/Order";
import Admin from "./pages/Admin";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Notification from "./components/Notification";
import ModalController from "./modals";

const SLayout = styled.div`
  position: relative;
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
            <Route exact path="/order/:businessName" component={Order} />
            {/* <Route
              exact
              path="/order"
              render={routerProps => {
                // if (!this.props.address) {
                //   return <Redirect to="/" />;
                // }
                return <Order {...routerProps} />;
              }}
            /> */}
            <Route
              exact
              path="/signup"
              render={routerProps => {
                // if (!this.props.address) {
                //   return <Redirect to="/" />;
                // }
                return <SignUp {...routerProps} />;
              }}
            />
            <Route
              path="/admin"
              render={routerProps => {
                // if (!this.props.address) {
                //   return <Redirect to="/" />;
                // }
                return <Admin {...routerProps} />;
              }}
            />
            <Route component={NotFound} />
          </Switch>
        </SContent>
        <Notification />
        <ModalController />
      </SLayout>
    );
  }
}

const reduxProps = (store: any) => ({
  address: store.admin.address,
  businessProfile: store.admin.businessProfile
});

export default withRouter(connect(
  reduxProps,
  null
)(App) as any);
