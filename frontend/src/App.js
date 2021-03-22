import './App.css';
import { Provider } from 'react-redux';
import ProfileView from './components/profileView';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <ProfileView />
      </div>
    </Provider>
  );
}

export default App;
