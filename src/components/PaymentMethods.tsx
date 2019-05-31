import * as React from "react";
import styled from "styled-components";
import { IPaymentMethod } from "../helpers/types";
import Modal from "../components/Modal";
import Button from "../components/Button";

// import burner from "../assets/burner.png";
// import xdai from "../assets/xdai.png";
// import dai from "../assets/dai.png";
// import eth from "../assets/eth.png";

// const iconMap = { burner, xdai, dai, eth };

const SModal = styled(Modal)`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SButton = styled(Button)`
  margin: 10px auto;
  max-width: 200px;
`;

const PaymentMethods = (props: any) => {
  const { show, businessData, callback } = props;
  if (
    !(
      businessData &&
      businessData.payment &&
      businessData.payment.methods &&
      businessData.payment.methods.length
    )
  ) {
    return null;
  }
  return (
    <SModal show={show} toggleModal={callback}>
      {businessData.payment.methods.map((method: IPaymentMethod) => {
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
    </SModal>
  );
};

export default PaymentMethods;
