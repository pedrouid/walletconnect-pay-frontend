import * as React from "react";
import styled from "styled-components";
import { colors, transitions } from "../styles";
import Loader from "../components/Loader";
import Summary from "../components/Summary";
import QRCodeDisplay from "../components/QRCodeDisplay";
import PaymentResult from "../components/PaymentResult";
import {
  STitle,
  SColumnHeader,
  SColumnFooter,
  SListItemName,
  SListItemDescription
} from "../components/common";
import { fonts } from "../styles";
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
            <PaymentResult height={QRCODE_HEIGHT} payment={payment} />
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
