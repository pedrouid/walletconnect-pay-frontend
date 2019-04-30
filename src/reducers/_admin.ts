// import { apiAuthAdmin } from "../helpers/api";

// -- Constants ------------------------------------------------------------- //
const ADMIN_AUTHENTICATE_REQUEST = "admin/ADMIN_AUTHENTICATE_REQUEST";
const ADMIN_AUTHENTICATE_SUCCESS = "admin/ADMIN_AUTHENTICATE_SUCCESS";
const ADMIN_AUTHENTICATE_FAILURE = "admin/ADMIN_AUTHENTICATE_FAILURE";

const ADMIN_CLEAR_STATE = "admin/ADMIN_CLEAR_STATE";

// -- Actions --------------------------------------------------------------- //

async function apiAuthAdmin(credentials: any) {
  return true;
}

export const adminAuthenticate = (credentials: any) => async (
  dispatch: any
) => {
  dispatch({ type: ADMIN_AUTHENTICATE_REQUEST });
  try {
    const result = await apiAuthAdmin(credentials);
    console.log(result); // tslint:disable-line
    dispatch({ type: ADMIN_AUTHENTICATE_SUCCESS });
  } catch (error) {
    console.error(error); // tslint:disable-line
    dispatch({ type: ADMIN_AUTHENTICATE_FAILURE });
  }
};

export const adminClearState = () => ({ type: ADMIN_CLEAR_STATE });

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  loading: false
};

export default (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case ADMIN_AUTHENTICATE_REQUEST:
      return { ...state, loading: true };
    case ADMIN_AUTHENTICATE_SUCCESS:
      return { ...state, loading: false };
    case ADMIN_AUTHENTICATE_FAILURE:
      return { ...state, loading: false };
    case ADMIN_CLEAR_STATE:
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
};
