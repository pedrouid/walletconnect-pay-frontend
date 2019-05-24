import { ICheckoutDetails, IBusinessData } from "../helpers/types";

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
