import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount } from "enzyme";

import FoodItemCard from "../components/FoodItemCard";
import "../setupTests";
import pantryDetail from "../__mocks__/pantryDetailMock";

const mockPantryDetail = pantryDetail.pantryDetail;

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

  // Cart Mode
  const wrapper3 = mount(
    <FoodItemCard cartMode pantry={mockPantryDetail} foodItem={foodItem1} />
  );

  it("should have four buttons in Cart mode", () => {
    expect(wrapper3.find("Button")).toHaveLength(4);
  });

  it("should have increment and decrement buttons in Cart mode", () => {
    expect(wrapper3.find("Button.increment-cart-item")).toHaveLength(1);
    expect(wrapper3.find("Button.decrement-cart-item")).toHaveLength(1);

    wrapper3.instance().cartQuantity = {
      current: {
        value: 22,
      },
    };

    wrapper3.find("Button.increment-cart-item").simulate("click");
    expect(wrapper3.instance().cartQuantity.current.value).toEqual(23);

    wrapper3.find("Button.decrement-cart-item").simulate("click");
    expect(wrapper3.instance().cartQuantity.current.value).toEqual(22);
  });

  // FOodItemCard in DetailView
  const wrapper4 = mount(
    <FoodItemCard
      foodItem={foodItem1}
      isLoggedIn={() => {
        return true;
      }}
      isAdmin={() => {
        return false;
      }}
    />
  );

  it("should show a modal when user clicks on One Click Reserve", async () => {
    await wrapper4.find("Button#btn-one-click-reserve").simulate("click");
    expect(wrapper4.state("showOneClickReserveModal")).toEqual(true);
  });

  // Admin Inventory Mode
  const wrapper5 = mount(<FoodItemCard adminMode foodItem={foodItem1} />);

  it("should correctly switch between editMode and non-editMode", async () => {
    await wrapper5.find("Button#btn-edit-quantity").simulate("click");
    expect(wrapper5.state("editMode")).toEqual(true);

    await wrapper5.find("Button#btn-cancel-edit-quantity").simulate("click");
    expect(wrapper5.state("editMode")).toEqual(false);
  });

  // it("should correctly remove an item from inventory", async () => {
  //   jest.spyOn(window, 'alert').mockImplementation(() => {return true});
  //   await wrapper5.find("Button#btn-remove-item").simulate("click");
  //   expect(wrapper5.state("editMode")).toEqual(true);
  // });
});
