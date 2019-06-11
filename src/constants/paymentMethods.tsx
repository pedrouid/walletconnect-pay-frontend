import { IPaymentMethod } from "../helpers/types";

const PAYMENT_METHODS: IPaymentMethod[] = [
  {
    type: "burner",
    chainId: 100,
    assetSymbol: "xDAI"
  },
  {
    type: "walletconnect",
    chainId: 1,
    assetSymbol: "ETH"
  },
  {
    type: "walletconnect",
    chainId: 1,
    assetSymbol: "DAI"
  },
  {
    type: "walletconnect",
    chainId: 100,
    assetSymbol: "xDAI"
  }
];

export default PAYMENT_METHODS;
