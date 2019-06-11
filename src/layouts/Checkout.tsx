import * as React from "react";
import styled from "styled-components";
import { colors, transitions } from "../styles";
import Loader from "../components/Loader";
import Summary from "../components/Summary";

import QRCodeDisplay from "../components/QRCodeDisplay";

import {
  STitle,
  SColumnHeader,
  SColumnFooter,
  SListItemName,
  SListItemDescription
} from "../components/common";

import { IPayment } from "../helpers/types";

import {
  PAYMENT_SUCCESS,
  PAYMENT_PENDING,
  PAYMENT_FAILURE
} from "../constants/paymentStatus";

import success from "../assets/success.png";
import error from "../assets/error.png";
import arrow from "../assets/arrow.png";

interface IModalStyleProps {
  show: boolean;
}

const SModal = styled.div<IModalStyleProps>`
  transition: ${transitions.long};
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  overflow-y: scroll;
  background-color: rgb(${colors.white});
  transform: ${({ show }) =>
    show ? "translate3d(0, 0, 0)" : "translate3d(100vw, 0, 0)"};
`;

const SModalContainer = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const SModalHeader = styled(SColumnHeader)`
  position: relative;
  display: flex;
  justify-content: center;
`;

const SModalCallToAction = styled(SListItemName)`
  text-align: center;
  margin: 0.6em 0;
  font-size: 24px;
  font-weight: 700;
`;

const SModalDescription = styled(SListItemDescription)`
  text-align: center;
`;

const SModalColumn = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
`;

const SModalFooter = styled(SColumnFooter)`
  border-top: 0;
`;

const SPaymentResult = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;

  & > div {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & > div > img {
    width: 150px;
    height: 150px;
  }
`;

const SBackButton = styled.div`
  position: absolute;
  font-size: 16px;
  font-weight: 400;
  left: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  & img {
    width: 24px;
    height: 24px;
  }
`;

const PAYMENT_COPY = {
  [PAYMENT_SUCCESS]: {
    title: "Success",
    description: `Your payment went through and your order is being prepared.`
  },
  [PAYMENT_PENDING]: {
    title: "Payment Pending",
    description: `We are waiting for a blockchain confirmation of your payment.`
  },
  [PAYMENT_FAILURE]: {
    title: "Payment Failed",
    description: `Please check your wallet to for any transaction information.`
  }
};

const PaymentResult = (props: { payment: IPayment }) => {
  switch (props.payment.status) {
    case PAYMENT_SUCCESS:
      return (
        <SModalColumn>
          <SPaymentResult>
            <div>
              <img src={success} alt={PAYMENT_COPY[PAYMENT_SUCCESS].title} />
            </div>
          </SPaymentResult>
          <SModalCallToAction>
            {PAYMENT_COPY[PAYMENT_SUCCESS].title}
          </SModalCallToAction>
          <SModalDescription>
            {PAYMENT_COPY[PAYMENT_SUCCESS].description}
          </SModalDescription>
        </SModalColumn>
      );
    case PAYMENT_PENDING:
      return (
        <SModalColumn>
          <SPaymentResult>
            <div>
              <Loader />
            </div>
          </SPaymentResult>
          <SModalCallToAction>
            {PAYMENT_COPY[PAYMENT_PENDING].title}
          </SModalCallToAction>
          <SModalDescription>
            {PAYMENT_COPY[PAYMENT_PENDING].description}
          </SModalDescription>
        </SModalColumn>
      );

    case PAYMENT_FAILURE:
      return (
        <SModalColumn>
          <SPaymentResult>
            <div>
              <img src={error} alt={PAYMENT_COPY[PAYMENT_FAILURE].title} />
            </div>
          </SPaymentResult>
          <SModalCallToAction>
            {PAYMENT_COPY[PAYMENT_FAILURE].title}
          </SModalCallToAction>
          <SModalDescription>
            {PAYMENT_COPY[PAYMENT_FAILURE].description}
          </SModalDescription>
        </SModalColumn>
      );
    default:
      return null;
  }
};

function formatBurnerUrl(
  paymentAddress: string,
  amount: string,
  orderId: string
) {
  const url = `https://xdai.io/${paymentAddress};${amount};${orderId};Order`;
  return url;
}

const Checkout = ({
  loading,
  businessTax,
  businessPayment,
  submitted,
  payment,
  paymentMethod,
  paymentAddress,
  orderUnsubmit,
  checkout,
  uri,
  orderId
}: any) => {
  if (!paymentMethod) {
    return null;
  }
  paymentAddress =
    paymentAddress || "0x9b7b2B4f7a391b6F14A81221AE0920A9735B67Fb";
  const qrcode =
    paymentMethod.type === "walletconnect"
      ? uri
      : formatBurnerUrl(paymentAddress, checkout.nettotal, orderId);
  const title =
    paymentMethod.type === "walletconnect"
      ? `Scan with WalletConnect`
      : `Scan with Burner Wallet`;
  const description =
    paymentMethod.type === "walletconnect"
      ? `Scan this QR code with your WalletConnect-enabled mobile wallet to pay.`
      : `Scan this QR code with your Burner wallet to pay.`;
  return (
    <SModal show={submitted}>
      <SModalHeader>
        <SBackButton onClick={orderUnsubmit}>
          <img src={arrow} alt="" />
          <span>{`Back`}</span>
        </SBackButton>
        <STitle>{`Payment`}</STitle>
      </SModalHeader>
      {!loading ? (
        <SModalContainer>
          {!payment ? (
            <SModalColumn>
              <QRCodeDisplay data={qrcode} />
              <SModalCallToAction>{title}</SModalCallToAction>
              <SModalDescription>{description}</SModalDescription>
            </SModalColumn>
          ) : (
            <PaymentResult payment={payment} />
          )}
          <SModalFooter>
            <Summary
              checkout={checkout}
              businessTax={businessTax}
              businessPayment={businessPayment}
            />
          </SModalFooter>
        </SModalContainer>
      ) : (
        <SModalContainer>
          <Loader />
        </SModalContainer>
      )}
    </SModal>
  );
};

export default Checkout;
