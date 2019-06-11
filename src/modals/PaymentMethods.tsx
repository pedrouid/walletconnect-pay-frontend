import * as React from "react";
import styled from "styled-components";
import { IPaymentMethod } from "../helpers/types";
import Button from "../components/Button";

// import burner from "../assets/payment-methods/burner.png";
// import xdai from "../assets/payment-methods/xdai.png";
// import dai from "../assets/payment-methods/dai.png";
// import eth from "../assets/payment-methods/eth.png";

// const iconMap = { burner, xdai, dai, eth };

const SButton = styled(Button)`
  margin: 10px auto;
  max-width: 200px;
`;

const PaymentMethods = (props: any) => {
  const { settings, callback } = props;
  if (
    !(
      settings &&
      settings.paymentMethods &&
      settings.paymentMethods.length
    )
  ) {
    return null;
  }
  return (
    <React.Fragment>
      {settings.paymentMethods.map((method: IPaymentMethod) => {
        if (method.type === "walletconnect") {
          return (
            <SButton
              key={`${method.type}-${method.assetSymbol}-${method.chainId}`}
              onClick={() => callback(method)}
            >{`Pay with ${method.assetSymbol}`}</SButton>
          );
        } else if (method.type === "burner") {
          return (
            <SButton
              key={`${method.type}-${method.assetSymbol}-${method.chainId}`}
              onClick={() => callback(method)}
            >{`Pay with Burner`}</SButton>
          );
        }
        return null;
      })}
    </React.Fragment>
  );
};

export default PaymentMethods;
