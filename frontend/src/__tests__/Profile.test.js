import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import ProfileView from "../components/ProfileView";
import "../setupTests";
import store from "../store";

describe("Profile tests", () => {
  const mockProfile = {
    username: "sean3",
    firstName: "sean",
    lastName: "cunningham",
    email: "sjcunningham@wisc.edu",
    phone: "sean's phone",
    address: "street",
    city: "city",
    state: "wi",
    zipcode: 53706,
    type: "user",
  };

  const wrapper = mount(
    <Provider store={store}>
      <ProfileView profile={mockProfile} />
    </Provider>
  );

  it("should have two buttons", () => {
    // There should be one button in LoginView
    expect(wrapper.find("Button")).toHaveLength(2);
  });

  it("should have 10 inputs for profile fields", () => {
    expect(wrapper.find("FormControl")).toHaveLength(10);
  });

  it("should have 10 states for fields in profile", () => {
    const getProfileView = wrapper.find("ProfileView");
    expect(getProfileView.state("username")).toEqual("sean3");
    expect(getProfileView.state("password")).toEqual("");
    expect(getProfileView.state("phone")).toEqual("sean's phone");
    expect(getProfileView.state("address")).toEqual("street");
    expect(getProfileView.state("city")).toEqual("city");
    expect(getProfileView.state("state")).toEqual("wi");
    expect(getProfileView.state("zipcode")).toEqual(53706);
    expect(getProfileView.state("email")).toEqual("sjcunningham@wisc.edu");
    expect(getProfileView.state("first_name")).toEqual("sean");
    expect(getProfileView.state("last_name")).toEqual("cunningham");
  });
});
