import logo from "./logo.svg";
import "./App.css";
import { Provider } from "react-redux";

import store from "./store";

import LoginView from "./components/LoginView";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <body>
          <LoginView />
        </body>
      </div>
    </Provider>
  );
}

export default App;
