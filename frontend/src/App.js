import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux"; // a react component (like a glue for react and redux)

import LoginView from "./components/LoginView";
import store from "./store";

import "./App.css";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Route path="/login" component={() => <LoginView />} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
