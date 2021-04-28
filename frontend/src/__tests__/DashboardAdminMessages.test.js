import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Route, Link } from "react-router-dom";

import Dashboard_adminAllMsg from "../components/components_admin/Dashboard_adminAllMsg";
import "../setupTests";

import pantryDetail from "../__mocks__/pantryDetailMock";

const mockPantryDetail = pantryDetail.pantryDetail;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => jest.fn().mockReturnValue({ pantry_id: "1" }),
}));

describe("DashboardUserMessages tests", () => {
  const wrapper = mount(
    <MemoryRouter>
      <Dashboard_adminAllMsg />
    </MemoryRouter>
  );

  it("should display spinner", async () => {
    // expect(wrapper.find("Container#user-reservations")).toHaveLength(1);
    expect(wrapper.find("Container#admin-reservations-loading")).toHaveLength(
      1
    );
  });
});
