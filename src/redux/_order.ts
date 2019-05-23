import { IMenuItem, IOrderItem } from "../helpers/types";
import { IJsonRpcRequest } from "@walletconnect/types";
import {
  initWalletConnect,
  sendTransaction,
  killSession
} from "../helpers/walletconnect";
import { formatTransaction } from "../helpers/transaction";
import { keccak256 } from "../helpers/eth";
import menu from "../data/menu";
// import { setSpacePrivate, getSpacePrivate } from "src/helpers/box";
import { notificationShow } from "./_notification";

// -- Constants ------------------------------------------------------------- //

const ORDER_UPDATE_ITEMS = "order/ORDER_UPDATE_ITEMS";

const ORDER_SUBMIT_REQUEST = "order/ORDER_SUBMIT_REQUEST";
const ORDER_SUBMIT_SUCCESS = "order/ORDER_SUBMIT_SUCCESS";
const ORDER_SUBMIT_FAILURE = "order/ORDER_SUBMIT_FAILURE";

const ORDER_PAYMENT_REQUEST = "order/ORDER_PAYMENT_REQUEST";
const ORDER_PAYMENT_SUCCESS = "order/ORDER_PAYMENT_SUCCESS";
const ORDER_PAYMENT_FAILURE = "order/ORDER_PAYMENT_FAILURE";

const ORDER_UNSUBMIT = "order/ORDER_UNSUBMIT";

const ORDER_CLEAR_STATE = "order/ORDER_CLEAR_STATE";

// -- Actions --------------------------------------------------------------- //

const TAX_RATE = 0.11;

interface ICheckoutDetails {
  subtotal: number;
  tax: number;
  nettotal: number;
}

function formatCheckoutDetails(subtotal: number): ICheckoutDetails {
  const checkout = {
    subtotal,
    tax: subtotal * TAX_RATE,
    nettotal: subtotal * (1 + TAX_RATE)
  };
  return checkout;
}

export const orderAddItem = (item: IMenuItem) => (
  dispatch: any,
  getState: any
) => {
  let { items } = getState().order;
  let { subtotal } = getState().order.checkout;

  let newItem = true;

  items = items.map((orderItem: IOrderItem) => {
    if (orderItem.name === item.name) {
      newItem = false;
      orderItem.quantity += 1;
      subtotal += item.price;
    }
    return orderItem;
  });

  if (newItem) {
    items.push({
      ...item,
      quantity: 1
    });
    subtotal += item.price;
  }

  dispatch({
    type: ORDER_UPDATE_ITEMS,
    payload: { items, checkout: formatCheckoutDetails(subtotal) }
  });
};

export const orderRemoveItem = (item: IMenuItem) => (
  dispatch: any,
  getState: any
) => {
  let { items } = getState().order;
  let { subtotal } = getState().order.checkout;

  items = items
    .map((orderItem: IOrderItem) => {
      if (orderItem.name === item.name) {
        orderItem.quantity -= 1;
        subtotal -= item.price;
      }
      if (orderItem.quantity > 0) {
        return orderItem;
      }
      return null;
    })
    .filter((item: IOrderItem | null) => !!item);

  dispatch({
    type: ORDER_UPDATE_ITEMS,
    payload: { items, checkout: formatCheckoutDetails(subtotal) }
  });
};

export const orderSubmit = () => async (dispatch: any, getState: any) => {
  const { items, subtotal, tax, nettotal } = getState().order;

  dispatch({ type: ORDER_SUBMIT_REQUEST });

  const orderJson = {
    timestamp: Date.now(),
    items,
    subtotal,
    tax,
    nettotal,
    receipt: ""
  };

  const orderHash = keccak256(JSON.stringify(orderJson));

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
    const { nettotal } = getState().order;

    const symbol = "DAI";
    const chainId = 1;
    const currency = "USD";

    const tx = await formatTransaction(
      account,
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
  menu,
  loading: false,
  submitted: false,
  items: [],
  uri: "",
  checkout: {
    subtotal: 0,
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
