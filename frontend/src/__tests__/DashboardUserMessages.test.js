import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Route, Link } from "react-router-dom";

import MessageCenter from "../components/components_shared/MessageCenter";
import "../setupTests";

import pantryDetail from "../__mocks__/pantryDetailMock";

const mockPantryDetail = pantryDetail.pantryDetail;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => jest.fn().mockReturnValue({ username: "ilkyu" }),
}));

const mockIsAdmin = () => {
  return false; // not admin
};

describe("Message Center for user - tests", () => {
  const wrapper = mount(
    <MemoryRouter>
      <MessageCenter isAdmin={mockIsAdmin} />
    </MemoryRouter>
  );

  it("should display menu title", () => {
    // expect(wrapper.find("Container#user-reservations")).toHaveLength(1);
    expect(wrapper.find("Container#all-reservations-loading")).toHaveLength(1);
  });

  // it("should display <DashboardDescriptionCard />", () => {
  //   expect(wrapper.find("DashboardDescriptionCard")).toHaveLength(1);
  // });

  // it("should have editMode for DashboardDescriptionCard disabled on init", () => {
  //   const ddc = wrapper.find("DashboardDescriptionCard");
  //   expect(ddc.state("editMode")).toEqual(false);
  // });

  // it("should display seven <DashboardOpenHourCard />s", () => {
  //   expect(wrapper.find("DashboardOpenHourCard")).toHaveLength(7);
  // });
});
