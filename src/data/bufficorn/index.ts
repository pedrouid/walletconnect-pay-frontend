import {
  IBusinessMenu,
  IBusinessData,
  IPaymentMethod,
  IBusinessProfile,
  IBusinessTax,
  IBusinessPayment
} from "../../helpers/types";

import logo from "./logo.png";

import espresso from "./images/espresso.jpg";
import doubleEspresso from "./images/double-espresso.jpg";
import americano from "./images/americano.jpg";
import latte from "./images/latte.jpg";
import cappuccino from "./images/cappuccino.jpg";
import tea from "./images/tea.jpg";
import blueberryMuffin from "./images/blueberry-muffin.jpg";
import chocolateMuffin from "./images/chocolate-muffin.jpg";
import scone from "./images/scone.jpg";
import croissant from "./images/croissant.jpg";
import almondCroissant from "./images/almond-croissant.jpg";

const menu: IBusinessMenu = [
  {
    name: "Espresso",
    description: "Small cup with 1 shot",
    price: 2.5,
    image: espresso
  },
  {
    name: "Double Espresso",
    description: "Small cup with 2 shots",
    price: 3.0,
    image: doubleEspresso
  },
  {
    name: "Americano",
    description: "Large cup with 1 shot and hot water",
    price: 3.0,
    image: americano
  },
  {
    name: "Latte",
    description: "Large cup with 1 shot and milk",
    price: 3.5,
    image: latte
  },
  {
    name: "Cappuccino",
    description: "Large cup with 1 shot and foam",
    price: 3.5,
    image: cappuccino
  },
  {
    name: "Tea",
    description: "Large cup with loose leaf tea",
    price: 2.5,
    image: tea
  },
  {
    name: "Blueberry Muffin",
    description: "Muffin with blueberries",
    price: 2.5,
    image: blueberryMuffin
  },
  {
    name: "Chocolate Muffin",
    description: "Muffin with chocolate chips",
    price: 2.5,
    image: chocolateMuffin
  },
  {
    name: "Scone",
    description: "Plain scope with jam",
    price: 2.5,
    image: scone
  },
  {
    name: "Croissant",
    description: "Plain croissant",
    price: 2.5,
    image: croissant
  },
  {
    name: "Almond Croissant",
    description: "Croissant with almond filling",
    price: 2.5,
    image: almondCroissant
  }
];

const methods: IPaymentMethod[] = [
  {
    type: "burner",
    chainId: 100,
    assetSymbol: "xDAI"
  },
  {
    type: "walletconnect",
    chainId: 1,
    assetSymbol: "ETH"
  },
  {
    type: "walletconnect",
    chainId: 1,
    assetSymbol: "DAI"
  },
  {
    type: "walletconnect",
    chainId: 100,
    assetSymbol: "xDAI"
  }
];

const profile: IBusinessProfile = {
  id: "bufficorn",
  name: "Bufficorn Cafe",
  logo,
  type: "cafe",
  country: "DE",
  email: "",
  phone: ""
};

const tax: IBusinessTax = {
  rate: 11,
  included: false,
  display: true
};

const payment: IBusinessPayment = {
  methods,
  currency: "USD",
  address: ""
};

const data: IBusinessData = {
  profile,
  tax,
  payment
};

export default { data, menu };
