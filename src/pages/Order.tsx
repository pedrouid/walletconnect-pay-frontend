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
  orderUnsubmit
} from "../redux/_order";
import { adminRequestAuthentication } from "../redux/_admin";
import { revertPageMeta, updatePageMeta } from "../helpers/utilities";
import { getIpfsUrl } from "../helpers/utilities";

class Order extends React.Component<any, any> {
  public componentDidMount() {
    if (!this.props.address) {
      this.props.adminRequestAuthentication();
    }
    this.props.orderLoadMenu();
    this.updatePageMeta();
  }

  public componentDidUpdate(prevProps: any) {
    if (
      prevProps.businessData.profile.name !==
      this.props.businessData.profile.name
    ) {
      this.updatePageMeta();
    }
  }

  public updatePageMeta() {
    const { businessData } = this.props;
    updatePageMeta({
      title: businessData.profile.name,
      description: businessData.profile.description,
      favicon: getIpfsUrl(businessData.profile.logo)
    });
  }

  public onSubmit = () => {
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
      businessData,
      businessMenu,
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
          businessData={businessData}
          businessMenu={businessMenu}
          items={items}
          checkout={checkout}
          onSubmit={this.onSubmit}
          onAdd={this.props.orderAddItem}
          onRemove={this.props.orderRemoveItem}
        />
        <Checkout
          loading={loading}
          businessData={businessData}
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
  address: store.admin.address,
  businessData: store.admin.businessData,
  businessMenu: store.admin.businessMenu,
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
    orderLoadMenu,
    orderShowPaymentMethods,
    orderChoosePaymentMethod,
    orderAddItem,
    orderRemoveItem,
    orderSubmit,
    orderUnsubmit,
    adminRequestAuthentication
  }
)(Order);
