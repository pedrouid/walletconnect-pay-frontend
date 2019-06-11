import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Home from "./pages/Home";
import Demo from "./pages/Demo";
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
            <Route exact path="/order" component={Order} />
            <Route exact path="/signup" component={SignUp} />
            <Route path="/admin" component={Admin} />
            <Route path="/demo/:businessName" component={Demo} />
            <Route path="/demo" component={Demo} />
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
  profile: store.admin.profile
});

export default withRouter(connect(
  reduxProps,
  null
)(App) as any);
