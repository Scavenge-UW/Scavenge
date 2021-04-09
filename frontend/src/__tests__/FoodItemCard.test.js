import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";

import FoodItemCard from "../components/FoodItemCard";
import "../setupTests";

describe("FoodItemCard tests", () => {
  const foodItem1 = {
    food_id: 4,
    food_name: "Swiss Cheese",
    qr_code: 10101011,
    quantity: 22,
  };

  const foodItem2 = {
    food_id: 2,
    food_name: "Orange",
    qr_code: null,
    quantity: 0,
  };

  const wrapper1 = shallow(<FoodItemCard foodItem={foodItem1} />);
  const wrapper2 = shallow(<FoodItemCard foodItem={foodItem2} />);

  it("should display food name", () => {
    expect(wrapper1.find("#food_name").text()).toEqual("Swiss Cheese");
    expect(wrapper2.find("#food_name").text()).toEqual("Orange");
  });

  it("should display correct stock info text", () => {
    expect(wrapper1.find("#current-stock").text()).toEqual("In Stock");
    expect(wrapper2.find("#current-stock").text()).toEqual("Out of Stock");
  });

  it("should display correct color depending on the stock", () => {
    expect(wrapper1.find("VscCircleFilled").prop("color")).toEqual("green");
    expect(wrapper2.find("VscCircleFilled").prop("color")).toEqual("red");
  });

  it("should have four buttons", () => {
    expect(wrapper1.find("Button")).toHaveLength(4);
    expect(wrapper2.find("Button")).toHaveLength(4);
  });

  // it("should display correct initial quantity", () => {
  //   expect(wrapper1.find("input").text()).toEqual("22");
  // });
});
