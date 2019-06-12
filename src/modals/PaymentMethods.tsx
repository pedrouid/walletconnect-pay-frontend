import * as React from "react";
import styled from "styled-components";
import { IPaymentMethod } from "../helpers/types";
import ButtonWithImage from "../components/ButtonWithImage";

import burner from "../assets/payment-methods/burner.png";
import xdai from "../assets/payment-methods/xdai.png";
import dai from "../assets/payment-methods/dai.png";
import eth from "../assets/payment-methods/eth.png";

const iconMap = { burner, xdai, dai, eth };

const SButtonWithImage = styled(ButtonWithImage)`
  margin: 10px auto;
  max-width: 200px;
`;

const PaymentMethods = (props: any) => {
  const { settings, callback } = props;
  if (
    !(settings && settings.paymentMethods && settings.paymentMethods.length)
  ) {
    return null;
  }
  return (
    <React.Fragment>
      {settings.paymentMethods.map((method: IPaymentMethod) => {
        if (method.type === "walletconnect") {
          return (
            <SButtonWithImage
              imgSrc={iconMap[method.assetSymbol.toLowerCase()]}
              key={`${method.type}-${method.assetSymbol}-${method.chainId}`}
              onClick={() => callback(method)}
            >{`Pay with ${method.assetSymbol}`}</SButtonWithImage>
          );
        } else if (method.type === "burner") {
          return (
            <SButtonWithImage
              imgSrc={iconMap[method.type]}
              key={`${method.type}-${method.assetSymbol}-${method.chainId}`}
              onClick={() => callback(method)}
            >{`Pay with Burner`}</SButtonWithImage>
          );
        }
        return null;
      })}
    </React.Fragment>
  );
};

export default PaymentMethods;
