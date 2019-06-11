import {
  ICheckoutDetails,
  IBusinessTax,
  IOrderItem,
  IOrderJson
} from "../helpers/types";
import { getSpacePrivate, setSpacePrivate } from "./box";
import { uuid } from "../helpers/utilities";
import { PAYMENT_PENDING } from "../constants/paymentStatus";
import { ORDER_ID } from "../constants/space";
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
  businessTax: IBusinessTax
): ICheckoutDetails {
  let checkout;
  const _rawtotal = convertNumberToString(rawtotal);
  const tax = multiply(_rawtotal, divide(businessTax.rate, 100));
  if (businessTax.included) {
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

function formatOrderKey(orderId: string): string {
  return `${ORDER_ID}_${orderId}`;
}

export async function createOrderJson(orderDetails: {
  items: IOrderItem[];
  checkout: ICheckoutDetails;
}): Promise<string> {
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

  const key = formatOrderKey(orderId);

  await setSpacePrivate(key, JSON.stringify(orderJson));

  return orderId;
}

export async function updateOrderJson(
  orderId: string,
  updatedOrderJson: any
): Promise<void> {
  const key = formatOrderKey(orderId);

  const orderJson = await getSpacePrivate(key);

  const newOrderJson: IOrderJson = {
    ...orderJson,
    ...updatedOrderJson
  };

  await setSpacePrivate(key, JSON.stringify(newOrderJson));
}
