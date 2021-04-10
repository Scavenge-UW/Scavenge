const cartReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_ITEM":
      return [...state, action.payload].sort((a, b) => {
        return a.pantry.pantry_id - b.pantry.pantry_id;
      });
    case "DELETE_ITEM":
      return state.filter((item) => {
        return item.item.food_id != action.payload;
      });
    case "UPDATE_ITEM_QUANTITY":
      let newState = [...state];
      newState.forEach((item, idx) => {
        if (item.item.food_id === action.payload.item_id) {
          newState[idx].cartQuantity = action.payload.newQuantity;
        }
      });
      return newState;
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

export default cartReducer;
