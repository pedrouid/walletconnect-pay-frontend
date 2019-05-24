interface IBusinessTypeRef {
  type: string;
  display_type: string;
}

const BUSINESS_TYPES: IBusinessTypeRef[] = [
  {
    type: "cafe",
    display_type: "Café"
  },
  {
    type: "bar",
    display_type: "Bar"
  },
  {
    type: "fast_food",
    display_type: "Fast-Food"
  },
  {
    type: "bistro",
    display_type: "Bistro"
  },
  {
    type: "diner",
    display_type: "Diner"
  },
  {
    type: "buffet",
    display_type: "Buffer"
  },
  {
    type: "food_truck",
    display_type: "Food Truck / Stand"
  },
  {
    type: "casual_restaurant",
    display_type: "Casual Restaurant"
  },
  {
    type: "fine_dining",
    display_type: "Fine Dining"
  },
  {
    type: "popup_restaurant",
    display_type: "Pop Up Restaurant."
  }
];

export default BUSINESS_TYPES;
