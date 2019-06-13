import { IPaymentMethod, IPaymentMethodDisplayMap } from "../helpers/types";

import burner from "../assets/payment-methods/burner.png";
import xdai from "../assets/payment-methods/xdai.png";
import dai from "../assets/payment-methods/dai.png";
import eth from "../assets/payment-methods/eth.png";

export const PAYMENT_METHODS_DISPLAY: IPaymentMethodDisplayMap = {
  dai: {
    color: "yellow",
    imgSrc: dai
  },
  eth: {
    color: "blue",
    imgSrc: eth
  },
  burner: {
    color: "orange",
    imgSrc: burner
  },
  xdai: {
    color: "yellowTwo",
    imgSrc: xdai
  }
};

export const DEFAULT_PAYMENT_METHOD: IPaymentMethod = {
  type: "walletconnect",
  chainId: 1,
  assetSymbol: "DAI"
};

const PAYMENT_METHODS: IPaymentMethod[] = [
  DEFAULT_PAYMENT_METHOD,
  {
    type: "walletconnect",
    chainId: 1,
    assetSymbol: "ETH"
  },
  {
    type: "burner",
    chainId: 100,
    assetSymbol: "xDAI"
  },
  {
    type: "walletconnect",
    chainId: 100,
    assetSymbol: "xDAI"
  }
];

export default PAYMENT_METHODS;
