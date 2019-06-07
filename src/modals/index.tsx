import * as React from "react";
import { connect } from "react-redux";
import Modal from "../components/Modal";
import { modalHide } from "../redux/_modal";
import {
  PAYMENT_METHODS_MODAL,
  PLAIN_MESSAGE_MODAL,
  ADMIN_AUTHENTICATION_MODAL
} from "../constants/modals";

import PaymentMethods from "./PaymentMethods";
import PlainMessage from "./PlainMessage";
import AdminAuthentication from "./AdminAuthentication";

class ModalController extends React.Component<any, any> {
  public renderModal() {
    const { name, modalProps } = this.props;
    switch (name) {
      case PAYMENT_METHODS_MODAL:
        return <PaymentMethods {...modalProps} />;
      case PLAIN_MESSAGE_MODAL:
        return <PlainMessage {...modalProps} />;
      case ADMIN_AUTHENTICATION_MODAL:
        return <AdminAuthentication {...modalProps} />;
      default:
        return <div />;
    }
  }
  public render() {
    const { show, modalHide, disableToggle } = this.props;
    return (
      <Modal show={show} toggleModal={!disableToggle ? modalHide : undefined}>
        {this.renderModal()}
      </Modal>
    );
  }
}

const reduxProps = (store: any) => ({
  show: store.modal.show,
  name: store.modal.name,
  modalProps: store.modal.modalProps,
  disableToggle: store.modal.disableToggle
});

export default connect(
  reduxProps,
  { modalHide }
)(ModalController);
