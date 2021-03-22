import logo from './logo.svg';
import { Provider } from 'react-redux';
import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import LoginView from './components/LoginView';
import SignupView from './components/SignupView';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <Router>
          <Switch>
            <Route
              path="/login"
              component={() => <LoginView  />}
            />
            <Route
              path="/signup"
              component={() => <SignupView  />}
            />
          </Switch>
      </Router>
    </Provider>
  );
}

export default App;
