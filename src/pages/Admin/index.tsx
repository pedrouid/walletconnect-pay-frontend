import * as React from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import Dashboard from "../../layouts/Dashboard";
import Overview from "./Overview";
import Inventory from "./Inventory";
import Orders from "./Orders";
import Accounting from "./Accounting";
import Settings from "./Settings";

class Admin extends React.Component<any, any> {
  public static propTypes = {
    businessData: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  };

  public render() {
    const { businessData, match } = this.props;
    return (
      <Dashboard match={match}>
        <Switch>
          <Route exact path={match.url} component={Overview} />
          <Route exact path={`${match.url}/inventory`} component={Inventory} />
          <Route exact path={`${match.url}/orders`} component={Orders} />
          <Route
            exact
            path={`${match.url}/accounting`}
            component={Accounting}
          />
          <Route
            exact
            path={`${match.url}/settings`}
            render={() => <Settings profile={businessData.profile} />}
          />
          <Route render={() => <Redirect to={match.url} />} />
        </Switch>
      </Dashboard>
    );
  }
}

const reduxProps = (store: any) => ({
  businessData: store.admin.businessData
});

export default connect(
  reduxProps,
  null
)(Admin);
