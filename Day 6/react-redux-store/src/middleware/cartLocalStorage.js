const cartLocalStorageMiddleware = (storeAPI) => (next) => (action) => {
  const result = next(action);
  const cartActionTypes = [
    "cart/addToCart",
    "cart/removeFromCart",
    "cart/clearCart",
    "cart/incrementQuantity",
    "cart/decrementQuantity",
  ];

  if (cartActionTypes.includes(action.type)) {
    const state = storeAPI.getState();
    const cartItems = state.cart.cartItems;

    console.log(" Middleware triggered :", cartItems);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }

  return result;
};

export default cartLocalStorageMiddleware;
