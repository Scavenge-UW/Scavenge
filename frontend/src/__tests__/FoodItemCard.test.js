import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount } from "enzyme";

import FoodItemCard from "../components/components_shared/FoodItemCard";
import "../setupTests";
import pantryDetail from "../__mocks__/pantryDetailMock";

const mockPantryDetail = pantryDetail.pantryDetail;

jest.mock("../services/pantry.service", () => ({
  ...jest.requireActual("../services/pantry.service"),
  getDetail: (pantry_id) =>
    jest.fn().mockImplementation((pantry_id) => {
      return Promise.resolve(mockPantryDetail).then((response) => response);
    }),
}));

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

  it("should display food name", async () => {
    await wrapper1.update();
    await wrapper2.update();
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

  it("should have correct number of buttons", () => {
    expect(wrapper1.find("Button")).toHaveLength(4); // in stock (increment, decrement, reserve, add to cart)
    expect(wrapper2.find("Button")).toHaveLength(3); // out of stock (increment, decrement, add to wishlist)
  });

  // Cart Mode
  const wrapper3 = mount(
    <FoodItemCard cartMode pantry={mockPantryDetail} foodItem={foodItem1} />
  );

  it("should have three buttons in Cart mode", async () => {
    await wrapper3.update();
    expect(wrapper3.find("Button")).toHaveLength(3);
  });

  it("should have increment and decrement buttons in Cart mode", () => {
    expect(wrapper3.find("Button.increment-cart-item")).toHaveLength(1);
    expect(wrapper3.find("Button.decrement-cart-item")).toHaveLength(1);
  });

  it("should increment cart quantity correctly in cart mode", async () => {
    wrapper3.instance().cartQuantity = {
      current: {
        value: 22,
      },
    };

    await wrapper3.find("Button.increment-cart-item").simulate("click");
    expect(wrapper3.state("cartQuantity")).toEqual(23);
  });

  it("should decrement cart quantity correctly in cart mode", async () => {
    wrapper3.instance().cartQuantity = {
      current: {
        value: 4,
      },
    };
    await wrapper3.find("Button.decrement-cart-item").simulate("click");
    expect(wrapper3.state("cartQuantity")).toEqual(3);
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
      pantry={mockPantryDetail}
    />
  );

  it("should show a modal when user clicks on One Click Reserve", async () => {
    await wrapper4.update();
    await wrapper4.find("Button#btn-one-click-reserve").simulate("click");
    expect(wrapper4.state("showOneClickReserveModal")).toEqual(true);
  });

  it("should increment cart quantity correctly in PantryDetail mode", async () => {
    wrapper4.instance().cartQuantity = {
      current: {
        value: 22,
      },
    };

    await wrapper4.find("Button.increment-cart-item").simulate("click");
    expect(wrapper4.state("cartQuantity")).toEqual(23);
  });

  it("should decrement cart quantity correctly in PantryDetail mode", async () => {
    wrapper4.instance().cartQuantity = {
      current: {
        value: 4,
      },
    };
    await wrapper4.find("Button.decrement-cart-item").simulate("click");
    expect(wrapper4.state("cartQuantity")).toEqual(3);
  });

  it("should add item to cart", async () => {
    // 1. not logged in
    wrapper4.setProps({
      isLoggedIn() {
        return false;
      },
    });
    await wrapper4.update();
    await wrapper4.find("Button#btn-add-to-cart").simulate("click");

    // 2. logged in, but admin
    wrapper4.setProps({
      isLoggedIn() {
        return true;
      },
      isAdmin() {
        return false;
      },
    });
    await wrapper4.update();
    await wrapper4.find("Button#btn-add-to-cart").simulate("click");

    // 3 logged in as user
    wrapper4.setProps({
      isLoggedIn() {
        return true;
      },
      isAdmin() {
        return false;
      },
    });
    await wrapper4.update();
    await wrapper4.find("Button#btn-add-to-cart").simulate("click");
  });

  // Admin Inventory Mode
  const wrapper5 = mount(<FoodItemCard adminMode foodItem={foodItem1} />);

  it("should correctly switch between editMode and non-editMode", async () => {
    await wrapper5.update();
    await wrapper5.find("Button#btn-edit-quantity").simulate("click");
    expect(wrapper5.state("editMode")).toEqual(true);

    await wrapper5.find("Button#btn-cancel-edit-quantity").simulate("click");
    expect(wrapper5.state("editMode")).toEqual(false);

    wrapper5.instance().onChangeItemQuantity(100);
    expect(wrapper5.state("newQuantity")).toEqual(100);
  });

  // it("should correctly remove an item from inventory", async () => {
  //   jest.spyOn(window, 'alert').mockImplementation(() => {return true});
  //   await wrapper5.find("Button#btn-remove-item").simulate("click");
  //   expect(wrapper5.state("editMode")).toEqual(true);
  // });

  // Wishlist Mode
  const wrapper6 = mount(
    <FoodItemCard
      foodItem={foodItem1}
      isLoggedIn={() => {
        return true;
      }}
      isAdmin={() => {
        return false;
      }}
      wishlistMode
      pantry={mockPantryDetail}
    />
  );

  it("should show a modal when user clicks on One Click Reserve", async () => {
    await wrapper6.update();
    expect(wrapper6.find("Button").text()).toEqual("Remove from Wishlist");
  });
});
