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
  useParams: () => jest.fn().mockReturnValue({ pantry_id: "1" }),
}));

const mockIsAdmin = () => {
  return true; // is admin
};

describe("DashboardUserMessages for admin - tests", () => {
  const wrapper = mount(
    <MemoryRouter>
      <MessageCenter isAdmin={mockIsAdmin} />
    </MemoryRouter>
  );

  it("should display spinner", async () => {
    // expect(wrapper.find("Container#user-reservations")).toHaveLength(1);
    expect(wrapper.find("Container#all-reservations-loading")).toHaveLength(1);
  });
});
