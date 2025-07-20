import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  name: "",
  email: "",
  role: "",
  department: "",
  password: "",
  isloggedIn: false,
};
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    login: (state, action) => {
      const { id, name, password, email, role, department } = action.payload;
      state.name = name;
      state.id = id;
      state.email = email;
      state.role = role;
      state.password = password;
      state.department = department || "";
      state.isloggedIn = true;
    },

    logout: (state, action) => {
      state.name = "";
      state.id = "";
      state.email = "";
      state.role = "";
      state.password = "";
      state.department = "";
      state.isloggedIn = false;
      localStorage.removeItem("user")
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
