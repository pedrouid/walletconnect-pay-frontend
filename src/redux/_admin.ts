import Web3 from "web3";
import { queryChainId } from "../helpers/utilities";
import {
  openBusinessBox,
  setBusinessData,
  defaultBusinessData
} from "../helpers/business";
import { modalShow, modalHide } from "./_modal";
import { notificationShow } from "./_notification";
import { ADMIN_AUTHENTICATION_MODAL } from "../constants/modals";

// -- Constants ------------------------------------------------------------- //
const ADMIN_CONNECT_REQUEST = "admin/ADMIN_CONNECT_REQUEST";
const ADMIN_CONNECT_SUCCESS = "admin/ADMIN_CONNECT_SUCCESS";
const ADMIN_CONNECT_FAILURE = "admin/ADMIN_CONNECT_FAILURE";

const ADMIN_SUBMIT_SIGNUP_REQUEST = "admin/ADMIN_SUBMIT_SIGNUP_REQUEST";
const ADMIN_SUBMIT_SIGNUP_SUCCESS = "admin/ADMIN_SUBMIT_SIGNUP_SUCCESS";
const ADMIN_SUBMIT_SIGNUP_FAILURE = "admin/ADMIN_SUBMIT_SIGNUP_FAILURE";

const ADMIN_UPDATE_BUSINESS_PROFILE = "admin/ADMIN_UPDATE_BUSINESS_PROFILE";

const ADMIN_UPDATE_BUSINESS_DATA = "admin/ADMIN_UPDATE_BUSINESS_DATA";

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

export const adminConnectWallet = (provider: any) => async (dispatch: any) => {
  dispatch({ type: ADMIN_CONNECT_REQUEST });
  try {
    const web3 = new Web3(provider);

    const address = (await web3.eth.getAccounts())[0];
    const chainId = await queryChainId(web3);
    const businessData = await openBusinessBox(address, provider);

    if (businessData) {
      dispatch({
        type: ADMIN_CONNECT_SUCCESS,
        payload: { web3, address, chainId, businessData }
      });
      if (window.browserHistory.location.pathname === "/") {
        window.browserHistory.push("/admin");
      }
    } else {
      dispatch({
        type: ADMIN_CONNECT_FAILURE,
        payload: { web3, address, chainId }
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
    const businessData = await setBusinessData({ profile: businessProfile });

    // await apiSendEmailVerification(businessProfile.email)

    dispatch({ type: ADMIN_SUBMIT_SIGNUP_SUCCESS, payload: businessData });

    window.browserHistory.push("/admin");
  } catch (error) {
    console.error(error); // tslint:disable-line
    dispatch(notificationShow(error.message, true));
    dispatch({ type: ADMIN_SUBMIT_SIGNUP_FAILURE });
  }
};

export const adminUpdateBusinessProfile = (
  updatedBusinessProfile: any
) => async (dispatch: any, getState: any) => {
  let { businessProfile } = getState().admin;
  businessProfile = {
    ...businessProfile,
    ...updatedBusinessProfile
  };
  dispatch({ type: ADMIN_UPDATE_BUSINESS_PROFILE, payload: businessProfile });
};

export const adminUpdateBusinessData = (businessData: any) => ({
  type: ADMIN_UPDATE_BUSINESS_DATA,
  payload: businessData
});

export const adminUpdateBusinessMenu = (businessMenu: any) => ({
  type: ADMIN_UPDATE_BUSINESS_MENU,
  payload: businessMenu
});

export const adminClearState = () => ({ type: ADMIN_CLEAR_STATE });

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  loading: false,
  web3: null,
  address: "",
  chainId: 1,
  businessData: defaultBusinessData,
  businessMenu: null,
  businessProfile: {
    id: "",
    name: "",
    logo: "",
    type: "cafe",
    country: "DE",
    email: "",
    phone: ""
  }
};

export default (state = INITIAL_STATE, action: any) => {
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
        businessData: action.payload.businessData
      };
    case ADMIN_CONNECT_FAILURE:
      return {
        ...state,
        loading: false,
        web3: action.payload.web3 || INITIAL_STATE.web3,
        address: action.payload.address || INITIAL_STATE.address,
        chainId: action.payload.chainId || INITIAL_STATE.chainId
      };
    case ADMIN_SUBMIT_SIGNUP_REQUEST:
      return { ...state, loading: true };
    case ADMIN_SUBMIT_SIGNUP_SUCCESS:
      return { ...state, loading: false, businessData: action.payload };
    case ADMIN_SUBMIT_SIGNUP_FAILURE:
      return { ...state, loading: false };
    case ADMIN_UPDATE_BUSINESS_PROFILE:
      return { ...state, businessProfile: action.payload };
    case ADMIN_UPDATE_BUSINESS_DATA:
      return { ...state, businessData: action.payload };
    case ADMIN_UPDATE_BUSINESS_MENU:
      return { ...state, businessMenu: action.payload };

    case ADMIN_CLEAR_STATE:
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
};
