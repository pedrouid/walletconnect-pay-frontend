import { ICheckoutDetails, IBusinessData } from "../helpers/types";
import { getSpacePrivate, setSpacePrivate } from "./box";
import { uuid } from "../helpers/utilities";

import menus from "../data";

export function formatCheckoutDetails(
  rawtotal: number,
  businessData: IBusinessData
): ICheckoutDetails {
  let checkout;
  const tax = rawtotal * (businessData.taxRate / 100);
  if (businessData.taxInc) {
    checkout = {
      rawtotal,
      subtotal: rawtotal - tax,
      tax,
      nettotal: rawtotal
    };
  } else {
    checkout = {
      rawtotal,
      subtotal: rawtotal,
      tax,
      nettotal: rawtotal + tax
    };
  }
  return checkout;
}

export function getMenu(bussinessName: string) {
  let result = null;
  if (menus[bussinessName]) {
    result = menus[bussinessName] || null;
  }
  return result;
}

export async function createOrderJson(orderDetails: {
  items: any[];
  checkout: ICheckoutDetails;
}): Promise<string> {
  const orderId = uuid();

  const orderJson = {
    id: orderId,
    timestamp: Date.now(),
    items: orderDetails.items,
    checkout: orderDetails.checkout,
    payment: {
      status: "pending",
      result: ""
    }
  };

  await setSpacePrivate(orderId, JSON.stringify(orderJson));

  return orderId;
}

export async function updateOrderJson(
  orderId: string,
  updatedOrderJson: any
): Promise<void> {
  const orderJson = await getSpacePrivate(orderId);

  const newOrderJson = {
    ...orderJson,
    ...updatedOrderJson
  };

  await setSpacePrivate(orderId, JSON.stringify(newOrderJson));
}
