import { IBusinessData } from "../helpers/types";
import { setSpacePrivate, getSpacePrivate } from "./box";
import { BUSINESS_PROFILE } from "../constants/space";

import demo from "../data";

export function getDemoBusiness(bussinessName: string) {
  let result = null;
  if (demo[bussinessName]) {
    result = demo[bussinessName] || null;
  }
  return result;
}

export const defaultBusinessData: IBusinessData = {
  profile: {
    id: "",
    name: "",
    logo: "",
    type: "cafe",
    country: "",
    email: "",
    phone: ""
  },
  tax: {
    rate: 0,
    included: true,
    display: false
  },
  payment: {
    methods: [],
    currency: "USD",
    address: ""
  }
};

export function formatBusinessData(
  partialBusinessData: Partial<IBusinessData>
): IBusinessData {
  const businessData: IBusinessData = {
    ...defaultBusinessData,
    ...partialBusinessData
  };
  return businessData;
}

export async function setBusinessData(
  partialBusinessData: Partial<IBusinessData>
): Promise<void> {
  const businessData = formatBusinessData(partialBusinessData);
  await setSpacePrivate(BUSINESS_PROFILE, businessData);
}

export async function getBusinessData(): Promise<IBusinessData> {
  const businessData = await getSpacePrivate(BUSINESS_PROFILE);
  return businessData;
}
