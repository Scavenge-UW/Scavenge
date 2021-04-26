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

const mockPantryDetail = pantryDetail.pantryDetail;
const mockPantries = pantries.pantries;
const mockFoods = foods.foods;
const mockReservations = reservations.reservations;
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
  getDetail: (pantry_id) =>
    jest.fn().mockImplementation((pantry_id) => {
      return Promise.resolve(mockPantryDetail).then((response) => response);
    }),
  getPantries: () => {
    return Promise.resolve(mockPantries);
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
