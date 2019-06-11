import Web3 from "web3";
import { queryChainId, formatItemId, sanitizeUrl } from "../helpers/utilities";
import {
  IBusinessProfile,
  IBusinessTax,
  IBusinessPayment,
  IMenuItem
} from "../helpers/types";
import {
  openBusinessBox,
  setBusinessData,
  setBusinessMenu,
  defaultBusinessProfile,
  defaultBusinessTax,
  defaultBusinessPayment
} from "../helpers/business";
import { isNaN } from "../helpers/bignumber";
import { modalShow, modalHide } from "./_modal";
import { notificationShow } from "./_notification";
import {
  ADMIN_AUTHENTICATION_MODAL,
  INVENTORY_ITEM
} from "../constants/modals";
import { logRedux } from "../helpers/dev";

// -- Constants ------------------------------------------------------------- //
const ADMIN_CONNECT_REQUEST = "admin/ADMIN_CONNECT_REQUEST";
const ADMIN_CONNECT_SUCCESS = "admin/ADMIN_CONNECT_SUCCESS";
const ADMIN_CONNECT_FAILURE = "admin/ADMIN_CONNECT_FAILURE";

const ADMIN_SUBMIT_SIGNUP_REQUEST = "admin/ADMIN_SUBMIT_SIGNUP_REQUEST";
const ADMIN_SUBMIT_SIGNUP_SUCCESS = "admin/ADMIN_SUBMIT_SIGNUP_SUCCESS";
const ADMIN_SUBMIT_SIGNUP_FAILURE = "admin/ADMIN_SUBMIT_SIGNUP_FAILURE";

const ADMIN_SAVE_BUSINESS_DATA_REQUEST =
  "admin/ADMIN_SAVE_BUSINESS_DATA_REQUEST";
const ADMIN_SAVE_BUSINESS_DATA_SUCCESS =
  "admin/ADMIN_SAVE_BUSINESS_DATA_SUCCESS";
const ADMIN_SAVE_BUSINESS_DATA_FAILURE =
  "admin/ADMIN_SAVE_BUSINESS_DATA_FAILURE";

const ADMIN_UPDATE_BUSINESS_PROFILE = "admin/ADMIN_UPDATE_BUSINESS_PROFILE";

const ADMIN_UPDATE_BUSINESS_TAX = "admin/ADMIN_UPDATE_BUSINESS_TAX";

const ADMIN_UPDATE_BUSINESS_PAYMENT = "admin/ADMIN_UPDATE_BUSINESS_PAYMENT";

const ADMIN_UPDATE_BUSINESS_MENU = "admin/ADMIN_UPDATE_BUSINESS_MENU";

const ADMIN_CLEAR_STATE = "admin/ADMIN_CLEAR_STATE";

// -- Actions --------------------------------------------------------------- //

export const adminRequestAuthentication = () => async (dispatch: any) =>
  dispatch(
    modalShow(
      ADMIN_AUTHENTICATION_MODAL,
      {
        onConnect: (provider: any) => {
          if (provider) {
            dispatch(modalHide());
            dispatch(adminConnectWallet(provider));
          }
        }
      },
      true
    )
  );

export const adminConnectWallet = (provider: any) => async (
  dispatch: any,
  getState: any
) => {
  dispatch({ type: ADMIN_CONNECT_REQUEST });
  try {
    const web3 = new Web3(provider);

    const address = (await web3.eth.getAccounts())[0];
    const chainId = await queryChainId(web3);
    const { data, menu } = await openBusinessBox(address, provider);

    if (data) {
      const { profile, tax, payment } = data;
      dispatch({
        type: ADMIN_CONNECT_SUCCESS,
        payload: {
          web3,
          address,
          chainId,
          profile,
          tax,
          payment,
          menu
        }
      });
      const pathname = sanitizeUrl(window.browserHistory.location.pathname);
      if (["/", "/signup"].includes(pathname)) {
        window.browserHistory.push("/admin");
      }
    } else {
      const {
        businessMenu,
        businessProfile,
        businessTax,
        businessPayment
      } = getState().admin;
      dispatch({
        type: ADMIN_CONNECT_SUCCESS,
        payload: {
          web3,
          address,
          chainId,
          profile: businessProfile,
          tax: businessTax,
          payment: businessPayment,
          menu: businessMenu
        }
      });
      window.browserHistory.push("/signup");
    }
  } catch (error) {
    console.error(error); // tslint:disable-line
    dispatch(notificationShow(error.message, true));
    dispatch({ type: ADMIN_CONNECT_FAILURE });
  }
};

export const adminSubmitSignUp = () => async (dispatch: any, getState: any) => {
  dispatch({ type: ADMIN_SUBMIT_SIGNUP_REQUEST });
  try {
    const { businessProfile } = getState().admin;
    const { profile, tax, payment } = await setBusinessData({
      profile: businessProfile
    });

    // await apiSendEmailVerification(businessProfile.email)

    dispatch({
      type: ADMIN_SUBMIT_SIGNUP_SUCCESS,
      payload: { profile, tax, payment }
    });

    window.browserHistory.push("/admin");
  } catch (error) {
    console.error(error); // tslint:disable-line
    dispatch(notificationShow(error.message, true));
    dispatch({ type: ADMIN_SUBMIT_SIGNUP_FAILURE });
  }
};

export const adminSaveBusinessData = () => async (
  dispatch: any,
  getState: any
) => {
  const {
    address,
    businessProfile,
    businessTax,
    businessPayment
  } = getState().admin;
  if (!address) {
    return;
  }
  dispatch({ type: ADMIN_SAVE_BUSINESS_DATA_REQUEST });
  try {
    const { profile, tax, payment } = await setBusinessData({
      profile: businessProfile,
      tax: businessTax,
      payment: businessPayment
    });

    dispatch({
      type: ADMIN_SAVE_BUSINESS_DATA_SUCCESS,
      payload: { profile, tax, payment }
    });
  } catch (error) {
    console.error(error); // tslint:disable-line
    dispatch(notificationShow(error.message, true));
    dispatch({ type: ADMIN_SAVE_BUSINESS_DATA_FAILURE });
  }
};

export const adminSaveBusinessMenu = () => async (
  dispatch: any,
  getState: any
) => {
  const { address, businessMenu } = getState().admin;
  if (!address) {
    return;
  }
  await setBusinessMenu(businessMenu);
};

export const adminUpdateBusinessProfile = (
  updatedBusinessProfile: Partial<IBusinessProfile>
) => async (dispatch: any, getState: any) => {
  let { businessProfile } = getState().admin;
  businessProfile = {
    ...businessProfile,
    ...updatedBusinessProfile
  };
  businessProfile.id = formatItemId(businessProfile.name);
  dispatch({ type: ADMIN_UPDATE_BUSINESS_PROFILE, payload: businessProfile });
};

export const adminUpdateBusinessTax = (
  updatedBusinessTax: Partial<IBusinessTax>
) => async (dispatch: any, getState: any) => {
  if (updatedBusinessTax.rate && isNaN(updatedBusinessTax.rate)) {
    return;
  }
  let { businessTax } = getState().admin;
  businessTax = {
    ...businessTax,
    ...updatedBusinessTax
  };
  dispatch({ type: ADMIN_UPDATE_BUSINESS_TAX, payload: businessTax });
};

export const adminUpdateBusinessPayment = (
  updatedBusinessPayment: Partial<IBusinessPayment>
) => async (dispatch: any, getState: any) => {
  let { businessPayment } = getState().admin;
  businessPayment = {
    ...businessPayment,
    ...updatedBusinessPayment
  };
  dispatch({ type: ADMIN_UPDATE_BUSINESS_PAYMENT, payload: businessPayment });
};

export const adminShowInventoryModal = (menuItem?: IMenuItem) => async (
  dispatch: any
) =>
  dispatch(
    modalShow(INVENTORY_ITEM, {
      menuItem,
      onAddItem: (menuItem: IMenuItem) => {
        if (menuItem) {
          dispatch(modalHide());
          dispatch(adminAddMenuItem(menuItem));
        }
      }
    })
  );

export const adminAddMenuItem = (menuItem: IMenuItem) => async (
  dispatch: any,
  getState: any
) => {
  let { businessMenu } = getState().admin;
  const matches = businessMenu.filter(
    (item: IMenuItem) => item.id === menuItem.id
  );
  if (matches && matches.length) {
    menuItem = {
      ...matches[0],
      ...menuItem
    };
    businessMenu = businessMenu.filter(
      (item: IMenuItem) => item.id !== menuItem.id
    );
  }
  businessMenu = [...businessMenu, menuItem];
  dispatch({ type: ADMIN_UPDATE_BUSINESS_MENU, payload: businessMenu });
  dispatch(adminSaveBusinessMenu());
};

export const adminRemoveMenuItem = (menuItem: IMenuItem) => async (
  dispatch: any,
  getState: any
) => {
  let { businessMenu } = getState().admin;
  businessMenu = businessMenu.filter(
    (item: IMenuItem) => item.id !== menuItem.id
  );
  dispatch({ type: ADMIN_UPDATE_BUSINESS_MENU, payload: businessMenu });
  dispatch(adminSaveBusinessMenu());
};

export const adminClearState = () => ({ type: ADMIN_CLEAR_STATE });

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  loading: false,
  web3: null,
  address: "",
  chainId: 1,
  businessMenu: [],
  businessProfile: defaultBusinessProfile,
  businessTax: defaultBusinessTax,
  businessPayment: defaultBusinessPayment
};

export default (state = INITIAL_STATE, action: any) => {
  // TODO: DELETE THIS
  logRedux(action);
  switch (action.type) {
    case ADMIN_CONNECT_REQUEST:
      return { ...state, loading: true };
    case ADMIN_CONNECT_SUCCESS:
      return {
        ...state,
        loading: false,
        web3: action.payload.web3,
        address: action.payload.address,
        chainId: action.payload.chainId,
        businessMenu: action.payload.menu || [],
        businessProfile: action.payload.profile || defaultBusinessProfile,
        businessTax: action.payload.tax || defaultBusinessTax,
        businessPayment: action.payload.payment || defaultBusinessPayment
      };
    case ADMIN_CONNECT_FAILURE:
      return { ...state, loading: false };
    case ADMIN_SUBMIT_SIGNUP_REQUEST:
      return { ...state, loading: true };
    case ADMIN_SUBMIT_SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        businessProfile: action.payload.profile,
        businessTax: action.payload.tax,
        businessPayment: action.payload.payment
      };
    case ADMIN_SUBMIT_SIGNUP_FAILURE:
      return { ...state, loading: false };
    case ADMIN_SAVE_BUSINESS_DATA_SUCCESS:
      return {
        ...state,
        businessProfile: action.payload.profile,
        businessTax: action.payload.tax,
        businessPayment: action.payload.payment
      };

    case ADMIN_UPDATE_BUSINESS_PROFILE:
      return { ...state, businessProfile: action.payload };
    case ADMIN_UPDATE_BUSINESS_TAX:
      return { ...state, businessTax: action.payload };
    case ADMIN_UPDATE_BUSINESS_PAYMENT:
      return { ...state, businessPayment: action.payload };
    case ADMIN_UPDATE_BUSINESS_MENU:
      return { ...state, businessMenu: action.payload };
    case ADMIN_CLEAR_STATE:
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
};
