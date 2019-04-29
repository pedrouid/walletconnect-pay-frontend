import { IMenuItem, IOrderItem } from "../helpers/types";
import {
  initWalletConnect,
  getAccount,
  sendTransaction,
  killSession
} from "../helpers/walletconnect";
import {
  convertAmountToRawNumber,
  convertStringToHex
} from "../helpers/bignumber";
import {
  apiGetAccountNonce,
  apiGetGasLimit,
  apiGetGasPrices
} from "../helpers/api";
import {
  getDataString,
  removeHexPrefix,
  sanitizeHex
} from "../helpers/utilities";
import { keccak256 } from "../helpers/eth";
import { setSpacePrivate, getSpacePrivate } from "src/helpers/box";

// -- Constants ------------------------------------------------------------- //

const ORDER_UPDATE_ITEMS = "order/ORDER_UPDATE_ITEMS";

const ORDER_SUBMIT_REQUEST = "order/ORDER_SUBMIT_REQUEST";
const ORDER_SUBMIT_SUCCESS = "order/ORDER_SUBMIT_SUCCESS";
const ORDER_SUBMIT_FAILURE = "order/ORDER_SUBMIT_FAILURE";

const ORDER_UNSUBMIT = "order/ORDER_UNSUBMIT";

const ORDER_CLEAR_STATE = "order/ORDER_CLEAR_STATE";

// -- Actions --------------------------------------------------------------- //

const TAX_RATE = 0.11;

const DAI_TOKEN = {
  symbol: "DAI",
  name: "DAI Stablecoin v1.0",
  decimals: 18,
  contractAddress: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359"
};

const PAYMENT_ADDRESS = "0x9b7b2B4f7a391b6F14A81221AE0920A9735B67Fb";

export const orderAddItem = (item: IMenuItem) => (
  dispatch: any,
  getState: any
) => {
  let { items, subtotal } = getState().order;

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

  dispatch({ type: ORDER_UPDATE_ITEMS, payload: { items, subtotal } });
};

export const orderRemoveItem = (item: IMenuItem) => (
  dispatch: any,
  getState: any
) => {
  let { items, subtotal } = getState().order;

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

  dispatch({ type: ORDER_UPDATE_ITEMS, payload: { items, subtotal } });
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
    const uri = await initWalletConnect();

    await setSpacePrivate(orderHash, JSON.stringify(orderJson));

    dispatch({ type: ORDER_SUBMIT_SUCCESS, payload: uri });

    const account = await getAccount();

    dispatch(orderRequestPayment(account, orderHash));
  } catch (error) {
    console.error(error); // tslint:disable-line
    dispatch({ type: ORDER_SUBMIT_FAILURE });
  }
};

export const orderRequestPayment = (
  account: string,
  orderHash: string
) => async (dispatch: any, getState: any) => {
  const { nettotal } = getState().order;
  const nonce = await apiGetAccountNonce(account);
  const gasPrices = await apiGetGasPrices();
  const gasPrice = convertAmountToRawNumber(gasPrices.average.price, 9);
  const amount = convertAmountToRawNumber(nettotal, DAI_TOKEN.decimals);
  const data = getDataString("0xa9059cbb", [
    removeHexPrefix(PAYMENT_ADDRESS),
    removeHexPrefix(convertStringToHex(amount))
  ]);
  const gasLimit = await apiGetGasLimit(DAI_TOKEN.contractAddress, data);
  const tx = {
    from: sanitizeHex(account),
    to: sanitizeHex(DAI_TOKEN.contractAddress),
    nonce: sanitizeHex(convertStringToHex(nonce)),
    gasLimit: sanitizeHex(gasLimit),
    gasPrice: sanitizeHex(convertStringToHex(gasPrice)),
    value: "0x00",
    data: sanitizeHex(data)
  };
  const txhash = await sendTransaction(tx);

  const order = await getSpacePrivate(orderHash);

  const orderJson = JSON.parse(order);

  orderJson.receipt = txhash;

  await setSpacePrivate(orderHash, JSON.stringify(orderJson));
};

export const orderUnsubmit = () => (dispatch: any) => {
  killSession();
  dispatch({ type: ORDER_UNSUBMIT });
};

export const orderClearState = () => ({ type: ORDER_CLEAR_STATE });

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  loading: false,
  submitted: false,
  items: [],
  uri: "",
  subtotal: 0,
  tax: 0,
  nettotal: 0
};

export default (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case ORDER_UPDATE_ITEMS:
      return {
        ...state,
        items: action.payload.items,
        subtotal: action.payload.subtotal,
        tax: action.payload.subtotal * TAX_RATE,
        nettotal: action.payload.subtotal * (1 + TAX_RATE)
      };
    case ORDER_SUBMIT_REQUEST:
      return { ...state, loading: true };
    case ORDER_SUBMIT_SUCCESS:
      return { ...state, uri: action.payload, submitted: true, loading: false };
    case ORDER_SUBMIT_FAILURE:
      return { ...state, loading: false };
    case ORDER_UNSUBMIT:
      return { ...state, uri: "", submitted: false };

    case ORDER_CLEAR_STATE:
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
};
