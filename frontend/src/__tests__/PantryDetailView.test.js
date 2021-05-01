import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";

import PantryDetailView from "../components/components_shared/PantryDetailView";
import "../setupTests";

import pantryDetail from "../__mocks__/pantryDetailMock";

const mockPantryDetail = pantryDetail.pantryDetail;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => jest.fn().mockReturnValue({ pantry_id: 2 }),
}));
// PantryService.getDetail = jest.fn().mockImplementation((pantry_id) => {
//   return pantryDetail.pantryDetail;
// });

describe("PantryDetailView tests", () => {
  const wrapper = mount(<PantryDetailView />);

  it("should display spinner on init", () => {
    expect(wrapper.find("MySpinner")).toHaveLength(1);
  });

  // it("should display spinner on init", async () => {
  //   await act(async () => mount(<PantryDetailView />));
  //   expect(wrapper.find("h3")).toHaveLength(1);
  // });
});
