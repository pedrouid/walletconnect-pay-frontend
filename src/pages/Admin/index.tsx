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
    match: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    address: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
    profile: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  public componentDidMount() {
    if (!this.props.address) {
      this.props.adminRequestAuthentication();
    }
  }

  public render() {
    const { match, loading, balance, profile, settings } = this.props;
    return (
      <Dashboard
        match={match}
        loading={loading}
        balance={balance}
        profile={profile}
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
  profile: store.admin.profile,
  settings: store.admin.settings
});

export default connect(
  reduxProps,
  { adminRequestAuthentication }
)(Admin);
