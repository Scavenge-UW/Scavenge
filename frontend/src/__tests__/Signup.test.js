import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import { Provider } from "react-redux";


import SignupView from "../components/Authentication/SignupView";
import "../setupTests";

describe("Signup tests", () => {
  const wrapper = shallow(<SignupView />);

  it("should have a submit button", () => {
    // There should be one button in LoginView
    expect(wrapper.find("Button")).toHaveLength(1);

    // Button should say "Login"
    expect(wrapper.find("Button").text()).toEqual("Submit");
  });

  it("should have ten inputs", () => {
    expect(wrapper.find("FormControl")).toHaveLength(10);
  });

  it("should have ten blank states", () => {
    expect(wrapper.state("username")).toEqual("");
    expect(wrapper.state("password")).toEqual("");
    expect(wrapper.state("firstName")).toEqual("");
    expect(wrapper.state("lastName")).toEqual("");
    expect(wrapper.state("phone")).toEqual("");
    expect(wrapper.state("address")).toEqual("");
    expect(wrapper.state("city")).toEqual("");
    expect(wrapper.state("state")).toEqual("");
    expect(wrapper.state("zipcode")).toEqual("");
    expect(wrapper.state("email")).toEqual("");
  });

  it("should not redirect to home if fields are empty", async () => {
    const getLoginButton = wrapper.find("Button");
    await getLoginButton.simulate("click", {
      preventDefault: jest.fn(),
    });
    expect(wrapper.state("toHomeView")).toEqual(false);
  });

  it("should update states when username and password are typed", async () => {
    const usernameInput = wrapper.find("FormControl#username");
    const passwordInput = wrapper.find("FormControl#password");
    const firstnameInput = wrapper.find("FormControl#firstname");
    const lastnameInput = wrapper.find("FormControl#lastname");
    const emailInput = wrapper.find("FormControl#email");
    const phoneInput = wrapper.find("FormControl#phone");
    const addressInput = wrapper.find("FormControl#address");
    const cityInput = wrapper.find("FormControl#city");
    const stateInput = wrapper.find("FormControl#state");
    const zipInput = wrapper.find("FormControl#zip");

    await usernameInput.simulate("change", { target: { value: "sean3" } });
    await passwordInput.simulate("change", { target: { value: "abc" } });
    await firstnameInput.simulate("change", { target: { value: "sean" } });
    await lastnameInput.simulate("change", { target: { value: "cunningham" } });
    await emailInput.simulate("change", { target: { value: "abc@gmail.com" } });
    await phoneInput.simulate("change", { target: { value: "2561231123" } });
    await addressInput.simulate("change", {
      target: { value: "4141 sfsfs st" },
    });
    await cityInput.simulate("change", { target: { value: "madison" } });
    await stateInput.simulate("change", { target: { value: "wi" } });
    await zipInput.simulate("change", { target: { value: "43535" } });

    expect(wrapper.state("username")).toEqual("sean3");
    expect(wrapper.state("password")).toEqual("abc");
  });

  // it("should redirect to home if toHomeView is set to true", async () => {
  //   wrapper.setState({ toHomeView: true });

  //   expect(wrapper.find("FormControl#username_input")).toHaveLength(0);
  //   expect(wrapper.find("FormControl#password_input")).toHaveLength(0);
  // });

  it("should redirect to home on signup success", async () => {
    wrapper.setProps({
      signup: (user) => {
        return 0; // mocks Signup Success
      },
    });
    const getLoginButton = wrapper.find("Button");
    await getLoginButton.simulate("click", {
      preventDefault: jest.fn(),
    });

    expect(wrapper.state("toHomeView")).toEqual(true);
  });
});
