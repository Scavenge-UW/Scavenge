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

import AuthService from './services/auth.service';
import LoginView from './components/LoginView'
import SignupView from './components/SignupView'
import HomeView from './components/HomeView'
import store from './store';
import PantryAdminView from './components/PantryAdminView';

function App(props) {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState("");

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
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/signup">Signup</Link>
                </li>
              </ul>
            </nav>

            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/login">
                <LoginView
                  history={props.history}
                  login={login}
                />
              </Route>
              <Route path="/Signup">
                <SignupView />
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
