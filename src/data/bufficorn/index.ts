import { IMenuItem, IBusinessData } from "../../helpers/types";

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

const menu: IMenuItem[] = [
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

const businessData: IBusinessData = {
  id: "bufficorn",
  name: "Bufficorn Cafe",
  logo,
  menu,
  taxRate: 11,
  taxInc: true,
  taxDisplay: true,
  currencySymbol: "USD",
  paymentAddress: ""
};

export default businessData;
