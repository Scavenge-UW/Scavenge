import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import { Provider } from "react-redux";

import Navigation from "../components/Navigation";
import "../setupTests";
import store from "../store";

describe("Navigation tests", () => {
  const mockIsAdmin1 = () => {
    return true;
  };
  const mockIsAdmin2 = () => {
    return false;
  };

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

  const adminWrapper = shallow(<Navigation isAdmin={mockIsAdmin1} />);

  const nonAdminWrapper = shallow(
    <Navigation isAdmin={mockIsAdmin2} profile={mockProfile} />
  );

  const guestWrapper = shallow(<Navigation isAdmin={mockIsAdmin2} />);

  it("should have three buttons for guest users", () => {
    // There should be one button in LoginView
    expect(guestWrapper.find("NavLink")).toHaveLength(3);
    expect(
      guestWrapper.findWhere((n) => n.key() === "Search Foods")
    ).toHaveLength(1);
    expect(guestWrapper.findWhere((n) => n.key() === "Login")).toHaveLength(1);
    expect(guestWrapper.findWhere((n) => n.key() === "Signup")).toHaveLength(1);
  });

  it("should have four buttons for civilian users", () => {
    // There should be one button in LoginView
    expect(nonAdminWrapper.find("NavLink")).toHaveLength(5);
    expect(
      nonAdminWrapper.findWhere((n) => n.key() === "Search Foods")
    ).toHaveLength(1);
    expect(nonAdminWrapper.findWhere((n) => n.key() === "Cart")).toHaveLength(
      1
    );
    expect(
      nonAdminWrapper.findWhere((n) => n.key() === "Profile")
    ).toHaveLength(1);
    expect(nonAdminWrapper.findWhere((n) => n.key() === "Logout")).toHaveLength(
      1
    );
  });

  it("should have correct three buttons for admin users", () => {
    // There should be one button in LoginView
    expect(adminWrapper.find("NavLink")).toHaveLength(3);
    expect(
      adminWrapper.findWhere((n) => n.key() === "Manage Pantry")
    ).toHaveLength(1);
    expect(adminWrapper.findWhere((n) => n.key() === "Profile")).toHaveLength(
      1
    );
    expect(adminWrapper.findWhere((n) => n.key() === "Logout")).toHaveLength(1);
  });
});
