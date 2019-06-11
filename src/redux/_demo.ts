import { IData, IProfile, ISettings, IMenu } from "../helpers/types";
import { defaultProfile, defaultSettings } from "../helpers/business";

// -- Constants ------------------------------------------------------------- //

const DEMO_LOAD_DEMO = "demo/DEMO_LOAD_DEMO";

const DEMO_UPDATE_PROFILE = "demo/DEMO_UPDATE_PROFILE";

const DEMO_UPDATE_SETTINGS = "demo/DEMO_UPDATE_SETTINGS";

const DEMO_UPDATE_MENU = "demo/DEMO_UPDATE_MENU";

const DEMO_CLEAR_STATE = "demo/DEMO_CLEAR_STATE";

// -- Actions --------------------------------------------------------------- //

export const demoLoadDemo = (demo: { data: IData; menu: IMenu }) => ({
  type: DEMO_LOAD_DEMO,
  payload: {
    profile: demo.data.profile,
    settings: demo.data.settings,
    menu: demo.menu
  }
});

export const demoUpdateProfile = (profile: IProfile) => ({
  type: DEMO_UPDATE_PROFILE,
  payload: profile
});

export const demoUpdateSettings = (settings: ISettings) => ({
  type: DEMO_UPDATE_SETTINGS,
  payload: settings
});

export const demoUpdateMenu = (menu: IMenu) => ({
  type: DEMO_UPDATE_MENU,
  payload: menu
});

export const demoClearState = () => ({ type: DEMO_CLEAR_STATE });

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  menu: [],
  profile: defaultProfile,
  settings: defaultSettings
};

export default (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case DEMO_LOAD_DEMO:
      return {
        ...state,
        profile: action.payload.profile,
        settings: action.payload.settings,
        menu: action.payload.menu
      };
    case DEMO_UPDATE_PROFILE:
      return { ...state, profile: action.payload };
    case DEMO_UPDATE_SETTINGS:
      return { ...state, settings: action.payload };
    case DEMO_UPDATE_MENU:
      return { ...state, menu: action.payload };
    case DEMO_CLEAR_STATE:
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
};
