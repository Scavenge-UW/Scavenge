import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount } from "enzyme";

import MyReservationsView from "../components/components_user/MyReservationsView";
import "../setupTests";
import pantryDetail from "../__mocks__/pantryDetailMock";

describe("MyReservationsView tests", () => {
  const wrapper = shallow(<MyReservationsView />);

  // 1. not logged in
  it("should redirect to login if not logged in", () => {
    expect(wrapper.find("Redirect")).toHaveLength(1);
  });

  // 2. not loaded yet
  it("should show spinner when in loading state", () => {
    wrapper.setProps({
      username: "ilkyu",
    });
    wrapper.setState({
      loaded: false,
    });
    expect(wrapper.find("MySpinner")).toHaveLength(1);
  });

  // 3. loading complete
  it("should show reservations", () => {
    wrapper.setState({
      loaded: true,
    });
    expect(wrapper.find("Dashboard_newMsg")).toHaveLength(1);
  });

  // it("should have markWithDraw()", () => {
  //   wrapper.instance().markWithDraw(1, 1);
  // });
});
