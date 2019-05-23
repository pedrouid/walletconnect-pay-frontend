import profileModel from "./profile";
import orderModel from "./order";
import menuModel from "./menu";

const spaceModel = {
  profile: {
    key: "profile",
    type: "object",
    model: profileModel
  },
  orders: {
    key: "orders",
    type: "array",
    model: orderModel
  },
  menu: {
    key: "menu",
    type: "array",
    model: menuModel
  }
};

export default spaceModel;
