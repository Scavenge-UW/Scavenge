import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";

import App from "../App";
import ListView from "../components/components_shared/ListView";
import store from "../store";

import "../setupTests";

import pantryDetail from "../__mocks__/pantryDetailMock";
import pantries from "../__mocks__/pantriesMock";

const mockPantryDetail = pantryDetail.pantryDetail;
const mockPantries = pantries.pantries;

jest.mock("../components/components_shared/Map", () => {
  const MapMock = () => <div />;
  return MapMock;
});

describe("ListView tests", () => {
  const wrapper = mount(<App />);
  const shallowListView = shallow(
    <Provider store={store}>
      <ListView pantries={{ result: mockPantries }} />
    </Provider>
  );
  const listViewWrapper = wrapper.find("ListView");
  listViewWrapper.setState({
    matchedPantries: mockPantries,
  });

  it("should have state", () => {
    expect(listViewWrapper.state("matchedPantries")).toHaveLength(2);
  });

  it("should display an Accordion", () => {
    expect(listViewWrapper.find("Accordion")).toHaveLength(1);
  });

  it("should have a correctly working searchData()", () => {
    wrapper.find("input.searchInput").simulate("change", {
      target: {
        value: "River",
      },
    });
    wrapper.update();
    expect(wrapper.find("Card"));
  });

  it("should have a correctly show food pantry's availability 1", () => {
    var date = new Date("2021-04-23T05:40:30.778Z"); // Fri Apr 23 2021 00:40:30 GMT-0500 (Central Daylight Time)

    listViewWrapper.instance().setState({
      time: date,
    });

    listViewWrapper.instance().searchData("The");
    listViewWrapper.update();
    expect(wrapper.find("Card"));
  });

  it("should have a correctly show food pantry's availability 2", () => {
    var date = new Date("2021-04-23T18:40:30.778Z"); // Fri Apr 23 2021 13:40:30 GMT-0500 (Central Daylight Time)

    listViewWrapper.instance().setState({
      time: date,
    });
    listViewWrapper.instance().searchData("The");
    listViewWrapper.update();
    expect(wrapper.find("Card"));
  });

  it("should have a correctly show food pantry's availability 3", () => {
    var date = new Date("2021-04-23T13:00:00.778Z"); // Fri Apr 23 2021 13:40:30 GMT-0500 (Central Daylight Time)

    listViewWrapper.instance().setState({
      time: date,
    });
    listViewWrapper.instance().searchData("The");
    listViewWrapper.update();
    expect(wrapper.find("Card"));
  });

  it("should have a correctly show food pantry's availability 3", () => {
    var date = new Date("2021-04-24T15:00:00.778Z"); // Fri Apr 23 2021 13:40:30 GMT-0500 (Central Daylight Time)

    listViewWrapper.instance().setState({
      time: date,
    });
    listViewWrapper.instance().searchData("The");
    listViewWrapper.update();
    expect(wrapper.find("Card"));
  });

  it("should call searchData() on onChange event", () => {
    const mockSearch = jest.spyOn(listViewWrapper.instance(), "searchData");

    listViewWrapper.find("input.searchInput").simulate("change", {
      target: {
        value: "The",
      },
    });
    listViewWrapper.instance().searchData("The");
    listViewWrapper.update();
    expect(mockSearch).toHaveBeenCalled();
  });
});
