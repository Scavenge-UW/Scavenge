import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";

import App from "../App";
import "../setupTests";

import pantryDetail from "../__mocks__/pantryDetailMock";
import pantries from "../__mocks__/pantriesMock";

const mockPantryDetail = pantryDetail.pantryDetail;
const mockPantries = pantries.pantries;

jest.mock("../services/pantry.service", () => ({
  ...jest.requireActual("../services/pantry.service"),
  getDetail: (pantry_id) =>
    jest.fn().mockImplementation((pantry_id) => {
      return Promise.resolve(mockPantryDetail).then((response) => response);
    }),
  getPantries: () => {
    return Promise.resolve(mockPantries);
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => jest.fn().mockReturnValue({ pantry_id: 2 }),
}));

jest.mock("../components/Map", () => {
  const MapMock = () => <div />;
  return MapMock;
});

describe("App tests", () => {
  const wrapper = mount(<App />);

  it("should display a ListView", () => {
    expect(wrapper.find("ListView")).toHaveLength(1);
  });
  it("should display a Navigation", () => {
    expect(wrapper.find("Navigation")).toHaveLength(1);
  });
  it("should display a Map", () => {
    expect(wrapper.find("MapMock")).toHaveLength(1);
  });
});
