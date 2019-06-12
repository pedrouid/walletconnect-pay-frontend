import {
  ICheckoutDetails,
  ISettings,
  IOrderDetails,
  IOrderJson
} from "../helpers/types";
import { getSpacePrivate, setSpacePrivate } from "./box";
import { uuid } from "../helpers/utilities";
import { PAYMENT_PENDING } from "../constants/paymentStatus";
import { ORDER_ID, ORDER_LIST } from "../constants/space";
import {
  convertStringToNumber,
  convertNumberToString,
  multiply,
  divide,
  subtract,
  add
} from "./bignumber";

export const defaultCheckoutDetails: ICheckoutDetails = {
  rawtotal: 0,
  subtotal: 0,
  tax: 0,
  nettotal: 0
};

export function formatCheckoutDetails(
  rawtotal: number,
  settings: ISettings
): ICheckoutDetails {
  let checkout;
  const _rawtotal = convertNumberToString(rawtotal);
  const tax = multiply(_rawtotal, divide(settings.taxRate, 100));
  if (settings.taxIncluded) {
    const _subtotal = subtract(_rawtotal, tax);
    checkout = {
      rawtotal: convertStringToNumber(_rawtotal),
      subtotal: convertStringToNumber(_subtotal),
      tax: convertStringToNumber(tax),
      nettotal: convertStringToNumber(_rawtotal)
    };
  } else {
    const _nettotal = add(_rawtotal, tax);
    checkout = {
      rawtotal: convertStringToNumber(_rawtotal),
      subtotal: convertStringToNumber(_rawtotal),
      tax: convertStringToNumber(tax),
      nettotal: convertStringToNumber(_nettotal)
    };
  }
  return checkout;
}

export async function setOrderList(orderList: string[]): Promise<string[]> {
  await setSpacePrivate(ORDER_LIST, orderList);
  return orderList;
}

export async function getOrderList(): Promise<string[]> {
  const orderList = await getSpacePrivate(ORDER_LIST);
  return orderList;
}

export async function updateOrderList(orderId: string): Promise<string[]> {
  let orderList: string[] = [];

  const result = await getOrderList();
  if (result) {
    orderList = [...result, orderId];
  }

  await setOrderList(orderList);

  return orderList;
}

function formatOrderKey(orderId: string): string {
  return `${ORDER_ID}_${orderId}`;
}

function formatOrderJson(orderDetails: IOrderDetails): IOrderJson {
  const orderId = uuid();

  const orderJson: IOrderJson = {
    id: orderId,
    timestamp: Date.now(),
    items: orderDetails.items,
    checkout: orderDetails.checkout,
    payment: {
      status: PAYMENT_PENDING,
      result: ""
    }
  };
  return orderJson;
}

export async function setOrderJson(orderJson: IOrderJson): Promise<string> {
  const key = formatOrderKey(orderJson.id);
  await setSpacePrivate(key, JSON.stringify(orderJson));
  return orderJson.id;
}

export async function getOrderJson(orderId: string): Promise<IOrderJson> {
  const key = formatOrderKey(orderId);
  const orderJson = await getSpacePrivate(key);
  return orderJson;
}

export async function createOrderJson(
  orderDetails: IOrderDetails
): Promise<string> {
  const orderJson = formatOrderJson(orderDetails);

  const orderId = await setOrderJson(orderJson);

  await updateOrderList(orderId);

  return orderId;
}

export async function updateOrderJson(
  orderId: string,
  updatedOrderJson: any
): Promise<void> {
  const orderJson = await getOrderJson(orderId);

  const newOrderJson: IOrderJson = {
    ...orderJson,
    ...updatedOrderJson
  };

  await setOrderJson(newOrderJson);
}

export async function getAllOrders(): Promise<IOrderJson[]> {
  const orderList = await getOrderList();

  let orders: IOrderJson[] = [];

  if (orderList) {
    orders = await Promise.all(
      orderList.map((orderId: string) => getOrderJson(orderId))
    );
  }

  return orders;
}
