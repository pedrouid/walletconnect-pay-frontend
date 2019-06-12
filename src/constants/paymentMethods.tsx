import { IPaymentMethod } from "../helpers/types";

import burner from "../assets/payment-methods/burner.png";
import xdai from "../assets/payment-methods/xdai.png";
import dai from "../assets/payment-methods/dai.png";
import eth from "../assets/payment-methods/eth.png";

export const DEFAULT_PAYMENT_METHOD: IPaymentMethod = {
  type: "walletconnect",
  chainId: 1,
  assetSymbol: "DAI",
  display: {
    color: "yellow",
    imgSrc: dai
  }
};

const PAYMENT_METHODS: IPaymentMethod[] = [
  DEFAULT_PAYMENT_METHOD,
  {
    type: "walletconnect",
    chainId: 1,
    assetSymbol: "ETH",
    display: {
      color: "blue",
      imgSrc: eth
    }
  },
  {
    type: "burner",
    chainId: 100,
    assetSymbol: "xDAI",
    display: {
      color: "orange",
      imgSrc: burner
    }
  },
  {
    type: "walletconnect",
    chainId: 100,
    assetSymbol: "xDAI",
    display: {
      color: "yellowTwo",
      imgSrc: xdai
    }
  }
];

export default PAYMENT_METHODS;
