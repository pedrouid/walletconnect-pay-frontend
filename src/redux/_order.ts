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
  createOrderJson,
  updateOrderJson,
  formatCheckoutDetails,
  defaultCheckoutDetails
} from "../helpers/order";
import { getDemoBusiness } from "../helpers/business";
import { notificationShow } from "./_notification";
import { modalShow, modalHide } from "./_modal";
import { apiGetTransactionReceipt } from "../helpers/api";
import { convertHexToNumber } from "../helpers/bignumber";
import { getChainData } from "../helpers/utilities";
import {
  PAYMENT_METHODS_MODAL,
  PLAIN_MESSAGE_MODAL
} from "../constants/modals";
import {
  WALLETCONNECT_LOCALSTORAGE,
  SESSION_UPDATE_EVENT,
  CONNECT_EVENT,
  DISCONNECT_EVENT
} from "../constants/walletConnect";
import {
  PAYMENT_SUCCESS,
  PAYMENT_PENDING,
  PAYMENT_FAILURE
} from "../constants/paymentStatus";
import {
  adminUpdateBusinessProfile,
  adminUpdateBusinessTax,
  adminUpdateBusinessPayment,
  adminUpdateBusinessMenu
} from "./_admin";

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

const ORDER_UPDATE_PAYMENT_METHOD = "order/ORDER_UPDATE_PAYMENT_METHOD";

const ORDER_PAYMENT_UPDATE = "order/ORDER_PAYMENT_UPDATE";

const ORDER_UNSUBMIT = "order/ORDER_UNSUBMIT";

const ORDER_CLEAR_STATE = "order/ORDER_CLEAR_STATE";

// -- Actions --------------------------------------------------------------- //

export const orderLoadDemo = (businessName: string) => (
  dispatch: any,
  getState: any
) => {
  dispatch({ type: ORDER_LOAD_MENU_REQUEST });

  const demo = getDemoBusiness(businessName);

  if (demo) {
    const { data, menu } = demo;

    const { profile, tax, payment } = data;

    const paymentMethod =
      payment.methods.length === 1 ? payment.methods[0] : null;

    const paymentAddress = payment.address || "";

    dispatch(adminUpdateBusinessProfile(profile));
    dispatch(adminUpdateBusinessTax(tax));
    dispatch(adminUpdateBusinessPayment(payment));
    dispatch(adminUpdateBusinessMenu(menu));

    dispatch({
      type: ORDER_LOAD_MENU_SUCCESS,
      payload: {
        demo: true,
        paymentMethod,
        paymentAddress
      }
    });
  } else {
    const error = new Error(`Menu doesn't exist for ${businessName}`);
    dispatch(notificationShow(error.message, true));
    dispatch({ type: ORDER_LOAD_MENU_FAILURE });
  }
};

export const orderLoadMenu = () => (dispatch: any, getState: any) => {
  const { businessPayment, businessMenu } = getState().admin;

  dispatch({ type: ORDER_LOAD_MENU_REQUEST });

  const paymentMethod =
    businessPayment.methods.length === 1 ? businessPayment.methods[0] : null;

  const paymentAddress = businessPayment.address || "";

  dispatch(adminUpdateBusinessMenu(businessMenu));

  dispatch({
    type: ORDER_LOAD_MENU_SUCCESS,
    payload: {
      demo: false,
      paymentMethod,
      paymentAddress
    }
  });
};

export const orderAddItem = (item: IMenuItem) => (
  dispatch: any,
  getState: any
) => {
  const { businessTax } = getState().admin;
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
    payload: {
      items,
      checkout: formatCheckoutDetails(rawtotal, businessTax)
    }
  });
};

export const orderRemoveItem = (item: IMenuItem) => (
  dispatch: any,
  getState: any
) => {
  const { businessTax } = getState().admin;
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
    payload: {
      items,
      checkout: formatCheckoutDetails(rawtotal, businessTax)
    }
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

export const orderShowPaymentMethods = () => (dispatch: any, getState: any) => {
  const { businessPayment } = getState().admin;
  const callback = (paymentMethod?: IPaymentMethod) =>
    dispatch(orderChoosePaymentMethod(paymentMethod));
  dispatch(modalShow(PAYMENT_METHODS_MODAL, { businessPayment, callback }));
};

export const orderChoosePaymentMethod = (
  paymentMethod?: IPaymentMethod
) => async (dispatch: any) => {
  if (paymentMethod) {
    dispatch({ type: ORDER_UPDATE_PAYMENT_METHOD, payload: paymentMethod });
    dispatch(modalHide());
    dispatch(orderSubmit());
  } else {
    dispatch(modalHide());
  }
};

export const orderSubmit = () => async (dispatch: any, getState: any) => {
  const { demo, items, checkout, paymentMethod } = getState().order;

  dispatch({ type: ORDER_SUBMIT_REQUEST });

  let orderId = "";

  if (demo) {
    orderId = "demo-orderId";
  } else {
    orderId = await createOrderJson({ items, checkout });
  }

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
    if (localStorage.getItem(WALLETCONNECT_LOCALSTORAGE)) {
      localStorage.removeItem(WALLETCONNECT_LOCALSTORAGE);
    }

    const connector = await initWalletConnect();

    dispatch({
      type: ORDER_SUBMIT_SUCCESS,
      payload: { uri: connector.uri, orderId }
    });

    connector.on(
      CONNECT_EVENT,
      async (error: Error, payload: IJsonRpcRequest) => {
        if (error) {
          throw error;
        }
        dispatch(orderManageSession(payload, orderId));
      }
    );

    connector.on(
      SESSION_UPDATE_EVENT,
      async (error: Error, payload: IJsonRpcRequest) => {
        if (error) {
          throw error;
        }
        dispatch(orderManageSession(payload, orderId));
      }
    );

    connector.on(
      DISCONNECT_EVENT,
      async (error: Error, payload: IJsonRpcRequest) => {
        if (error) {
          throw error;
        }
        const { payment } = getState().order;
        if ((payment && payment.status === PAYMENT_FAILURE) || !payment) {
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
  const { demo } = getState().order;

  dispatch({ type: ORDER_PAYMENT_REQUEST });

  try {
    const { businessPayment } = getState().admin;

    const { checkout, paymentMethod, paymentAddress } = getState().order;

    const from = account;
    const to = paymentAddress || account;
    const amount = checkout.nettotal;

    const tx = await formatTransaction(
      from,
      to,
      amount,
      businessPayment.currency,
      paymentMethod.assetSymbol,
      paymentMethod.chainId
    );

    const txhash = await sendTransaction(tx);

    if (txhash) {
      const payment: IPayment = { status: PAYMENT_PENDING, result: txhash };

      if (!demo) {
        await updateOrderJson(orderId, { payment });
      }

      await dispatch({ type: ORDER_PAYMENT_SUCCESS, payload: payment });

      killSession();

      dispatch(orderSubscribeToPayment());
    } else {
      const payment: IPayment = { status: PAYMENT_FAILURE, result: null };

      if (!demo) {
        await updateOrderJson(orderId, { payment });
      }

      dispatch({ type: ORDER_PAYMENT_FAILURE, payload: payment });
    }
  } catch (error) {
    const payment: IPayment = { status: PAYMENT_FAILURE, result: null };

    if (!demo) {
      await updateOrderJson(orderId, { payment });
    }

    console.error(error); // tslint:disable-line
    dispatch(notificationShow(error.message, true));
    dispatch({ type: ORDER_PAYMENT_FAILURE, payload: payment });
  }
};

let subscribeInterval: any;

export const orderSubscribeToPayment = () => (dispatch: any, getState: any) => {
  const { payment, paymentMethod } = getState().order;
  clearInterval(subscribeInterval);
  if (payment.status === PAYMENT_PENDING && payment.result) {
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
    updatedPayment = { ...payment, status: PAYMENT_SUCCESS };
  } else {
    updatedPayment = { ...payment, status: PAYMENT_FAILURE };
  }
  dispatch({ type: ORDER_PAYMENT_UPDATE, payload: updatedPayment });
};

export const orderUpdateWarning = (warning: {
  show: boolean;
  message: string;
}) => (dispatch: any, getState: any) => {
  if (warning.show) {
    dispatch(
      modalShow(PLAIN_MESSAGE_MODAL, { message: warning.message }, true)
    );
  } else {
    dispatch(modalHide());
  }
};

export const orderUnsubmit = () => (dispatch: any, getState: any) => {
  const { payment, items } = getState().order;
  let updatedItems = [...items];
  if (payment) {
    if (payment.status === PAYMENT_PENDING) {
      dispatch(notificationShow("Payment is still pending", true));
      return;
    } else if (payment.status === PAYMENT_SUCCESS) {
      updatedItems = [];
    }
  }
  dispatch(modalHide());
  killSession();
  dispatch({ type: ORDER_UNSUBMIT, payload: updatedItems });
};

export const orderClearState = () => ({ type: ORDER_CLEAR_STATE });

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  demo: false,
  paymentAddress: "",
  paymentMethod: null,
  submitting: false,
  loading: false,
  submitted: false,
  items: [],
  uri: "",
  orderId: "",
  checkout: defaultCheckoutDetails,
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
      return {
        ...state,
        loading: false,
        demo: action.payload.demo,
        paymentMethod: action.payload.paymentMethod,
        paymentAddress: action.payload.paymentAddress
      };
    case ORDER_LOAD_MENU_FAILURE:
      return { ...state, loading: false };

    case ORDER_UPDATE_PAYMENT_METHOD:
      return { ...state, paymentMethod: action.payload };

    case ORDER_SUBMIT_REQUEST:
      return { ...state, submitting: true };
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
        items: action.payload
      };
    case ORDER_CLEAR_STATE:
      return { ...state, ...INITIAL_STATE };

    default:
      return state;
  }
};
