import { combineReducers } from 'redux';
import pantryReducer from './pantryReducer';

export default combineReducers({
  pantries: pantryReducer
});