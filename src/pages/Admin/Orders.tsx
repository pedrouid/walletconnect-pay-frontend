import * as React from "react";
import { connect } from "react-redux";
import { adminGetAllOrders } from "../../redux/_admin";
import { IOrderJson } from "../../helpers/types";
import { SColumnList } from "../../components/common";
import EmptyState from "../../components/EmptyState";

class Orders extends React.Component<any, any> {
  public componentDidMount() {
    this.props.adminGetAllOrders();
  }
  public render() {
    const { orders } = this.props;
    return (
      <React.Fragment>
        {orders && orders.length ? (
          <SColumnList>
            {orders.map((order: IOrderJson) => (
              <p>{order.id}</p>
            ))}
          </SColumnList>
        ) : (
          <EmptyState message={`No Orders`} />
        )}
      </React.Fragment>
    );
  }
}

const reduxProps = (store: any) => ({
  orders: store.admin.orders,
  settings: store.admin.settings
});

export default connect(
  reduxProps,
  { adminGetAllOrders }
)(Orders);
