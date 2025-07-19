// features/orderDraftSlice.js
import { createSlice } from "@reduxjs/toolkit";

const orderDraftSlice = createSlice({
  name: "orderDraft",
  initialState: {
    services: [],
    step1: null,
    step2: null,
    isSubmitted: false,
  },
  reducers: {
    addService(state, action) {
      state.services.push(action.payload);
    },
    clearServices(state) {
      state.services = [];
    },
    saveStep1(state, action) {
      //   console.log("soham jain ", state, action);
      state.step1 = action.payload;
      //   console.log("dishaa",state.step1)
    },
    saveStep2(state, action) {
      state.step2 = action.payload;
    },
    markSubmitted(state) {
      state.isSubmitted = true;
    },
    resetDraft(state) {
      state.step1 = null;
      state.step2 = null;
      state.isSubmitted = action.payload;
    },
  },
});

export const {
  addService,
  saveStep1,
  saveStep2,
  markSubmitted,
  resetDraft,
  clearServices,
} = orderDraftSlice.actions;
export default orderDraftSlice.reducer;
