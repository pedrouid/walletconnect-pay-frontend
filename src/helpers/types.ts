export interface IMenuItem {
  name: string;
  description?: string;
  price: number;
  image: string;
}

export interface IOrderItem extends IMenuItem {
  quantity: number;
}

export interface IGasPrice {
  time: number;
  price: number;
}

export interface IGasPrices {
  timestamp: number;
  slow: IGasPrice;
  average: IGasPrice;
  fast: IGasPrice;
}

export interface IAssetData {
  symbol: string;
  name: string;
  decimals: number;
  contractAddress: string;
  balance?: string;
}

export interface IChainData {
  name: string;
  short_name: string;
  chain: string;
  network: string;
  chain_id: number;
  network_id: number;
  rpc_url: string;
}

export interface ICheckoutDetails {
  rawtotal: number;
  subtotal: number;
  tax: number;
  nettotal: number;
}

export interface INativeCurrency {
  symbol: string;
  currency: string;
  decimals: number;
  alignment: string;
  assetLimit: number;
}

export interface IPaymentMethod {
  type: string;
  chainId: number;
  assetSymbol: string;
}

export interface IBusinessData {
  id: string;
  name: string;
  logo: string;
  menu: IMenuItem[];
  paymentMethods: IPaymentMethod[];
  taxRate: number;
  taxInc: boolean;
  taxDisplay: boolean;
  currencySymbol: string;
  paymentAddress: string;
}

export interface IPayment {
  status: "pending" | "success" | "failure";
  result: any;
}
