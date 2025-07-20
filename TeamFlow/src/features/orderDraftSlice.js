import { createSlice } from "@reduxjs/toolkit";

const orderDraftSlice = createSlice({
  name: "orderDraft",
  initialState: {
    services: [],
    step1: null,
    step2: null,
    isSubmitted: false,
    step: 1,
  },
  reducers: {
    addService(state, action) {
      state.services.push(action.payload);
    },
    clearServices(state) {
      state.services = [];
    },
    saveStep1(state, action) {
      state.step1 = action.payload;
    },
    saveStep2(state, action) {
      state.step2 = action.payload;
    },
    markSubmitted(state, action) {
      state.isSubmitted = action.payload;
    },
    resetDraft(state) {
      state.step1 = null;
      state.step2 = null;
    },
    clearSubmission(state) {
      state.isSubmitted = false;
    },
    setStep(state, action) {
      state.step = action.payload;
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
  clearSubmission,
  setStep,
} = orderDraftSlice.actions;
export default orderDraftSlice.reducer;
