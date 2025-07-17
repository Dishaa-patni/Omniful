import { createSlice } from "@reduxjs/toolkit";

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem("cartItems");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: loadFromLocalStorage(),
  },
  reducers: {
    addToCart: (state, action) => {
      //checking if the product already exist in the cart or not
      const productInCart = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      //So we need update the quantity, not th item
      if (!productInCart) {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (prd) => prd.id !== action.payload
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
    },

    incrementQuantity: (state, action) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    decrementQuantity: (state, action) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.cartItems = state.cartItems.filter(
          (item) => item.id != action.payload
        );
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
