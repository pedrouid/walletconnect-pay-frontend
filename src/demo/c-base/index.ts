import { IMenu, IData, IProfile, ISettings } from "../../helpers/types";

import logo from "./logo.png";

import club_mate from "./images/club_mate.jpg";
import flora from "./images/flora.jpg";
import premium from "./images/premium.jpg";
import spezi from "./images/spezi.jpg";
import rhubarb from "./images/rhubarb.jpg";
import selters_classic from "./images/selters_classic.jpg";
import selters_naturell from "./images/selters_naturell.jpg";
import kraftmalz from "./images/kraftmalz.jpg";
import obc_strong from "./images/obc_strong.jpg";
import berliner from "./images/berliner.jpg";
import laschak from "./images/laschak.jpg";
import PAYMENT_METHODS from "../../constants/paymentMethods";

const menu: IMenu = [
  {
    id: "club-mate",
    name: "Club Mate",
    description: "",
    image: club_mate,
    price: 2.3
  },
  {
    id: "flora-power-mate",
    name: "Flora Power (Mate)",
    description: "",
    image: flora,
    price: 2.3
  },
  {
    id: "premium-cola",
    name: "Premium Cola",
    description: "",
    image: premium,
    price: 2.3
  },
  {
    id: "spezi",
    name: "Spezi",
    description: "",
    image: spezi,
    price: 2.3
  },
  {
    id: "rhubarb",
    name: "Rhubarb",
    description: "",
    image: rhubarb,
    price: 2.3
  },
  {
    id: "selters-classic",
    name: "Selters classic",
    description: "",
    image: selters_classic,
    price: 2.0
  },
  {
    id: "selters-naturell",
    name: "Selters Naturell",
    description: "",
    image: selters_naturell,
    price: 2.0
  },
  {
    id: "kraftmalz",
    name: "KraftMalz",
    description: "",
    image: kraftmalz,
    price: 2.3
  },
  {
    id: "obc-strong",
    name: "OBC strong",
    description: "",
    image: obc_strong,
    price: 3.0
  },
  {
    id: "berliner-pilsner",
    name: "Berliner Pilsner",
    description: "",
    image: berliner,
    price: 3.0
  },
  {
    id: "720-light-lager",
    name: "720 (light lager)",
    description: "",
    image: laschak,
    price: 3.0
  }
];

const profile: IProfile = {
  id: "c-base",
  name: "C-Base",
  description: "",
  logo,
  type: "bar",
  country: "DE",
  email: "",
  phone: ""
};

const settings: ISettings = {
  taxRate: 19,
  taxIncluded: true,
  taxDisplay: false,
  paymentMethods: PAYMENT_METHODS,
  paymentCurrency: "EUR",
  paymentAddress: ""
};

const data: IData = {
  profile,
  settings
};

export default { data, menu };
