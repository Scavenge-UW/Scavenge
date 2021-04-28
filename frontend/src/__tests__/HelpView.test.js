import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import HelpView from "../components/components_shared/HelpView";
import "../setupTests";

describe("HelpView tests", () => {
  // empty cart
  const wrapper1 = shallow(<HelpView />);

  it("should have one button when cart is empty", () => {
    // There should be one button in LoginView
    expect(wrapper1.find("h1")).toHaveLength(1);
    expect(wrapper1.find("h1").text()).toEqual("Help Page");
  });
});
