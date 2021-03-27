import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';

import ProfileView from '../components/ProfileView';
import "../setupTests"

describe('Login tests', () => {
  const wrapper = shallow(<ProfileView />);

  it('should have a login button', () => {
    // There should be one button in LoginView
    expect(wrapper.find('Button')).toHaveLength(2);

  })

  it('should have two inputs for username and password', () => {
    expect(wrapper.find('FormControl')).toHaveLength(10);
  })


  it('should have two blank states for username and password', () => {
    expect(wrapper.state('username')).toEqual('');
    expect(wrapper.state('password')).toEqual('');
    expect(wrapper.state('phone')).toEqual('');
    expect(wrapper.state('address')).toEqual('');
    expect(wrapper.state('city')).toEqual('');
    expect(wrapper.state('state')).toEqual('');
    expect(wrapper.state('zip')).toEqual('');
    expect(wrapper.state('email')).toEqual('');
    expect(wrapper.state('first_name')).toEqual('');
    expect(wrapper.state('last_name')).toEqual('');
  })
})