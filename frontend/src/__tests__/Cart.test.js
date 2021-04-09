import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import CartView from "../components/CartVIew";
import "../setupTests";
import store from "../store";

describe("Cart tests", () => {
  const mockUsername = "sean3";

  const wrapper = mount(
    <Provider store={store}>
      <CartView username={mockUsername} />
    </Provider>
  );

  it("should have one button when cart is empty", () => {
    // There should be one button in LoginView
    expect(wrapper.find("Button")).toHaveLength(1);
  });
});
