import * as React from "react";
import { connect } from "react-redux";
import {
  orderLoadDemo,
  orderShowPaymentMethods,
  orderChoosePaymentMethod,
  orderAddItem,
  orderRemoveItem,
  orderSubmit,
  orderUnsubmit
} from "../redux/_order";
import { notificationShow } from "../redux/_notification";
import PageWrapper from "../components/PageWrapper";
import Checkout from "../layouts/Checkout";
import Loader from "../components/Loader";
import OrderMenu from "../layouts/OrderMenu";
import { revertPageMeta, updatePageMeta } from "../helpers/utilities";

class Demo extends React.Component<any, any> {
  public componentDidMount() {
    const businessName = this.props.match.params.businessName;
    this.props.orderLoadDemo(businessName);
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
      favicon: profile.logo
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

  public componentWillUnmount() {
    revertPageMeta();
  }

  public render() {
    const {
      profile,
      settings,
      menu,
      paymentMethod,
      loading,
      submitted,
      items,
      checkout,
      payment,
      uri,
      orderId
    } = this.props;
    return !this.props.loading ? (
      <React.Fragment>
        <OrderMenu
          loading={loading}
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
          loading={loading}
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
  profile: store.demo.profile,
  settings: store.demo.settings,
  menu: store.demo.menu,
  paymentMethod: store.order.paymentMethod,
  loading: store.order.loading,
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
    orderLoadDemo,
    orderShowPaymentMethods,
    orderChoosePaymentMethod,
    orderAddItem,
    orderRemoveItem,
    orderSubmit,
    orderUnsubmit,
    notificationShow
  }
)(Demo);
