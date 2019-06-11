import {
  IBusinessData,
  IBusinessProfile,
  IBusinessTax,
  IBusinessPayment,
  IBusinessMenu
} from "../helpers/types";
import {
  defaultBusinessProfile,
  defaultBusinessTax,
  defaultBusinessPayment
} from "../helpers/business";

// -- Constants ------------------------------------------------------------- //

const DEMO_LOAD_DEMO = "demo/DEMO_LOAD_DEMO";

const DEMO_UPDATE_BUSINESS_PROFILE = "demo/DEMO_UPDATE_BUSINESS_PROFILE";

const DEMO_UPDATE_BUSINESS_TAX = "demo/DEMO_UPDATE_BUSINESS_TAX";

const DEMO_UPDATE_BUSINESS_PAYMENT = "demo/DEMO_UPDATE_BUSINESS_PAYMENT";

const DEMO_UPDATE_BUSINESS_MENU = "demo/DEMO_UPDATE_BUSINESS_MENU";

const DEMO_CLEAR_STATE = "demo/DEMO_CLEAR_STATE";

// -- Actions --------------------------------------------------------------- //

export const demoLoadDemo = (demo: {
  data: IBusinessData;
  menu: IBusinessMenu;
}) => ({
  type: DEMO_LOAD_DEMO,
  payload: {
    profile: demo.data.profile,
    tax: demo.data.tax,
    payment: demo.data.payment,
    menu: demo.menu
  }
});

export const demoUpdateBusinessProfile = (
  businessProfile: IBusinessProfile
) => ({
  type: DEMO_UPDATE_BUSINESS_PROFILE,
  payload: businessProfile
});

export const demoUpdateBusinessTax = (businessTax: IBusinessTax) => ({
  type: DEMO_UPDATE_BUSINESS_TAX,
  payload: businessTax
});

export const demoUpdateBusinessPayment = (
  businessPayment: IBusinessPayment
) => ({
  type: DEMO_UPDATE_BUSINESS_PAYMENT,
  payload: businessPayment
});

export const demoUpdateBusinessMenu = (businessMenu: IBusinessMenu) => ({
  type: DEMO_UPDATE_BUSINESS_MENU,
  payload: businessMenu
});

export const demoClearState = () => ({ type: DEMO_CLEAR_STATE });

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  businessMenu: [],
  businessProfile: defaultBusinessProfile,
  businessTax: defaultBusinessTax,
  businessPayment: defaultBusinessPayment
};

export default (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case DEMO_LOAD_DEMO:
      return {
        ...state,
        businessProfile: action.payload.profile,
        businessTax: action.payload.tax,
        businessPayment: action.payload.payment,
        businessMenu: action.payload.menu
      };
    case DEMO_UPDATE_BUSINESS_PROFILE:
      return { ...state, businessProfile: action.payload };
    case DEMO_UPDATE_BUSINESS_TAX:
      return { ...state, businessTax: action.payload };
    case DEMO_UPDATE_BUSINESS_PAYMENT:
      return { ...state, businessPayment: action.payload };
    case DEMO_UPDATE_BUSINESS_MENU:
      return { ...state, businessMenu: action.payload };
    case DEMO_CLEAR_STATE:
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
};
