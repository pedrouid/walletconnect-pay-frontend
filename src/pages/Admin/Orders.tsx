import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { adminGetAllOrders } from "../../redux/_admin";
import { IOrderJson } from "../../helpers/types";
import { formatDisplayAmount, capitalize } from "../../helpers/utilities";
import { SColumnList, SSemiBold } from "../../components/common";
import EmptyState from "../../components/EmptyState";
import { colors, shadows, transitions } from "../../styles";
import { formatDate } from "src/helpers/date";

interface IListItemStyleProps {
  onClick?: any;
}

const SOrderList = styled(SColumnList)`
  & > div {
    margin-bottom: 8px;
  }
`;

const SListItem = styled.div<IListItemStyleProps>`
  transition: ${transitions.base};

  border-radius: 6px;
  border: 1px solid rgb(${colors.lightGrey});
  background: rgb(${colors.white});

  transform: translate3d(0, 0, 0);
  box-shadow: ${shadows.base};

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px;

  ${({ onClick }) =>
    onClick &&
    `
    cursor: pointer;
    @media (hover: hover) {
      &:hover {
        transform: translate3d(0, -1px, 0);
        box-shadow: ${shadows.hover};
      }
    }
  `}
`;

class Orders extends React.Component<any, any> {
  public componentDidMount() {
    this.props.adminGetAllOrders();
  }
  public render() {
    const { orders, settings } = this.props;
    return (
      <React.Fragment>
        {orders && orders.length ? (
          <SOrderList>
            {orders.map((order: IOrderJson) => (
              <SListItem key={order.id}>
                <div>{formatDate(order.timestamp, "MMM DD HH:mm")}</div>
                <div>{order.id}</div>
                <div>{capitalize(order.payment.status)}</div>
                <SSemiBold>
                  {formatDisplayAmount(
                    order.checkout.rawtotal,
                    settings.paymentCurrency
                  )}
                </SSemiBold>
              </SListItem>
            ))}
          </SOrderList>
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
