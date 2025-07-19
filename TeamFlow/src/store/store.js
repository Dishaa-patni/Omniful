import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import orderDraftReducer from "../features/orderDraftSlice";

const persistedUser = JSON.parse(localStorage.getItem("user")) || {};

export const store = configureStore({
  reducer: {
    users: userReducer,
    orderDraft: orderDraftReducer,
  },
  preloadedState: {
    users: {
      name: persistedUser.name || "",
      email: persistedUser.email || "",
      role: persistedUser.role || "",
      password: persistedUser.role || "",
      department: persistedUser.department || "",
      isloggedIn: !!persistedUser.role,
    },
  },
});
