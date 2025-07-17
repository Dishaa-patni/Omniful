import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import productReducer from "../features/products/productSlice";
import filterProducts from "../features/filter/filterSlice";
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    filter: filterProducts,
  },
});
