import { IMenuItem, IBusinessData } from "../../helpers/types";

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

const menu: IMenuItem[] = [
  {
    name: "Club Mate",
    description: "",
    image: club_mate,
    price: 2.3
  },
  {
    name: "Flora Power (Mate)",
    description: "",
    image: flora,
    price: 2.3
  },
  {
    name: "Premium Cola",
    description: "",
    image: premium,
    price: 2.3
  },
  {
    name: "Spezi",
    description: "",
    image: spezi,
    price: 2.3
  },
  {
    name: "rhubarb",
    description: "",
    image: rhubarb,
    price: 2.3
  },
  {
    name: "Selters classic",
    description: "",
    image: selters_classic,
    price: 2.0
  },
  {
    name: "Selters naturell",
    description: "",
    image: selters_naturell,
    price: 2.0
  },
  {
    name: "KraftMalz",
    description: "",
    image: kraftmalz,
    price: 2.3
  },
  {
    name: "OBC strong",
    description: "",
    image: obc_strong,
    price: 3.0
  },
  {
    name: "Berliner Pilsner",
    description: "",
    image: berliner,
    price: 3.0
  },
  {
    name: "720 (light lager)",
    description: "",
    image: laschak,
    price: 3.0
  }
];

const businessData: IBusinessData = {
  id: "c-base",
  name: "C-Base",
  logo,
  menu,
  taxRate: 20,
  taxInc: true,
  currencySymbol: "EUR"
};

export default businessData;
