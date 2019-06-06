// -- Constants ------------------------------------------------------------- //
const MODAL_SHOW = "modal/MODAL_SHOW";
const MODAL_HIDE = "modal/MODAL_HIDE";
const MODAL_UPDATE_PROPS = "modal/MODAL_UPDATE_PROPS";

// -- Actions --------------------------------------------------------------- //

export const modalShow = (
  name: string,
  modalProps = {},
  disableToggle = false
) => ({
  type: MODAL_SHOW,
  payload: { name, modalProps, disableToggle }
});

export const modalUpdateProps = (modalProps = {}) => ({
  type: MODAL_UPDATE_PROPS,
  payload: modalProps
});

export const modalHide = () => ({ type: MODAL_HIDE });

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  show: false,
  name: "",
  modalProps: {},
  disableToggle: false
};

export default (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case MODAL_SHOW:
      return {
        ...state,
        show: true,
        name: action.payload.name,
        modalProps: action.payload.modalProps,
        disableToggle: action.payload.disableToggle
      };
    case MODAL_SHOW:
      return {
        ...state,
        modalProps: action.payload
      };
    case MODAL_HIDE:
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
};
