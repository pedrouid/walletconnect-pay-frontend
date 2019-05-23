import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { colors } from "../styles";
import { IMenuItem, IOrderItem } from "../helpers/types";
import {
  orderAddItem,
  orderRemoveItem,
  orderSubmit,
  orderUnsubmit
} from "../redux/_order";
import Button from "../components/Button";
import PaymentModal from "../components/PaymentModal";
import ListItem from "../components/ListItem";
import {
  SColumnWrapper,
  SColumn,
  SColumnOrder,
  SColumnHeader,
  SColumnFooter,
  SColumnList,
  SColumnRowTitle,
  SColumnRow,
  STitle
} from "../components/common";
import { toFixed } from "../helpers/bignumber";
import logo from "../assets/logo.png";

const SHeader = styled.div`
  width: 100%;
  background-color: rgb(${colors.dark});
  color: rgb(${colors.white});
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 82px;
`;

const SBranding = styled.h1`
  text-transform: uppercase;
  font-size: 24px;
  margin: 4px 0px;
  margin-left: 10px;
`;

const SLogo = styled.img`
  border-radius: 6px;
  width: 40px;
  height: 40px;
`;

class Order extends React.Component<any, any> {
  public render() {
    const {
      menu,
      loading,
      submitted,
      items,
      checkout,
      payment,
      uri
    } = this.props;
    return (
      <React.Fragment>
        <SHeader>
          <SLogo src={logo} alt="" />
          <SBranding>{"Bufficorn Cafe"}</SBranding>
        </SHeader>
        <SColumnWrapper>
          <SColumn width={items.length ? 70 : 100}>
            <SColumnHeader>
              <STitle>{`Menu`}</STitle>
            </SColumnHeader>
            <SColumnList>
              {menu.map((item: IMenuItem) => (
                <ListItem
                  key={`menu-${item.name}`}
                  item={item}
                  onClick={() => this.props.orderAddItem(item)}
                />
              ))}
            </SColumnList>
          </SColumn>
          <SColumnOrder width={items.length ? 30 : 0}>
            <SColumnHeader>
              <STitle>{`Order`}</STitle>
            </SColumnHeader>
            <SColumnList>
              {items.map((item: IOrderItem) => (
                <ListItem
                  noImage
                  key={`order-${item.name}`}
                  item={item}
                  actions={[
                    { label: "Remove", callback: this.props.orderRemoveItem },
                    { label: "Add", callback: this.props.orderAddItem }
                  ]}
                />
              ))}
            </SColumnList>
            <SColumnFooter>
              <SColumnRow>
                <SColumnRowTitle>{`Summary`}</SColumnRowTitle>
              </SColumnRow>
              <SColumnRow>
                <div>{`Sub Total`}</div>
                <div>{`$ ${toFixed(checkout.subtotal, 2)}`}</div>
              </SColumnRow>
              <SColumnRow>
                <div>{`Tax`}</div>
                <div>{`$ ${toFixed(checkout.tax, 2)}`}</div>
              </SColumnRow>
              <SColumnRow>
                <div>{`Net Total`}</div>
                <div>{`$ ${toFixed(checkout.nettotal, 2)}`}</div>
              </SColumnRow>
              <SColumnRow>
                <Button onClick={this.props.orderSubmit}>{`Pay`}</Button>
              </SColumnRow>
            </SColumnFooter>
          </SColumnOrder>

          <PaymentModal
            loading={loading}
            submitted={submitted}
            payment={payment}
            checkout={checkout}
            uri={uri}
            orderUnsubmit={this.props.orderUnsubmit}
          />
        </SColumnWrapper>
      </React.Fragment>
    );
  }
}

const reduxProps = (store: any) => ({
  menu: store.order.menu,
  loading: store.order.loading,
  submitted: store.order.submitted,
  items: store.order.items,
  checkout: store.order.checkout,
  uri: store.order.uri,
  payment: store.order.payment
});

export default connect(
  reduxProps,
  { orderAddItem, orderRemoveItem, orderSubmit, orderUnsubmit }
)(Order);
