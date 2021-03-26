import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';

import LoginView from '../components/Authentication/LoginView';
import "../setupTests"

describe('Login tests', () => {
  const wrapper = shallow(<LoginView />);

  it('should have a login button', () => {
    // There should be one button in LoginView
    expect(wrapper.find('Button')).toHaveLength(1);

    // Button should say "Login"
    expect(wrapper.find('Button')
      .text())
      .toEqual('Login');
  })

  it('should have two inputs for username and password', () => {
    expect(wrapper.find('FormControl')).toHaveLength(2);
  })

  it('should have two inputs for username and password', () => {
    expect(wrapper.find('FormControl')).toHaveLength(2);
  })

  it('should have two blank states for username and password', () => {
    expect(wrapper.state('username')).toEqual('');
    expect(wrapper.state('password')).toEqual('');
  })
})