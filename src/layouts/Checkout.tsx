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
import { fonts } from "../styles";
import success from "../assets/success.png";
import error from "../assets/error.png";
import arrow from "../assets/arrow.png";

interface ICheckoutStyleProps {
  show: boolean;
}

const SCheckout = styled.div<ICheckoutStyleProps>`
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

const SCheckoutContainer = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const SCheckoutHeader = styled(SColumnHeader)`
  position: relative;
  display: flex;
  justify-content: center;
`;

const SCheckoutTitle = styled(STitle)`
  font-size: ${fonts.size.h5};
`;

const SCheckoutCallToAction = styled(SListItemName)`
  text-align: center;
  margin: 0.6em 0;
  font-size: 24px;
  font-weight: 700;
`;

const SCheckoutDescription = styled(SListItemDescription)`
  text-align: center;
`;

const SCheckoutColumn = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
`;

const SCheckoutFooter = styled(SColumnFooter)`
  border-top: 0;
`;

const QRCODE_HEIGHT = 300;

const SQRCodeWrapper = styled.div`
  width: 100%;
  height: ${QRCODE_HEIGHT}px;
`;

const SPaymentResult = styled.div`
  width: 100%;
  height: 100%;
  max-height: ${QRCODE_HEIGHT}px;
  padding-top: ${QRCODE_HEIGHT}px;
  position: relative;

  & > div {
    position: absolute;
    width: 100%;
    height: 100%;
    max-height: ${QRCODE_HEIGHT}px;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & > div > img {
    width: 125px;
    height: 125px;
  }
`;

const BACK_BUTTON_SIZE = 24;

const SBackButton = styled.div`
  position: absolute;
  font-size: ${BACK_BUTTON_SIZE / 1.5}px;
  font-weight: 400;
  top: calc((100% - ${BACK_BUTTON_SIZE}px) / 2);
  left: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  & > img {
    width: ${BACK_BUTTON_SIZE}px;
    height: ${BACK_BUTTON_SIZE}px;
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
        <SCheckoutColumn>
          <SPaymentResult>
            <div>
              <img src={success} alt={PAYMENT_COPY[PAYMENT_SUCCESS].title} />
            </div>
          </SPaymentResult>
          <SCheckoutCallToAction>
            {PAYMENT_COPY[PAYMENT_SUCCESS].title}
          </SCheckoutCallToAction>
          <SCheckoutDescription>
            {PAYMENT_COPY[PAYMENT_SUCCESS].description}
          </SCheckoutDescription>
        </SCheckoutColumn>
      );
    case PAYMENT_PENDING:
      return (
        <SCheckoutColumn>
          <SPaymentResult>
            <div>
              <Loader />
            </div>
          </SPaymentResult>
          <SCheckoutCallToAction>
            {PAYMENT_COPY[PAYMENT_PENDING].title}
          </SCheckoutCallToAction>
          <SCheckoutDescription>
            {PAYMENT_COPY[PAYMENT_PENDING].description}
          </SCheckoutDescription>
        </SCheckoutColumn>
      );

    case PAYMENT_FAILURE:
      return (
        <SCheckoutColumn>
          <SPaymentResult>
            <div>
              <img src={error} alt={PAYMENT_COPY[PAYMENT_FAILURE].title} />
            </div>
          </SPaymentResult>
          <SCheckoutCallToAction>
            {PAYMENT_COPY[PAYMENT_FAILURE].title}
          </SCheckoutCallToAction>
          <SCheckoutDescription>
            {PAYMENT_COPY[PAYMENT_FAILURE].description}
          </SCheckoutDescription>
        </SCheckoutColumn>
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
  settings,
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
    <SCheckout show={submitted}>
      <SCheckoutHeader>
        <SBackButton onClick={orderUnsubmit}>
          <img src={arrow} alt="" />
          <span>{`Back`}</span>
        </SBackButton>
        <SCheckoutTitle>{`Payment`}</SCheckoutTitle>
      </SCheckoutHeader>
      {!loading ? (
        <SCheckoutContainer>
          {!payment ? (
            <SCheckoutColumn>
              <SQRCodeWrapper>
                <QRCodeDisplay data={qrcode} />
              </SQRCodeWrapper>
              <SCheckoutCallToAction>{title}</SCheckoutCallToAction>
              <SCheckoutDescription>{description}</SCheckoutDescription>
            </SCheckoutColumn>
          ) : (
            <PaymentResult payment={payment} />
          )}
          <SCheckoutFooter>
            <Summary checkout={checkout} settings={settings} />
          </SCheckoutFooter>
        </SCheckoutContainer>
      ) : (
        <SCheckoutContainer>
          <Loader />
        </SCheckoutContainer>
      )}
    </SCheckout>
  );
};

export default Checkout;
