import {
  IData,
  IProfile,
  ISettings,
  IMenu,
  IOrderJson
} from "../helpers/types";
import {
  openBox,
  openSpace,
  setSpacePrivate,
  getSpacePrivate,
  setSpacePublic,
  getSpacePublic,
  subscribeToThread
} from "./box";
import { DATA, MENU } from "../constants/space";
import { DEFAULT_PAYMENT_METHOD } from "../constants/paymentMethods";

import demo from "../demo";
import { openOrderThread } from "./order";
import { logMsg } from "./dev";

export function getDemoBusiness(bussinessName?: string) {
  let result = demo[Object.keys(demo)[0]];
  if (bussinessName && demo[bussinessName]) {
    result = demo[bussinessName];
  }
  return result;
}

export const defaultProfile: IProfile = {
  id: "",
  name: "",
  description: "",
  logo: "",
  type: "cafe",
  country: "DE",
  email: "",
  phone: ""
};

export const defaultSettings: ISettings = {
  taxRate: 20,
  taxIncluded: true,
  taxDisplay: true,
  paymentCurrency: "USD",
  paymentAddress: "",
  paymentMethods: [DEFAULT_PAYMENT_METHOD]
};

export const defaultData: IData = {
  profile: defaultProfile,
  settings: defaultSettings
};

export function formatData(partialData: Partial<IData>): IData {
  const profile = {
    ...defaultProfile,
    ...partialData.profile
  };

  const settings = {
    ...defaultSettings,
    ...partialData.settings
  };

  const data: IData = { profile, settings };

  return data;
}

export async function setData(partialData: Partial<IData>): Promise<IData> {
  const data = formatData(partialData);
  await setSpacePrivate(DATA, data);
  return data;
}

export async function getData(): Promise<IData> {
  const data = await getSpacePrivate(DATA);
  return data;
}

export async function setMenu(menu: IMenu): Promise<IMenu> {
  await setSpacePublic(MENU, menu);
  return menu;
}

export async function getMenu(): Promise<IMenu> {
  const menu = await getSpacePublic(MENU);
  return menu;
}

export async function openBusinessBox(
  address: string,
  provider: any,
  orderCallback: any,
  syncCallback: any
): Promise<{ data: IData | null; menu: IMenu | null; orders: IOrderJson[] }> {
  await openBox(address, provider, syncCallback);
  logMsg("BOX IS OPEN");

  await openSpace();
  logMsg("SPACE IS OPEN");

  const data = await getData();
  logMsg("GOT DATA");
  const menu = await getMenu();
  logMsg("GOT MENU");
  const orders = await openOrderThread(address);
  logMsg("GOT ORDERS");

  subscribeToThread(orderCallback);

  return { data, menu, orders };
}
