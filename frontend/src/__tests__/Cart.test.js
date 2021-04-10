import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CartView from "../components/CartView";
import "../setupTests";
import cartStore from "../__mocks__/cartStoreMock";

const mockCartStore = cartStore.cartStore;
const mockStore = configureStore({});

jest.mock("../services/reservation.service", () => ({
  makeReservation: () => Promise.resolve({ lol: "jajaja" }),
}));

describe("Cart tests", () => {
  const mockUsername = "sean3";
  const emptyStore = mockStore({ cart: [] });
  const store = mockStore(mockCartStore);

  // empty cart
  const wrapper1 = mount(
    <Provider store={emptyStore}>
      <CartView username={mockUsername} />
    </Provider>
  );

  it("should have one button when cart is empty", () => {
    // There should be one button in LoginView
    expect(wrapper1.find("Button")).toHaveLength(1);
  });

  // non-empty cart with two items
  const wrapper2 = mount(
    <Provider store={store}>
      <CartView username={mockUsername} />
    </Provider>
  );

  it("should have nine buttons when there are two items in cart", async () => {
    // There should be one button in LoginView
    await wrapper2.find("Button#btn-checkout").simulate("click");
  });
});
