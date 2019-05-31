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

const orderCheckoutModel = {
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

const orderPaymentModel = {
  status: {
    key: "status",
    type: "string",
    model: null
  },
  result: {
    key: "result",
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
  timestamp: {
    key: "timestamp",
    type: "number",
    model: null
  },
  items: {
    key: "items",
    type: "array",
    model: orderItemModel
  },
  checkout: {
    key: "checkout",
    type: "object",
    model: orderCheckoutModel
  },
  payment: {
    key: "payment",
    type: "object",
    model: orderPaymentModel
  }
};

export default orderModel;
