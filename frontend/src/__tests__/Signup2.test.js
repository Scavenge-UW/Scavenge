import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { mount } from "enzyme";
import { Provider } from "react-redux";


import SignupView from "../components/Authentication/SignupView";
import "../setupTests";
import store from "../store";


describe("Login tests", () => {
    const wrapper = mount(<Provider store={store}><SignupView /></Provider>);
  
    it("should have a login button", () => {
      // There should be one button in LoginView
      expect(wrapper.find("Button")).toHaveLength(1);
  
      // Button should say "Login"
      expect(wrapper.find("Button").text()).toEqual("Submit");
    });
  
    it("should have 10 inputs for a user's profile", () => {
      expect(wrapper.find("FormControl")).toHaveLength(10);
    });
  
  
    it("should have 10 blank states for sign up profile", () => {
      expect(wrapper.state("username")).toEqual("");
      expect(wrapper.state("password")).toEqual("");
      expect(wrapper.state("address")).toEqual("");
      expect(wrapper.state("city")).toEqual("");
      expect(wrapper.state("state")).toEqual("");
      expect(wrapper.state("email")).toEqual("");
      expect(wrapper.state("zipcode")).toEqual("");
      expect(wrapper.state("firstName")).toEqual("");
      expect(wrapper.state("lastName")).toEqual("");
      expect(wrapper.state("phone")).toEqual("");

    });
  
    it("should not redirect to home if credentials are empty", async () => {
      const getLoginButton = wrapper.find("Button");
      await getLoginButton.simulate("click", {
        preventDefault: jest.fn(),
      });
  
      expect(wrapper.state("toHomeView")).toEqual(false);
    });
  
    it("should update states when all fields are typed", async () => {
      const usernameInput = wrapper.find("FormControl#username_input");
      const passwordInput = wrapper.find("FormControl#password_input");
      const firstNameInput = wrapper.find("FormControl#firstName_input");
      const lastNameInput = wrapper.find("FormControl#lastName_input");
      const emailInput = wrapper.find("FormControl#email_input");
      const phoneInput = wrapper.find("FormControl#phone_input");
      const addressInput = wrapper.find("FormControl#address_input");
      const cityInput = wrapper.find("FormControl#city_input");
      const stateInput = wrapper.find("FormControl#state_input");
      const zipcodeInput = wrapper.find("FormControl#zipcode_input");


      await usernameInput.simulate("change", { target: { value: "sean3" } });
      await passwordInput.simulate("change", { target: { value: "abc" } });
      await firstNameInput.simulate("change", { target: { value: "sean" } });
      await lastNameInput.simulate("change", { target: { value: "cunningham" } });
      await emailInput.simulate("change", { target: { value: "sjcunningham@wisc.edu" } });
      await phoneInput.simulate("change", { target: { value: "sean's phone" } });
      await addressInput.simulate("change", { target: { value: "street" } });
      await cityInput.simulate("change", { target: { value: "city" } });
      await stateInput.simulate("change", { target: { value: "wi" } });
      await zipcodeInput.simulate("change", { target: { value: "53706" } });



  
      expect(wrapper.state("username")).toEqual("sean3");
      expect(wrapper.state("password")).toEqual("abc");
      expect(wrapper.state("firstName")).toEqual("sean");
      expect(wrapper.state("lastName")).toEqual("cunningham");
      expect(wrapper.state("phone")).toEqual("sean's phone");
      expect(wrapper.state("address")).toEqual("street");
      expect(wrapper.state("city")).toEqual("city");
      expect(wrapper.state("state")).toEqual("wi");      
      expect(wrapper.state("zipcode")).toEqual("53706");
      expect(wrapper.state("email")).toEqual("sjcunningham@wisc.edu");


    });
  
    it("should redirect to home if toHomeView is set to true", async () => {
      wrapper.setState({ toHomeView: true });
  
      expect(wrapper.find("FormControl#username_input")).toHaveLength(0);
      expect(wrapper.find("FormControl#password_input")).toHaveLength(0);
      expect(wrapper.find("FormControl#firstName_input")).toHaveLength(0);
      expect(wrapper.find("FormControl#lastName_input")).toHaveLength(0);
      expect(wrapper.find("FormControl#email_input")).toHaveLength(0);
      expect(wrapper.find("FormControl#phone_input")).toHaveLength(0);
      expect(wrapper.find("FormControl#address_input")).toHaveLength(0);
      expect(wrapper.find("FormControl#city_input")).toHaveLength(0);
      expect(wrapper.find("FormControl#state_input")).toHaveLength(0);
      expect(wrapper.find("FormControl#zipcode_input")).toHaveLength(0);

    });
  
    // it("should redirect to home on login success", async () => {
    //   wrapper.setState({ toHomeView: false });
    //   wrapper.setProps({
    //     login: () => {
    //       return 0; // mocks Login Success
    //     },
    //   });
    //   const getLoginButton = wrapper.find("Button");
    //   await getLoginButton.simulate("click", {
    //     preventDefault: jest.fn(),
    //   });
  
    //   expect(wrapper.state("toHomeView")).toEqual(true);
    //   expect(wrapper.find("FormControl#username_input")).toHaveLength(0);
    //   expect(wrapper.find("FormControl#password_input")).toHaveLength(0);
    //   expect(wrapper.find("FormControl#firstName_input")).toHaveLength(0);
    //   expect(wrapper.find("FormControl#lastName_input")).toHaveLength(0);
    //   expect(wrapper.find("FormControl#email_input")).toHaveLength(0);
    //   expect(wrapper.find("FormControl#phone_input")).toHaveLength(0);
    //   expect(wrapper.find("FormControl#address_input")).toHaveLength(0);
    //   expect(wrapper.find("FormControl#city_input")).toHaveLength(0);
    //   expect(wrapper.find("FormControl#state_input")).toHaveLength(0);
    //   expect(wrapper.find("FormControl#zipcode_input")).toHaveLength(0);
   // });
  });
  