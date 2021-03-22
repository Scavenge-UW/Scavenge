import { combineReducers } from 'redux';
import profileReducer from './authReducer';

export default combineReducers({
  profile: profileReducer
});