import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { mount } from "enzyme";

import InventoryView from "../components/InventoryView";
import "../setupTests";

const { pantryDetail } = require("../__mocks__/pantryDetailMock");

describe("InventoryView tests", () => {
  const wrapper = mount(<InventoryView pantryDetail={pantryDetail} />);
  wrapper.instance().addItem = jest.fn();
  wrapper.update();

  it("should display title", () => {
    expect(wrapper.find("h2").text()).toEqual("Current Inventory");
  });

  it("should display inventory overview", () => {
    expect(wrapper.find("p#inventory-overview").text()).toEqual(
      "There are 0 items in total in your food pantry.0 items are currently out of stock."
    );
  });

  it("should correctly initialize states", () => {
    const emptyItem = {
      name: "",
      quantity: 1,
      food_id: "",
    };

    expect(wrapper.state("foods")).toEqual([]);
    expect(wrapper.state("addItemModalShow")).toEqual(false);
    expect(wrapper.state("itemToBeAdded")).toEqual(emptyItem);
  });

  it("should update inventory overview when state is updated", async () => {
    await wrapper.setState({
      foods: [
        {
          food_id: 2,
          food_name: "Orange",
          qr_code: null,
          quantity: 16,
        },
        {
          food_id: 3,
          food_name: "Avocado",
          qr_code: 123123123,
          quantity: 0,
        },
      ],
    });

    expect(wrapper.find("p#inventory-overview").text()).toEqual(
      "There are 2 items in total in your food pantry.1 items are currently out of stock."
    );
  });

  it("should update foods state correctly", async () => {
    await wrapper.instance().componentDidMount();
    expect(wrapper.state("foods")).toHaveLength(2);
  });

  it("should have one Add Item button", () => {
    expect(wrapper.find("Button#btn-add-item")).toHaveLength(1);
  });

  it("should open a modal when Add Item button is clicked", async () => {
    await wrapper.find("Button#btn-add-item").simulate("click");
    expect(wrapper.state("addItemModalShow")).toEqual(true);
  });

  it("should correctly initialize form in Add Item Modal", async () => {
    expect(wrapper.find("input#item-name").prop("value")).toEqual("");
    expect(wrapper.find("input#item-quantity").prop("value")).toEqual(1);
  });

  it("should close the modal when close button is clicked", async () => {
    await wrapper.find("CloseButton").simulate("click");
    expect(wrapper.state("addItemModalShow")).toEqual(false);
  });

  it("should update input when name and quantity is entered in Add Item Modal", async () => {
    await wrapper.find("Button#btn-add-item").simulate("click"); // open the modal
    await wrapper
      .find("input#item-name")
      .simulate("change", { target: { value: "Avocado" } });
    await wrapper
      .find("input#item-quantity")
      .simulate("change", { target: { value: 111 } });

    expect(wrapper.find("input#item-name").prop("value")).toEqual("Avocado");
    expect(wrapper.find("input#item-quantity").prop("value")).toEqual(111);
  });

  it("should update itemToBeAdded state correctly", async () => {
    await wrapper.find("Button#btn-modal-add-item").simulate("click");
    wrapper.instance().setItemToBeAdded({
      food_name: "Avocado",
      quantity: 111,
    });
    expect(wrapper.state("itemToBeAdded")).toEqual({
      food_name: "Avocado",
      quantity: 111,
    });
  });

  it("should remove item from inventory correctly", async () => {
    expect(wrapper.state("foods")).toHaveLength(2);
    await wrapper.instance().removeItem(2);
    expect(wrapper.state("foods")).toHaveLength(1);
  });

  it("should update item quantity in inventory correctly", async () => {
    expect(
      wrapper.state("foods").find((e) => {
        return e.food_id === 3;
      }).quantity
    ).toEqual(0);
    await wrapper.instance().updateItemQuantity(3, 5);
    expect(
      wrapper.state("foods").find((e) => {
        return e.food_id === 3;
      }).quantity
    ).toEqual(5);
  });
});