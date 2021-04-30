// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import foods from "./__mocks__/foodsMock";
import reservations from "./__mocks__/reservationsMock";
import pantryDetail from "./__mocks__/pantryDetailMock";
import pantries from "./__mocks__/pantriesMock";
import wishlist from "./__mocks__/wishlistMock";

const mockPantryDetail = pantryDetail.pantryDetail;
const mockPantries = pantries.pantries;
const mockFoods = foods.foods;
const mockWishlist = wishlist.wishlist;
const mockReservations = reservations;
const mockFoodItem = {
  food_id: 2,
  food_name: "Orange",
  qr_code: null,
  quantity: 16,
};

configure({ adapter: new Adapter() });

window.URL.createObjectURL = function () {};

jest.mock("./services/pantry.service", () => ({
  ...jest.requireActual("./services/pantry.service"),
  getDetail: (pantry_id) => {
    return Promise.resolve(mockPantryDetail);
  },
  getPantries: () => {
    return Promise.resolve(mockPantries);
  },
  setCancelled: (pantry_id, rsvn_id) => {
    return Promise.resolve({});
  },
}));

jest.mock("./services/food.service", () => ({
  ...jest.requireActual("./services/food.service"),
  getFoods: () => {
    return Promise.resolve(mockFoods);
  },
}));

jest.mock("./services/reservation.service", () => ({
  ...jest.requireActual("./services/reservation.service"),
  getUserReservations: (username) => {
    return Promise.resolve(mockReservations);
  },
  makeReservation: (pantry_id, data) => {
    return Promise.resolve(mockFoodItem);
  },
}));

jest.mock("./services/wishlist.service", () => ({
  ...jest.requireActual("./services/wishlist.service"),
  getUserWishlist: (username) => {
    return Promise.resolve(mockWishlist);
  },
}));
