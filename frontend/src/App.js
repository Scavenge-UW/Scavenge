import logo from './logo.svg';
import './App.css';
import { Provider } from 'react-redux';

import store from './store';
import InventoryView from './components/InventoryView';

function App() {
  return (
    <Provider store={store}>
      <InventoryView />
    </Provider>
  );
}

export default App;
