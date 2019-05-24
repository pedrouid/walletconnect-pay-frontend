import {
  IMenuItem,
  IOrderItem,
  ICheckoutDetails,
  IBusinessData
} from "../helpers/types";
import { IJsonRpcRequest } from "@walletconnect/types";
import {
  initWalletConnect,
  sendTransaction,
  killSession
} from "../helpers/walletconnect";
import { formatTransaction } from "../helpers/transaction";
import menus from "../data";
// import { setSpacePrivate, getSpacePrivate } from "src/helpers/box";
import { notificationShow } from "./_notification";

// -- Constants ------------------------------------------------------------- //

const ORDER_UPDATE_ITEMS = "order/ORDER_UPDATE_ITEMS";

const ORDER_LOAD_MENU_REQUEST = "order/ORDER_LOAD_MENU_REQUEST";
const ORDER_LOAD_MENU_SUCCESS = "order/ORDER_LOAD_MENU_SUCCESS";
const ORDER_LOAD_MENU_FAILURE = "order/ORDER_LOAD_MENU_FAILURE";

const ORDER_SUBMIT_REQUEST = "order/ORDER_SUBMIT_REQUEST";
const ORDER_SUBMIT_SUCCESS = "order/ORDER_SUBMIT_SUCCESS";
const ORDER_SUBMIT_FAILURE = "order/ORDER_SUBMIT_FAILURE";

const ORDER_PAYMENT_REQUEST = "order/ORDER_PAYMENT_REQUEST";
const ORDER_PAYMENT_SUCCESS = "order/ORDER_PAYMENT_SUCCESS";
const ORDER_PAYMENT_FAILURE = "order/ORDER_PAYMENT_FAILURE";

const ORDER_UNSUBMIT = "order/ORDER_UNSUBMIT";

const ORDER_CLEAR_STATE = "order/ORDER_CLEAR_STATE";

// -- Actions --------------------------------------------------------------- //

function formatCheckoutDetails(
  rawtotal: number,
  businessData: IBusinessData
): ICheckoutDetails {
  let checkout;
  if (businessData.taxInc) {
    const tax = rawtotal * (businessData.taxRate / 100);
    checkout = {
      rawtotal,
      subtotal: rawtotal - tax,
      tax,
      nettotal: rawtotal
    };
  } else {
    const tax = rawtotal * (businessData.taxRate / 100);
    checkout = {
      rawtotal,
      subtotal: rawtotal,
      tax,
      nettotal: rawtotal + tax
    };
  }
  return checkout;
}

function getMenu(bussinessName: string) {
  let result = null;
  if (menus[bussinessName]) {
    result = menus[bussinessName] || null;
  }
  return result;
}

export const orderLoadMenu = (bussinessName: string) => (
  dispatch: any,
  getState: any
) => {
  dispatch({ type: ORDER_LOAD_MENU_REQUEST });
  const businessData = getMenu(bussinessName);

  if (businessData) {
    dispatch({ type: ORDER_LOAD_MENU_SUCCESS, payload: businessData });
  } else {
    const error = new Error(`Menu doesn't exist for ${bussinessName}`);
    dispatch(notificationShow(error.message, true));
    dispatch({ type: ORDER_LOAD_MENU_FAILURE });
  }
};

export const orderAddItem = (item: IMenuItem) => (
  dispatch: any,
  getState: any
) => {
  const { businessData } = getState().order;
  let { items } = getState().order;
  let { rawtotal } = getState().order.checkout;

  let newItem = true;

  items = items.map((orderItem: IOrderItem) => {
    if (orderItem.name === item.name) {
      newItem = false;
      orderItem.quantity += 1;
      rawtotal += item.price;
    }
    return orderItem;
  });

  if (newItem) {
    items.push({
      ...item,
      quantity: 1
    });
    rawtotal += item.price;
  }

  dispatch({
    type: ORDER_UPDATE_ITEMS,
    payload: { items, checkout: formatCheckoutDetails(rawtotal, businessData) }
  });
};

export const orderRemoveItem = (item: IMenuItem) => (
  dispatch: any,
  getState: any
) => {
  const { businessData } = getState().order;
  let { items } = getState().order;
  let { rawtotal } = getState().order.checkout;

  items = items
    .map((orderItem: IOrderItem) => {
      if (orderItem.name === item.name) {
        orderItem.quantity -= 1;
        rawtotal -= item.price;
      }
      if (orderItem.quantity > 0) {
        return orderItem;
      }
      return null;
    })
    .filter((item: IOrderItem | null) => !!item);

  dispatch({
    type: ORDER_UPDATE_ITEMS,
    payload: { items, checkout: formatCheckoutDetails(rawtotal, businessData) }
  });
};

export const orderSubmit = () => async (dispatch: any, getState: any) => {
  // const { items, checkout } = getState().order;

  // const { rawtotal, tax, nettotal } = checkout;

  dispatch({ type: ORDER_SUBMIT_REQUEST });

  // const orderJson = {
  //   timestamp: Date.now(),
  //   items,
  //   rawtotal,
  //   tax,
  //   nettotal,
  //   receipt: ""
  // };

  // const orderHash = keccak256(JSON.stringify(orderJson));
  const orderHash = "";

  try {
    if (localStorage.getItem("walletconnect")) {
      localStorage.removeItem("walletconnect");
    }

    const connector = await initWalletConnect();

    dispatch({ type: ORDER_SUBMIT_SUCCESS, payload: connector.uri });

    connector.on("connect", async (error: Error, payload: IJsonRpcRequest) => {
      if (error) {
        throw error;
      }
      // await setSpacePrivate(orderHash, JSON.stringify(orderJson));

      const account = connector.accounts[0];

      dispatch(orderRequestPayment(account, orderHash));
    });

    connector.on(
      "disconnect",
      async (error: Error, payload: IJsonRpcRequest) => {
        if (error) {
          throw error;
        }

        dispatch(orderUnsubmit());
      }
    );
  } catch (error) {
    console.error(error); // tslint:disable-line
    dispatch(notificationShow(error.message, true));
    dispatch({ type: ORDER_SUBMIT_FAILURE });
  }
};

export const orderRequestPayment = (
  account: string,
  orderHash: string
) => async (dispatch: any, getState: any) => {
  dispatch({ type: ORDER_PAYMENT_REQUEST });

  try {
    const { businessData } = getState().order;
    const { nettotal } = getState().order.checkout;

    const from = account;
    const to = businessData.paymentAddress || account;

    const symbol = "DAI";
    const chainId = 1;
    const currency = businessData.currencySymbol;

    const tx = await formatTransaction(
      from,
      to,
      nettotal,
      currency,
      symbol,
      chainId
    );

    const txhash = await sendTransaction(tx);

    if (txhash) {
      // const order = await getSpacePrivate(orderHash);

      const order = {
        name: "",
        description: "",
        price: "",
        quantity: "",
        receipt: ""
      };

      const orderJson = JSON.parse(JSON.stringify(order));

      orderJson.receipt = txhash;

      // await setSpacePrivate(orderHash, JSON.stringify(orderJson));

      killSession();

      dispatch({ type: ORDER_PAYMENT_FAILURE, payload: txhash });
    } else {
      dispatch({ type: ORDER_PAYMENT_FAILURE });
    }
  } catch (error) {
    console.error(error); // tslint:disable-line
    dispatch(notificationShow(error.message, true));
    dispatch({ type: ORDER_PAYMENT_FAILURE });
  }
};

export const orderUnsubmit = () => (dispatch: any) => {
  killSession();
  dispatch({ type: ORDER_UNSUBMIT });
};

export const orderClearState = () => ({ type: ORDER_CLEAR_STATE });

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  businessData: {
    id: "",
    name: "",
    logo: "",
    menu: null,
    taxRate: 0,
    taxInc: true,
    nativeCurrency: ""
  },
  loading: false,
  submitted: false,
  items: [],
  uri: "",
  checkout: {
    rawtotal: 0,
    tax: 0,
    nettotal: 0
  },
  payment: null
};

export default (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case ORDER_UPDATE_ITEMS:
      return {
        ...state,
        items: action.payload.items,
        checkout: action.payload.checkout
      };
    case ORDER_LOAD_MENU_REQUEST:
      return { ...state, loading: true };
    case ORDER_LOAD_MENU_SUCCESS:
      return { ...state, loading: false, businessData: action.payload };
    case ORDER_LOAD_MENU_FAILURE:
      return { ...state, loading: false };

    case ORDER_SUBMIT_REQUEST:
      return { ...state, loading: true };
    case ORDER_SUBMIT_SUCCESS:
      return { ...state, uri: action.payload, submitted: true, loading: false };
    case ORDER_SUBMIT_FAILURE:
      return { ...state, loading: false };
    case ORDER_PAYMENT_REQUEST:
      return { ...state, payment: null };
    case ORDER_PAYMENT_SUCCESS:
      return { ...state, payment: { success: true, result: action.payload } };
    case ORDER_PAYMENT_FAILURE:
      return { ...state, payment: { success: false, result: null } };
    case ORDER_UNSUBMIT:
      return { ...state, uri: "", payment: null, submitted: false };
    case ORDER_CLEAR_STATE:
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
};
