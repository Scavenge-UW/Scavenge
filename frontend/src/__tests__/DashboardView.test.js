import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Route, Link } from "react-router-dom";

import DashboardView from "../components/components_shared/DashboardView";
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

describe("PantryDetailView tests", () => {
  const wrapper = mount(
    <MemoryRouter>
      <DashboardView pantryDetail={mockPantryDetail} employeeOf={[1]} />
    </MemoryRouter>
  );

  it("should display menu title", () => {
    expect(wrapper.find("h2")).toHaveLength(1);
  });

  it("should display <DashboardDescriptionCard />", () => {
    expect(wrapper.find("DashboardDescriptionCard")).toHaveLength(1);
  });

  it("should have editMode for DashboardDescriptionCard disabled on init", () => {
    const ddc = wrapper.find("DashboardDescriptionCard");
    expect(ddc.state("editMode")).toEqual(false);
  });

  it("should display seven <DashboardOpenHourCard />s", () => {
    expect(wrapper.find("DashboardOpenHourCard")).toHaveLength(7);
  });
});
