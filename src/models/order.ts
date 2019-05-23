const orderItemModel = {
  name: {
    key: "name",
    type: "string",
    model: null
  },
  subtotal: {
    key: "subtotal",
    type: "string",
    model: null
  },
  quantity: {
    key: "quantity",
    type: "string",
    model: null
  },
  total: {
    key: "total",
    type: "string",
    model: null
  }
};

const orderModel = {
  id: {
    key: "id",
    type: "string",
    model: null
  },
  items: {
    key: "items",
    type: "array",
    model: orderItemModel
  },
  subtotal: {
    key: "subtotal",
    type: "string",
    model: null
  },
  total: {
    key: "price",
    type: "string",
    model: null
  }
};

export default orderModel;
