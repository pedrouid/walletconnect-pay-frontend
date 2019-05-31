import {
  IMenuItem,
  IOrderItem,
  IPayment,
  IPaymentMethod
} from "../helpers/types";
import { IJsonRpcRequest } from "@walletconnect/types";
import {
  initWalletConnect,
  sendTransaction,
  killSession
} from "../helpers/walletconnect";
import { formatTransaction } from "../helpers/transaction";
import {
  // createOrderJson,
  // updateOrderJson,
  getDemoBusinessData,
  formatCheckoutDetails
} from "../helpers/order";
import { notificationShow } from "./_notification";
import { apiGetTransactionReceipt } from "../helpers/api";
import { convertHexToNumber } from "../helpers/bignumber";
import { getChainData } from "../helpers/utilities";

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

const ORDER_CHOOSE_PAYMENT_REQUEST = "order/ORDER_CHOOSE_PAYMENT_REQUEST";
const ORDER_CHOOSE_PAYMENT_SUCCESS = "order/ORDER_CHOOSE_PAYMENT_SUCCESS";
const ORDER_CHOOSE_PAYMENT_FAILURE = "order/ORDER_CHOOSE_PAYMENT_FAILURE";

const ORDER_PAYMENT_UPDATE = "order/ORDER_PAYMENT_UPDATE";

const ORDER_UPDATE_WARNING = "order/ORDER_UPDATE_WARNING";

const ORDER_UNSUBMIT = "order/ORDER_UNSUBMIT";

const ORDER_CLEAR_STATE = "order/ORDER_CLEAR_STATE";

// -- Actions --------------------------------------------------------------- //

export const orderLoadMenu = (businessName: string) => (
  dispatch: any,
  getState: any
) => {
  dispatch({ type: ORDER_LOAD_MENU_REQUEST });
  const businessData = getDemoBusinessData(businessName);

  if (businessData) {
    const paymentMethod =
      businessData.payment.methods.length === 1
        ? businessData.payment.methods[0]
        : null;
    const paymentAddress = businessData.payment.address || "";
    dispatch({
      type: ORDER_LOAD_MENU_SUCCESS,
      payload: { businessData, paymentMethod, paymentAddress }
    });
  } else {
    const error = new Error(`Menu doesn't exist for ${businessName}`);
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
  orderId: string
) => (dispatch: any, getState: any) => {
  const { paymentMethod } = getState().order;
  const { accounts, chainId } = payload.params[0];
  const account = accounts[0];

  if (chainId !== paymentMethod.chainId) {
    const chainData = getChainData(paymentMethod.chainId);
    dispatch(
      orderUpdateWarning({
        show: true,
        message: `Please switch your Wallet to ${chainData.name}`
      })
    );
  } else {
    dispatch(orderUpdateWarning({ show: false, message: "" }));
    dispatch(orderRequestPayment(account, orderId));
  }
};

export const orderShowPaymentMethods = () => ({
  type: ORDER_CHOOSE_PAYMENT_REQUEST
});

export const orderChoosePaymentMethod = (
  paymentMethod?: IPaymentMethod
) => async (dispatch: any) => {
  if (paymentMethod) {
    dispatch({ type: ORDER_CHOOSE_PAYMENT_SUCCESS, payload: paymentMethod });
    dispatch(orderSubmit());
  } else {
    dispatch({ type: ORDER_CHOOSE_PAYMENT_FAILURE });
  }
};

export const orderSubmit = () => async (dispatch: any, getState: any) => {
  const {
    // items,
    // checkout,
    paymentMethod
  } = getState().order;

  dispatch({ type: ORDER_SUBMIT_REQUEST });

  // const orderId = await createOrderJson({ items, checkout });
  const orderId = "test-order-id";

  if (paymentMethod.type === "walletconnect") {
    dispatch(orderSubmitWalletConnect(orderId));
  } else if (paymentMethod.type === "burner") {
    dispatch(orderSubmitBurnerWallet(orderId));
  } else {
    dispatch(orderUnsubmit());
  }
};

export const orderSubmitWalletConnect = (orderId: string) => async (
  dispatch: any,
  getState: any
) => {
  try {
    if (localStorage.getItem("walletconnect")) {
      localStorage.removeItem("walletconnect");
    }

    const connector = await initWalletConnect();

    dispatch({
      type: ORDER_SUBMIT_SUCCESS,
      payload: { uri: connector.uri, orderId }
    });

    connector.on("connect", async (error: Error, payload: IJsonRpcRequest) => {
      if (error) {
        throw error;
      }
      dispatch(orderManageSession(payload, orderId));
    });

    connector.on(
      "session_update",
      async (error: Error, payload: IJsonRpcRequest) => {
        if (error) {
          throw error;
        }
        dispatch(orderManageSession(payload, orderId));
      }
    );

    connector.on(
      "disconnect",
      async (error: Error, payload: IJsonRpcRequest) => {
        if (error) {
          throw error;
        }
        const { payment } = getState().order;
        if ((payment && payment.status === "failure") || !payment) {
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

export const orderSubmitBurnerWallet = (orderId: string) => async (
  dispatch: any,
  getState: any
) => {
  dispatch({ type: ORDER_SUBMIT_SUCCESS, payload: { uri: "", orderId } });
};

export const orderRequestPayment = (account: string, orderId: string) => async (
  dispatch: any,
  getState: any
) => {
  dispatch({ type: ORDER_PAYMENT_REQUEST });

  try {
    const {
      businessData,
      checkout,
      paymentMethod,
      paymentAddress
    } = getState().order;

    const from = account;
    const to = paymentAddress || account;
    const amount = checkout.nettotal;

    const tx = await formatTransaction(
      from,
      to,
      amount,
      businessData.payment.currency,
      paymentMethod.assetSymbol,
      paymentMethod.chainId
    );

    const txhash = await sendTransaction(tx);

    if (txhash) {
      const payment: IPayment = { status: "pending", result: txhash };

      // await updateOrderJson(orderId, { payment });

      await dispatch({ type: ORDER_PAYMENT_SUCCESS, payload: payment });

      killSession();

      dispatch(orderSubscribeToPayment());
    } else {
      const payment: IPayment = { status: "failure", result: null };

      // await updateOrderJson(orderId, { payment });

      dispatch({ type: ORDER_PAYMENT_FAILURE, payload: payment });
    }
  } catch (error) {
    const payment: IPayment = { status: "failure", result: null };

    // await updateOrderJson(orderId, { payment });

    console.error(error); // tslint:disable-line
    dispatch(notificationShow(error.message, true));
    dispatch({ type: ORDER_PAYMENT_FAILURE, payload: payment });
  }
};

let subscribeInterval: any;

export const orderSubscribeToPayment = () => (dispatch: any, getState: any) => {
  const { payment, paymentMethod } = getState().order;
  clearInterval(subscribeInterval);
  if (payment.status === "pending" && payment.result) {
    subscribeInterval = setInterval(async () => {
      const result = await apiGetTransactionReceipt(
        payment.result,
        paymentMethod.chainId
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
    profile: {
      id: "",
      name: "",
      logo: "",
      type: "",
      country: "",
      email: "",
      phone: ""
    },
    menu: null,
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
  },
  choosePayment: false,
  paymentAddress: "",
  paymentMethod: null,
  submitting: false,
  loading: false,
  submitted: false,
  items: [],
  uri: "",
  orderId: "",
  checkout: {
    rawtotal: 0,
    subtotal: 0,
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
      return {
        ...state,
        loading: false,
        businessData: action.payload.businessData,
        paymentMethod: action.payload.paymentMethod,
        paymentAddress: action.payload.paymentAddress
      };
    case ORDER_LOAD_MENU_FAILURE:
      return { ...state, loading: false };
    case ORDER_CHOOSE_PAYMENT_REQUEST:
      return { ...state, choosePayment: true };
    case ORDER_CHOOSE_PAYMENT_SUCCESS:
      return { ...state, choosePayment: false, paymentMethod: action.payload };
    case ORDER_CHOOSE_PAYMENT_FAILURE:
      return { ...state, choosePayment: false };
    case ORDER_SUBMIT_REQUEST:
      return { ...state, submitting: true, choosePayment: false };
    case ORDER_SUBMIT_SUCCESS:
      return {
        ...state,
        uri: action.payload.uri,
        orderId: action.payload.orderId,
        submitted: true,
        submitting: false
      };
    case ORDER_SUBMIT_FAILURE:
      return { ...state, submitting: false };
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
        orderId: INITIAL_STATE.orderId,
        paymentMethod: INITIAL_STATE.paymentMethod,
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
