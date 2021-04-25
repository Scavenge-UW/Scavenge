import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import FoodSearchView from "../components/components_shared/FoodSearchView";
import "../setupTests";
import store from "../store";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => jest.fn().mockReturnValue({ query: "" }),
}));

describe("FoodSearchView tests", () => {
  const wrapper = mount(
    <Provider store={store}>
      <FoodSearchView />
    </Provider>
  );

  it("should have display No results on init", () => {
    // There should be one button in LoginView
    expect(wrapper.find("h6").text()).toEqual("No results");
  });

  it("should have display one search button", () => {
    // There should be one button in LoginView
    expect(wrapper.find("Button")).toHaveLength(1);
  });

  it("should have display one form", () => {
    // There should be one button in LoginView
    expect(wrapper.find("Form")).toHaveLength(1);
  });
});
