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

export interface IBusinessProfile {
  id: string;
  name: string;
  logo: string;
  type: string;
  country: string;
  email: string;
  phone: string;
}

export interface IBusinessTax {
  rate: number;
  included: boolean;
  display: boolean;
}

export interface IBusinessPayment {
  methods: IPaymentMethod[];
  currency: string;
  address: string;
}

export interface IBusinessData {
  profile: IBusinessProfile;
  menu: IMenuItem[];
  tax: IBusinessTax;
  payment: IBusinessPayment;
}

export interface IPayment {
  status: "pending" | "success" | "failure";
  result: any;
}

export interface IOrderJson {
  id: string;
  timestamp: number;
  items: IOrderItem[];
  checkout: ICheckoutDetails;
  payment: IPayment;
}
