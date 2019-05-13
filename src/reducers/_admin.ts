import Web3 from "web3";
import { init3Box } from "../helpers/box";
import { queryChainId } from "../helpers/utilities";

// -- Constants ------------------------------------------------------------- //
const ADMIN_CONNECT_REQUEST = "admin/ADMIN_CONNECT_REQUEST";
const ADMIN_CONNECT_SUCCESS = "admin/ADMIN_CONNECT_SUCCESS";
const ADMIN_CONNECT_FAILURE = "admin/ADMIN_CONNECT_FAILURE";

const ADMIN_CLEAR_STATE = "admin/ADMIN_CLEAR_STATE";

// -- Actions --------------------------------------------------------------- //

export const adminConnectWallet = (provider: any) => async (
  dispatch: any,
  getState: any
) => {
  dispatch({ type: ADMIN_CONNECT_REQUEST });
  try {
    const web3 = new Web3(provider);

    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];
    const chainId = await queryChainId(web3);
    const businessName = await init3Box(address, provider);

    if (businessName) {
      dispatch({
        type: ADMIN_CONNECT_SUCCESS,
        payload: { web3, address, chainId, businessName }
      });
      window.browserHistory.push("/admin");
    } else {
      dispatch({ type: ADMIN_CONNECT_FAILURE });
      window.browserHistory.push("/signup");
    }
  } catch (error) {
    console.error(error); // tslint:disable-line
    dispatch({ type: ADMIN_CONNECT_FAILURE });
  }
};

export const adminClearState = () => ({ type: ADMIN_CLEAR_STATE });

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  loading: false,
  web3: null,
  address: "",
  chainId: 1,
  businessName: ""
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
        businessName: action.payload.businessName
      };
    case ADMIN_CONNECT_FAILURE:
      return { ...state, loading: false };
    case ADMIN_CLEAR_STATE:
      return { ...state, web3: action.payload };
    case ADMIN_CLEAR_STATE:
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
};
