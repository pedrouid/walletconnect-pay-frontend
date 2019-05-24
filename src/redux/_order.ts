import { IMenuItem, IOrderItem, IPayment } from "../helpers/types";
import { IJsonRpcRequest } from "@walletconnect/types";
import {
  initWalletConnect,
  sendTransaction,
  killSession
} from "../helpers/walletconnect";
import { formatTransaction } from "../helpers/transaction";
import { getMenu, formatCheckoutDetails } from "../helpers/order";
// import { setSpacePrivate, getSpacePrivate } from "../helpers/box";
import { notificationShow } from "./_notification";
import { apiGetTransactionReceipt } from "../helpers/api";
import { convertHexToNumber } from "../helpers/bignumber";
import { getChainData } from "src/helpers/utilities";

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

const ORDER_PAYMENT_UPDATE = "order/ORDER_PAYMENT_UPDATE";

const ORDER_UPDATE_WARNING = "order/ORDER_UPDATE_WARNING";

const ORDER_UNSUBMIT = "order/ORDER_UNSUBMIT";

const ORDER_CLEAR_STATE = "order/ORDER_CLEAR_STATE";

// -- Actions --------------------------------------------------------------- //

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

export const orderManageSession = (
  payload: IJsonRpcRequest,
  orderHash: string
) => (dispatch: any, getState: any) => {
  // await setSpacePrivate(orderHash, JSON.stringify(orderJson));

  const { businessData } = getState().order;
  const { accounts, chainId } = payload.params[0];
  const account = accounts[0];

  if (chainId !== businessData.chainId) {
    const chainData = getChainData(businessData.chainId);
    dispatch(
      orderUpdateWarning({
        show: true,
        message: `Please switch your Wallet to ${chainData.name}`
      })
    );
  } else {
    dispatch(orderUpdateWarning({ show: false, message: "" }));
    dispatch(orderRequestPayment(account, orderHash));
  }
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
      dispatch(orderManageSession(payload, orderHash));
    });

    connector.on(
      "session_update",
      async (error: Error, payload: IJsonRpcRequest) => {
        if (error) {
          throw error;
        }
        dispatch(orderManageSession(payload, orderHash));
      }
    );

    connector.on(
      "disconnect",
      async (error: Error, payload: IJsonRpcRequest) => {
        if (error) {
          throw error;
        }
        if (!getState().order.payment) {
          dispatch(orderUnsubmit());
        }
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

    const tx = await formatTransaction(
      from,
      to,
      nettotal,
      businessData.currencySymbol,
      businessData.assetSymbol,
      businessData.chainId
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

      const payment: IPayment = { status: "pending", result: txhash };
      await dispatch({ type: ORDER_PAYMENT_SUCCESS, payload: payment });

      killSession();

      dispatch(orderSubscribeToPayment());
    } else {
      const payment: IPayment = { status: "failure", result: null };
      dispatch({ type: ORDER_PAYMENT_FAILURE, payload: payment });
    }
  } catch (error) {
    console.error(error); // tslint:disable-line
    dispatch(notificationShow(error.message, true));
    const payment: IPayment = { status: "failure", result: null };
    dispatch({ type: ORDER_PAYMENT_FAILURE, payload: payment });
  }
};

let subscribeInterval: any;

export const orderSubscribeToPayment = () => (dispatch: any, getState: any) => {
  const { payment, businessData } = getState().order;
  clearInterval(subscribeInterval);
  if (payment.status === "pending" && payment.result) {
    subscribeInterval = setInterval(async () => {
      const result = await apiGetTransactionReceipt(
        payment.result,
        businessData.chainId
      );
      if (result) {
        clearInterval(subscribeInterval);
        const status = convertHexToNumber(result.status);
        dispatch(orderUpdatePayment(status));
      }
    }, 1000);
  }
};

export const orderUpdatePayment = (status: number) => (
  dispatch: any,
  getState: any
) => {
  const { payment } = getState().order;
  let updatedPayment: any;
  if (status === 1) {
    updatedPayment = { ...payment, status: "success" };
  } else {
    updatedPayment = { ...payment, status: "failure" };
  }
  dispatch({ type: ORDER_PAYMENT_UPDATE, payload: updatedPayment });
};

export const orderUpdateWarning = (warning: {
  show: boolean;
  message: string;
}) => ({
  type: ORDER_UPDATE_WARNING,
  payload: warning
});

export const orderUnsubmit = () => (dispatch: any, getState: any) => {
  const { payment, items } = getState().order;
  let updatedItems = [...items];
  if (payment) {
    if (payment.status === "pending") {
      dispatch(notificationShow("Payment is still pending", true));
      return;
    } else if (payment.status === "success") {
      updatedItems = [];
    }
  }
  killSession();
  dispatch({ type: ORDER_UNSUBMIT, payload: updatedItems });
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
  payment: null,
  warning: {
    show: false,
    message: ""
  }
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
    case ORDER_PAYMENT_FAILURE:
    case ORDER_PAYMENT_UPDATE:
      return { ...state, payment: action.payload };
    case ORDER_UNSUBMIT:
      return {
        ...state,
        uri: INITIAL_STATE.uri,
        payment: INITIAL_STATE.payment,
        submitted: INITIAL_STATE.submitted,
        warning: INITIAL_STATE.warning,
        items: action.payload
      };
    case ORDER_CLEAR_STATE:
      return { ...state, ...INITIAL_STATE };

    case ORDER_UPDATE_WARNING:
      return { ...state, warning: action.payload };
    default:
      return state;
  }
};
