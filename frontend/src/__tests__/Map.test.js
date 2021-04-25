import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";

import App from "../App";
import Map from "../components/components_shared/Map";
import store from "../store";

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

describe("Map tests", () => {
  const mockGeolocation = {
    getCurrentPosition: jest.fn().mockImplementation((success) => {
      Promise.resolve(
        success({
          coords: {
            latitude: 10,
            longitude: 10,
          },
        })
      );
    }),
    watchPosition: jest.fn(),
  };

  global.navigator.geolocation = mockGeolocation;

  const wrapper = mount(<Map />);

  it("should correctly return pantry pin color (00:00:00)", async () => {
    var time = new Date("2021-04-23T05:40:30.778Z"); // Fri Apr 23 2021 00:40:30 GMT-0500 (Central Daylight Time)
    wrapper.setState({
      time: time,
    });
    expect(wrapper.instance().determinePinColor(mockPantries[0])).toEqual(
      "red"
    );
  });

  it("should correctly return pantry pin color (closed)", async () => {
    var time1 = new Date("2021-04-22T05:40:30.778Z"); // Thu Apr 23 2021 00:40:30 GMT-0500 (Central Daylight Time)
    var time2 = new Date("2021-04-22T16:56:30.778Z"); // Thu Apr 23 2021 00:40:30 GMT-0500 (Central Daylight Time)

    // pantryHourOpen comparison
    await wrapper.setState({
      time: time1,
    });
    expect(wrapper.instance().determinePinColor(mockPantries[0])).toEqual(
      "red"
    );

    // pantryHourClose comparison
    await wrapper.setState({
      time: time2,
    });
    expect(wrapper.instance().determinePinColor(mockPantries[0])).toEqual(
      "red"
    );
  });

  it("should correctly return pantry pin color (open)", async () => {
    var time1 = new Date("2021-04-22T15:40:30.778Z"); // Thu Apr 23 2021 10:40:30 GMT-0500 (Central Daylight Time)
    var time2 = new Date("2021-04-22T16:54:30.778Z"); // Thu Apr 23 2021 10:40:30 GMT-0500 (Central Daylight Time)
    var time3 = new Date("2021-04-24T16:54:30.778Z"); // Thu Apr 23 2021 10:40:30 GMT-0500 (Central Daylight Time)

    // pantryHourOpen comparison
    await wrapper.setState({
      time: time1,
    });
    expect(wrapper.instance().determinePinColor(mockPantries[0])).toEqual(
      "green"
    );

    // pantryHourClose comparison
    await wrapper.setState({
      time: time2,
    });
    expect(wrapper.instance().determinePinColor(mockPantries[0])).toEqual(
      "green"
    );

    // pantryHourOpen < currHour < pantryHourClose
    await wrapper.setState({
      time: time3,
    });
    expect(wrapper.instance().determinePinColor(mockPantries[0])).toEqual(
      "green"
    );
  });

  it("should correctly return two Markers", async () => {
    await wrapper.setState({
      pantries: mockPantries,
    });
    expect(wrapper.instance().loadPantryPins()).toHaveLength(2);
  });
});
