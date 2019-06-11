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
import PageWrapper from "../components/PageWrapper";
import Checkout from "../layouts/Checkout";
import Loader from "../components/Loader";
import OrderMenu from "../layouts/OrderMenu";
import { revertPageMeta, updatePageMeta } from "../helpers/utilities";

class Order extends React.Component<any, any> {
  public componentDidMount() {
    const businessName = this.props.match.params.businessName;
    if (businessName) {
      this.props.orderLoadDemo(businessName);
    }
    this.updatePageMeta();
  }

  public componentDidUpdate(prevProps: any) {
    if (prevProps.businessProfile.name !== this.props.businessProfile.name) {
      this.updatePageMeta();
    }
  }

  public updatePageMeta() {
    const { businessProfile } = this.props;
    updatePageMeta({
      title: businessProfile.name,
      description: businessProfile.description,
      favicon: businessProfile.logo
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
      businessProfile,
      businessTax,
      businessPayment,
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
          businessProfile={businessProfile}
          businessTax={businessTax}
          businessPayment={businessPayment}
          businessMenu={businessMenu}
          items={items}
          checkout={checkout}
          onSubmit={this.onSubmit}
          onAdd={this.props.orderAddItem}
          onRemove={this.props.orderRemoveItem}
        />
        <Checkout
          loading={loading}
          businessTax={businessTax}
          businessPayment={businessPayment}
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
  businessProfile: store.demo.businessProfile,
  businessTax: store.demo.businessTax,
  businessPayment: store.demo.businessPayment,
  businessMenu: store.demo.businessMenu,
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
    orderUnsubmit
  }
)(Order);
