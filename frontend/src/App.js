import logo from './logo.svg';
import './App.css';
import { Provider } from 'react-redux';

import store from './store';
import PantryAdminView from './components/PantryAdminView';

function App() {
  return (
    <Provider store={store}>
      <PantryAdminView />
    </Provider>
  );
}

export default App;
