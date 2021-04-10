import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import OneClickReserveModal from "../components/modals/OneClickReserveModal";
import "../setupTests";
import store from "../store";
import pantryDetail from "../__mocks__/pantryDetailMock";

const mockPantryDetail = pantryDetail.pantryDetail;
const mockFoodItem = {
  food_id: 2,
  food_name: "Orange",
  qr_code: null,
  quantity: 16,
};

describe("OneClickReserveModal tests", () => {
  const mockUsername = "sean3";

  const wrapper = mount(
    <OneClickReserveModal
      show
      foodItem={mockFoodItem}
      onHide={() => {}}
      cartQuantity={1}
      pantry={mockPantryDetail}
      username="sean3"
    />
  );

  it("should have one Proceed button one close button", () => {
    // There should be one button in LoginView
    expect(wrapper.find("Button")).toHaveLength(1);
    expect(wrapper.find("CloseButton")).toHaveLength(1);
  });

  it("should call ReservationService when Proceed button is clicked", async () => {
    jest.mock("../services/reservation.service", () => ({
      ...jest.requireActual("../services/reservation.service"),
      makeReservation: (pantry_id, data) =>
        jest.fn().mockImplementation((pantry_id, data) => {
          return Promise.resolve(mockFoodItem);
        }),
    }));

    await wrapper.find("Button").simulate("click");
  });
});
