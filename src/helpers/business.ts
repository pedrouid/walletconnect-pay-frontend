import {
  IBusinessData,
  IBusinessProfile,
  IBusinessTax,
  IBusinessPayment
} from "../helpers/types";
import { openBox, openSpace, setSpacePrivate, getSpacePrivate } from "./box";
import { BUSINESS_DATA } from "../constants/space";

import demo from "../data";

export function getDemoBusiness(bussinessName: string) {
  let result = null;
  if (demo[bussinessName]) {
    result = demo[bussinessName] || null;
  }
  return result;
}

export const defaultBusinessProfile: IBusinessProfile = {
  id: "",
  name: "",
  description: "",
  logo: "",
  type: "cafe",
  country: "DE",
  email: "",
  phone: ""
};

export const defaultBusinessTax: IBusinessTax = {
  rate: 20,
  included: true,
  display: true
};

export const defaultBusinessPayment: IBusinessPayment = {
  currency: "USD",
  address: "",
  methods: [
    {
      type: "walletconnect",
      chainId: 1,
      assetSymbol: "DAI"
    }
  ]
};

export const defaultBusinessData: IBusinessData = {
  profile: defaultBusinessProfile,
  tax: defaultBusinessTax,
  payment: defaultBusinessPayment
};

export function formatBusinessData(
  partialBusinessData: Partial<IBusinessData>
): IBusinessData {
  const profile = {
    ...defaultBusinessProfile,
    ...partialBusinessData.profile
  };

  const tax = {
    ...defaultBusinessTax,
    ...partialBusinessData.tax
  };

  const payment = {
    ...defaultBusinessPayment,
    ...partialBusinessData.payment
  };

  const businessData: IBusinessData = { profile, tax, payment };

  return businessData;
}

export async function setBusinessData(
  partialBusinessData: Partial<IBusinessData>
): Promise<IBusinessData> {
  const businessData = formatBusinessData(partialBusinessData);
  await setSpacePrivate(BUSINESS_DATA, businessData);
  return businessData;
}

export async function getBusinessData(): Promise<IBusinessData> {
  const businessData = await getSpacePrivate(BUSINESS_DATA);
  return businessData;
}

export async function openBusinessBox(
  address: string,
  provider: any
): Promise<IBusinessData> {
  let result = null;

  await openBox(address, provider);

  await openSpace();

  const businessData = await getSpacePrivate(BUSINESS_DATA);

  if (businessData) {
    result = businessData;
  }

  return result;
}
