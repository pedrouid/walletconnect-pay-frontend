import { IBusinessData } from "../helpers/types";
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
