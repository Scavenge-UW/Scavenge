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
import { ToastContainer, toast } from 'react-toastify';

import store from './store';
import AuthService from './services/auth.service';
import LoginView from './components/Authentication/LoginView'
import SignupView from './/components/Authentication/SignupView'
import HomeView from './components/HomeView'
import PantryAdminView from './components/PantryAdminView';
import PantryDetailView from './components/PantryDetailView';
import Navigation from './components/Navigation';

import 'react-toastify/dist/ReactToastify.css';

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
  const signup = async (user) => {
    return AuthService.signup(user)
      .then((response) => {
        if (response.message){
          // When the API returns `message`,
          // that means the signup has failed
          toast.error(response.message);
          return -1;
        } else {
          setUsername(response.username);
          setToken(response.token);
          setProfile(response.profile);

          // We only need to import toast in other components
          // if we want to make a notification there.
          toast.success("🚀 Successfully signed up!");

          return 0;
        }
      })
  }
  const login = async (user) => {
    return AuthService.login(user)
      .then((response) => {
        if (response.message){
          // When the API returns `message`,
          // that means the login has failed
          toast.error(response.message);
          return -1;
        } else {
          setUsername(response.username);
          setToken(response.token);
          setProfile(response.profile);

          // We only need to import toast in other components
          // if we want to make a notification there.
          toast.success("🚀 Successfully logged in!");

          return 0;
        }
      })
  }

  const logout = async () => {
    return AuthService.logout()
      .then((response) => {
        if (response.error){
          toast.error(response.message);
        } else {
          setUsername("");
          setToken("");
          setProfile("");

          toast.info("👋 You are logged out. See you again!")
        }
      })
  }

  return (
    <Provider store={store}>
      <div id="body">
        <Router>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
           />

          <div>
            <Navigation
              profile={profile}
              logout={logout}
            />
            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch id="body">
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
              <Route path="/pantries/:pantry_id">
                <PantryDetailView />
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
