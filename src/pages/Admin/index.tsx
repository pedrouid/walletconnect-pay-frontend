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
    loadingBalance: PropTypes.bool.isRequired,
    address: PropTypes.string.isRequired,
    balance: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
  };

  public componentDidMount() {
    if (!this.props.address) {
      this.props.adminRequestAuthentication();
    }
  }

  public render() {
    const { match, loading, loadingBalance, balance, profile } = this.props;
    return (
      <Dashboard
        match={match}
        loading={loading}
        loadingBalance={loadingBalance}
        balance={balance}
        profile={profile}
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
  profile: store.admin.profile
});

export default connect(
  reduxProps,
  { adminRequestAuthentication }
)(Admin);
