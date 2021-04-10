import { combineReducers } from "redux";
import pantryReducer from "./pantryReducer";
import cartReducer from "./cart.reducer";

export default combineReducers({
  pantries: pantryReducer,
  cart: cartReducer,
});
