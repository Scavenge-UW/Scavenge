import "./App.css";
import React, { Component } from "react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import store from "./store";
import AuthService from "./services/auth.service";
import LoginView from "./components/Authentication/LoginView";
import SignupView from "./components/Authentication/SignupView";
import HomeView from "./components/HomeView";
import PantryAdminView from "./components/PantryAdminView";
import PantryDetailView from "./components/PantryDetailView";
import MyReservationsView from "./components/MyReservationsView";
import FoodSearchView from "./components/FoodSearchView";
import Navigation from "./components/Navigation";
import ProfileView from "./components/ProfileView";
import CartView from "./components/CartView";
import HelpView from "./components/HelpView";

import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      token: "",
      profile: "",
      employeeOf: [],
    };
  }

  setUsername(newUsername) {
    this.setState({
      username: newUsername,
    });
  }

  setToken(newToken) {
    this.setState({
      token: newToken,
    });
  }

  setProfile(newProfile) {
    this.setState({
      profile: newProfile,
    });
  }

  setEmployeeOf(newEmployeeOf) {
    this.setState({
      employeeOf: newEmployeeOf,
    });
  }

  /**
   * Log in, fetch profile of the user, and
   * store profile in the state
   *
   * @param {Object} user Object with `username` and `password` as keys
   * @returns 0 if login successful
   * @returns -1 if login failure
   */
  async signup(user) {
    return AuthService.signup(user).then((response) => {
      if (response.message) {
        // When the API returns `message`,
        // that means the signup has failed
        toast.error(response.message);
        return -1;
      } else {
        this.setUsername(response.username);
        this.setToken(response.token);
        this.setProfile(response.profile);

        // We only need to import toast in other components
        // if we want to make a notification there.
        toast.success("🚀 Successfully signed up!");

        return 0;
      }
    });
  }

  async login(user) {
    return AuthService.login(user).then((response) => {
      if (response.message) {
        // When the API returns `message`,
        // that means the login has failed
        toast.error(response.message);
        return -1;
      } else {
        this.setUsername(response.username);
        this.setToken(response.token);
        this.setProfile(response.profile);
        this.setEmployeeOf(response.employee_of);

        // We only need to import toast in other components
        // if we want to make a notification there.
        toast.success("🚀 Successfully logged in!");

        return 0;
      }
    });
  }

  async logout() {
    return AuthService.logout().then((response) => {
      if (response.error) {
        toast.error(response.message);
      } else {
        this.setUsername("");
        this.setToken("");
        this.setProfile("");
        this.setEmployeeOf([]);

        toast.info("👋 You are logged out. See you again!");
      }
    });
  }

  isAdmin() {
    return this.state.employeeOf.length !== 0;
  }

  isLoggedIn() {
    return this.state.profile !== "";
  }

  render() {
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
                profile={this.state.profile}
                logout={this.logout.bind(this)}
                isAdmin={this.isAdmin.bind(this)}
              />
              {/* A <Switch> looks through its children <Route>s and
                  renders the first one that matches the current URL. */}
              <Switch id="body">
                <Route path="/login">
                  <LoginView login={this.login.bind(this)} />
                </Route>
                <Route path="/signup">
                  <SignupView signup={this.signup.bind(this)} />
                </Route>
                <Route path="/pantry">
                  <PantryAdminView />
                </Route>
                <Route path="/pantries/:pantry_id">
                  <PantryDetailView
                    isLoggedIn={this.isLoggedIn.bind(this)}
                    isAdmin={this.isAdmin.bind(this)}
                    username={this.state.username}
                  />
                </Route>
                <Route path="/search-food/:query">
                  <FoodSearchView />
                </Route>
                <Route path="/search-food">
                  <FoodSearchView />
                </Route>
                <Route path="/profile">
                  <ProfileView
                    profile={this.state.profile}
                    setProfile={this.setProfile.bind(this)}
                  />
                </Route>
                <Route path="/help">
                  <HelpView />
                </Route>
                <Route path="/cart">
                  <CartView username={this.state.username} />
                </Route>
                <Route path="/reservations">
                  <MyReservationsView username={this.state.username} />
                </Route>
                <Route path="/logout">
                  <Redirect push to="/" />
                </Route>
                <Route exact path="/">
                  <HomeView profile={this.state.profile} />
                </Route>
                <Route path="*">
                  <div>404 Not Found</div>
                </Route>
              </Switch>
            </div>
          </Router>
        </div>
      </Provider>
    );
  }
}

export default App;
