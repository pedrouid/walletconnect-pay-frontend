import * as React from "react";
import { connect } from "react-redux";
import Checkout from "../layouts/Checkout";
import OrderMenu from "../layouts/OrderMenu";
import PageWrapper from "../components/PageWrapper";
import Loader from "../components/Loader";
import {
  orderLoadMenu,
  orderShowPaymentMethods,
  orderChoosePaymentMethod,
  orderAddItem,
  orderRemoveItem,
  orderSubmit,
  orderUnsubmit,
  orderClearState
} from "../redux/_order";
import { adminRequestAuthentication } from "../redux/_admin";
import { notificationShow } from "../redux/_notification";
import {
  revertPageMeta,
  updatePageMeta,
  sanitizeImgSrc
} from "../helpers/utilities";

class Order extends React.Component<any, any> {
  public componentDidMount() {
    if (!this.props.address) {
      this.props.adminRequestAuthentication();
    }
    this.props.orderLoadMenu();
    this.updatePageMeta();
  }

  public componentDidUpdate(prevProps: any) {
    if (prevProps.profile.name !== this.props.profile.name) {
      this.updatePageMeta();
    }
  }

  public updatePageMeta() {
    const { profile } = this.props;
    updatePageMeta({
      title: profile.name,
      description: profile.description,
      favicon: sanitizeImgSrc(profile.logo)
    });
  }

  public onSubmit = () => {
    if (!this.props.items || !this.props.items.length) {
      this.props.notificationShow("No items added to the order", true);
      return;
    }
    if (this.props.paymentMethod) {
      this.props.orderSubmit();
    } else {
      this.props.orderShowPaymentMethods();
    }
  };

  public clearState = () => {
    revertPageMeta();
    this.props.orderClearState();
  };

  public componentWillUnmount() {
    this.clearState();
  }

  public render() {
    const {
      adminLoading,
      profile,
      settings,
      menu,
      paymentMethod,
      orderLoading,
      submitted,
      items,
      checkout,
      payment,
      uri,
      orderId
    } = this.props;
    return !orderLoading ? (
      <React.Fragment>
        <OrderMenu
          loading={orderLoading || adminLoading}
          profile={profile}
          settings={settings}
          menu={menu}
          items={items}
          checkout={checkout}
          onSubmit={this.onSubmit}
          onAdd={this.props.orderAddItem}
          onRemove={this.props.orderRemoveItem}
        />
        <Checkout
          loading={orderLoading}
          settings={settings}
          submitted={submitted}
          payment={payment}
          paymentMethod={paymentMethod}
          checkout={checkout}
          uri={uri}
          orderId={orderId}
          orderUnsubmit={this.props.orderUnsubmit}
        />
      </React.Fragment>
    ) : (
      <PageWrapper center>
        <Loader />
      </PageWrapper>
    );
  }
}

const reduxProps = (store: any) => ({
  adminLoading: store.admin.loading,
  address: store.admin.address,
  profile: store.admin.profile,
  settings: store.admin.settings,
  menu: store.admin.menu,
  paymentMethod: store.order.paymentMethod,
  orderLoading: store.order.loading,
  submitted: store.order.submitted,
  items: store.order.items,
  checkout: store.order.checkout,
  uri: store.order.uri,
  orderId: store.order.orderId,
  payment: store.order.payment
});

export default connect(
  reduxProps,
  {
    orderLoadMenu,
    orderShowPaymentMethods,
    orderChoosePaymentMethod,
    orderAddItem,
    orderRemoveItem,
    orderSubmit,
    orderUnsubmit,
    adminRequestAuthentication,
    notificationShow,
    orderClearState
  }
)(Order);
