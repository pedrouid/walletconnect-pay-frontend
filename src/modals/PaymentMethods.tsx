import * as React from "react";
import styled from "styled-components";
import { IPaymentMethod } from "../helpers/types";
import ButtonWithImage from "../components/ButtonWithImage";
import { fonts } from "../styles";
import { PAYMENT_METHODS_DISPLAY } from "../constants/paymentMethods";

const SColumnRowWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const SButtonWithImage = styled(ButtonWithImage)`
  margin: 10px;
  font-size: ${fonts.size.h5};
  max-width: 250px;
`;

const PaymentMethods = (props: any) => {
  const { settings, callback } = props;
  if (
    !(settings && settings.paymentMethods && settings.paymentMethods.length)
  ) {
    return null;
  }
  return (
    <SColumnRowWrap>
      {settings.paymentMethods.map((method: IPaymentMethod) => {
        if (method.type === "walletconnect") {
          const display =
            PAYMENT_METHODS_DISPLAY[method.assetSymbol.toLowerCase()];
          return (
            <SButtonWithImage
              imgSize={40}
              imgSrc={display.imgSrc}
              color={display.color}
              key={`${method.type}-${method.assetSymbol}-${method.chainId}`}
              onClick={() => callback(method)}
            >
              {method.assetSymbol}
            </SButtonWithImage>
          );
        } else {
          const display = PAYMENT_METHODS_DISPLAY[method.type.toLowerCase()];
          return (
            <SButtonWithImage
              imgSize={40}
              imgSrc={display.imgSrc}
              color={display.color}
              key={`${method.type}-${method.assetSymbol}-${method.chainId}`}
              onClick={() => callback(method)}
            >{`Burner`}</SButtonWithImage>
          );
        }
        return null;
      })}
    </SColumnRowWrap>
  );
};

export default PaymentMethods;
