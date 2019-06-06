import { IBusinessType } from "../helpers/types";

interface IBusinessTypeRef {
  type: IBusinessType;
  display_name: string;
}

const BUSINESS_TYPES: IBusinessTypeRef[] = [
  {
    type: "cafe",
    display_name: "Café"
  },
  {
    type: "bar",
    display_name: "Bar"
  },
  {
    type: "fast_food",
    display_name: "Fast-Food"
  },
  {
    type: "bistro",
    display_name: "Bistro"
  },
  {
    type: "diner",
    display_name: "Diner"
  },
  {
    type: "buffet",
    display_name: "Buffer"
  },
  {
    type: "food_truck",
    display_name: "Food Truck / Stand"
  },
  {
    type: "casual_restaurant",
    display_name: "Casual Restaurant"
  },
  {
    type: "fine_dining",
    display_name: "Fine Dining"
  },
  {
    type: "popup_restaurant",
    display_name: "Pop Up Restaurant."
  }
];

export default BUSINESS_TYPES;
