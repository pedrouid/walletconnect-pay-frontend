import * as React from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import Dashboard from "../../layouts/Dashboard";
import { adminRequestAuthentication } from "../../redux/_admin";

import Overview from "./Overview";
import Inventory from "./Inventory";
import Orders from "./Orders";
import Accounting from "./Accounting";
import Settings from "./Settings";

class Admin extends React.Component<any, any> {
  public static propTypes = {
    match: PropTypes.object.isRequired
  };

  public componentDidMount() {
    if (!this.props.address) {
      this.props.adminRequestAuthentication();
    }
  }

  public render() {
    const { loading, balance, match, settings } = this.props;
    return (
      <Dashboard
        match={match}
        balance={balance}
        loading={loading}
        settings={settings}
      >
        <Switch>
          <Route exact path={match.url} component={Overview} />
          <Route exact path={`${match.url}/inventory`} component={Inventory} />
          <Route exact path={`${match.url}/orders`} component={Orders} />
          <Route
            exact
            path={`${match.url}/accounting`}
            component={Accounting}
          />
          <Route exact path={`${match.url}/settings`} component={Settings} />
          <Route render={() => <Redirect to={match.url} />} />
        </Switch>
      </Dashboard>
    );
  }
}

const reduxProps = (store: any) => ({
  loading: store.admin.loading,
  address: store.admin.address,
  balance: store.admin.balance,
  settings: store.admin.settings
});

export default connect(
  reduxProps,
  { adminRequestAuthentication }
)(Admin);
