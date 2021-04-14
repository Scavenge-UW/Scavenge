import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";

import LoginView from "../components/Authentication/LoginView";
import "../setupTests";

describe("Login tests", () => {
  const wrapper = shallow(<LoginView />);

  it("should have a login button", () => {
    // There should be one button in LoginView
    expect(wrapper.find("Button")).toHaveLength(1);

    // Button should say "Login"
    expect(wrapper.find("Button").text()).toEqual("Login");
  });

  it("should have two inputs for username and password", () => {
    expect(wrapper.find("FormControl")).toHaveLength(2);
  });

  it("should have two inputs for username and password", () => {
    expect(wrapper.find("FormControl")).toHaveLength(2);
  });

  it("should have two blank states for username and password", () => {
    expect(wrapper.state("username")).toEqual("");
    expect(wrapper.state("password")).toEqual("");
  });

  it("should not redirect to home if credentials are empty", async () => {
    const getLoginButton = wrapper.find("Button");
    await getLoginButton.simulate("click", {
      preventDefault: jest.fn(),
    });

    expect(wrapper.state("toHomeView")).toEqual(false);
  });

  it("should update states when username and password are typed", async () => {
    const usernameInput = wrapper.find("FormControl#username_input");
    const passwordInput = wrapper.find("FormControl#password_input");

    await usernameInput.simulate("change", { target: { value: "sean3" } });
    await passwordInput.simulate("change", { target: { value: "abc" } });

    expect(wrapper.state("username")).toEqual("sean3");
    expect(wrapper.state("password")).toEqual("abc");
  });

  it("should redirect to home if toHomeView is set to true", async () => {
    wrapper.setState({ toHomeView: true });

    expect(wrapper.find("FormControl#username_input")).toHaveLength(0);
    expect(wrapper.find("FormControl#password_input")).toHaveLength(0);
  });

  it("should redirect to home on login success", async () => {
    wrapper.setState({ toHomeView: false });
    wrapper.setProps({
      login: () => {
        return 0; // mocks Login Success
      },
    });
    const getLoginButton = wrapper.find("Button");
    await getLoginButton.simulate("click", {
      preventDefault: jest.fn(),
    });

    expect(wrapper.state("toHomeView")).toEqual(true);
    expect(wrapper.find("FormControl#username_input")).toHaveLength(0);
    expect(wrapper.find("FormControl#password_input")).toHaveLength(0);
  });
});
