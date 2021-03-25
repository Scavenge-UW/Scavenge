import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import store from './store';
import AuthService from './services/auth.service';
import LoginView from './components/LoginView'
import SignupView from './components/SignupView'
import HomeView from './components/HomeView'
import PantryAdminView from './components/PantryAdminView';
import Navigation from './components/Navigation';

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
          alert(response.message);
          return -1
        } else {
          setUsername(response.username);
          setToken(response.token);
          setProfile(response.profile);
          return 0
        }
      })
  }

  return (
    <Provider store={store}>
      <div>
        <Router>
          <div>
            <Navigation
              profile={profile}
            />

            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/login">
                <LoginView
                  login={login}
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
