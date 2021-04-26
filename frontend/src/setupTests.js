// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import foods from "./__mocks__/foodsMock";

const mockFoods = foods.foods;

configure({ adapter: new Adapter() });

window.URL.createObjectURL = function () {};

jest.mock("./services/food.service", () => ({
  ...jest.requireActual("./services/food.service"),
  getFoods: () => {
    return Promise.resolve(mockFoods);
  },
}));
