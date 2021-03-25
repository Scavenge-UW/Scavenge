import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {NotificationContainer, NotificationManager} from 'react-notifications';

import store from './store';
import AuthService from './services/auth.service';
import LoginView from './components/Authentication/LoginView'
import SignupView from './/components/Authentication/SignupView'
import HomeView from './components/HomeView'
import PantryAdminView from './components/PantryAdminView';
import Navigation from './components/Navigation';

import 'react-notifications/lib/notifications.css';

function App(props) {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState("");

  /**
   * Log in, fetch profile of the user, and
   * store profile in the state
   * 
   * @param {Object} user Object with `username` and `password` as keys 
   * @returns 0 if login successful
   * @returns -1 if login failure
   */
  const login = async (user) => {
    return AuthService.login(user)
      .then((response) => {
        if (response.message){
          // When the API returns `message`,
          // that means the login has failed
          createNotification("error", response.message)();
          return -1
        } else {
          setUsername(response.username);
          setToken(response.token);
          setProfile(response.profile);

          createNotification("success", "Successfully logged in!")();

          return 0;
        }
      })
  }

  const createNotification = (type, message) => {
    console.log("INSIDE CREATE");
    return () => {
      // FOR REFERENCE
      // switch (type) {
      //   case 'info':
      //     NotificationManager.info('Info message');
      //     break;
      //   case 'success':
      //     NotificationManager.success('Success message', 'Title here');
      //     break;
      //   case 'warning':
      //     NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
      //     break;
      //   case 'error':
      //     NotificationManager.error('Error message', 'Click me!', 5000, () => {
      //       alert('callback');
      //     });
      //     break;
      // }
      switch (type) {
        case 'info':
          // Message, title, timeout
          NotificationManager.info(message, '', 3000);
          break;
        case 'success':
          NotificationManager.success(message, '', 3000);
          break;
        case 'warning':
          NotificationManager.warning(message, '', 3000);
          break;
        case 'error':
          NotificationManager.error(message, '', 3000)
          break;
      }
    };
  };

  return (
    <Provider store={store}>
      <div>
        <Router>
          <div>
            <Navigation
              profile={profile}
            />
          <NotificationContainer />
            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/login">
                <LoginView
                  login={login}
                  createNotification={createNotification}
                />
              </Route>
              <Route path="/signup">
                <SignupView />
              </Route>
              <Route path="/pantry">
                <PantryAdminView />
              </Route>
              <Route path="/">
                <HomeView
                  profile={profile}
                />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
