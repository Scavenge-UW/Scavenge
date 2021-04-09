export const addToCart = (item) => {
  return {
    type: "ADD_ITEM",
    payload: item,
  };
};

export const deleteFromCart = (item_id) => {
  return {
    type: "DELETE_ITEM",
    payload: item_id,
  };
};

export const updateQuantity = (item_id, newQuantity) => {
  return {
    type: "UPDATE_ITEM_QUANTITY",
    payload: { item_id, newQuantity },
  };
};

export const clearCart = () => {
  return {
    type: "CLEAR_CART",
  };
};
