import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";

import DashboardView from "../components/DashboardView";
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

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => jest.fn().mockReturnValue({ pantry_id: 2 }),
}));
// PantryService.getDetail = jest.fn().mockImplementation((pantry_id) => {
//   return pantryDetail.pantryDetail;
// });

/**
 *  Temporarily disabled on 04/22/21 by Ilkyu -- See Pull request #160
 *
 */

describe("PantryDetailView tests", () => {
  it("should do nothing, this test is temporarily disabled", () => {
    expect(1).toEqual(1);
  });
  // const wrapper = mount(<DashboardView pantryDetail={mockPantryDetail} />);

  // it("should display menu title", () => {
  //   expect(wrapper.find("h3").text()).toEqual("Dashboard");
  // });

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

  // it("should display spinner on init", async () => {
  //   await act(async () => mount(<PantryDetailView />));
  //   expect(wrapper.find("h3")).toHaveLength(1);
  // });
});
