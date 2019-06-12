export interface IMenuItem {
  id: string;
  name: string;
  description: string;
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

export interface IPaymentMethodDisplay {
  [name: string]: {
    color: string;
    imgSrc: string;
  };
}

export interface IPaymentMethod {
  type: string;
  chainId: number;
  assetSymbol: string;
}

export type IBusinessType =
  | "cafe"
  | "bar"
  | "fast_food"
  | "bistro"
  | "diner"
  | "buffet"
  | "food_truck"
  | "casual_restaurant"
  | "fine_dining"
  | "popup_restaurant";

export interface IProfile {
  id: string;
  name: string;
  description: string;
  logo: string;
  type: IBusinessType;
  country: string;
  email: string;
  phone: string;
}

export interface ISettings {
  taxRate: number;
  taxIncluded: boolean;
  taxDisplay: boolean;
  paymentMethods: IPaymentMethod[];
  paymentCurrency: string;
  paymentAddress: string;
}

export type IMenu = IMenuItem[];

export interface IData {
  profile: IProfile;
  settings: ISettings;
}

export type IPaymentStatus = "pending" | "success" | "failure";

export interface IPayment {
  status: IPaymentStatus;
  result: any;
}

export interface IOrderDetails {
  items: IOrderItem[];
  checkout: ICheckoutDetails;
}

export interface IOrderJson {
  id: string;
  timestamp: number;
  items: IOrderItem[];
  checkout: ICheckoutDetails;
  payment: IPayment;
}
