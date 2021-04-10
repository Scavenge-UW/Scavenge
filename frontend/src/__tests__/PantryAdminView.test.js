import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount } from "enzyme";

import PantryAdminView from "../components/PantryAdminView";
import "../setupTests";
import pantryDetail from "../__mocks__/pantryDetailMock";

const mockPantryDetail = pantryDetail.pantryDetail;

describe("PantryAdminView tests", () => {
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

  const wrapper1 = mount(<PantryAdminView />);

  it("should have <PantryAdminViewTabs />", () => {
    expect(wrapper1.find("PantryAdminViewTabs")).toHaveLength(1);
  });

  // const wrapper2 = mount(<PantryAdminView />);
  // it("should display two tabs", () => {
  //   expect(wrapper2.find("Tab")).toHaveLength(2);
  // });
});
