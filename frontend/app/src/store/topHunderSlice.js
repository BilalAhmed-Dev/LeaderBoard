import { createSlice } from "@reduxjs/toolkit";
const topHundred = createSlice({
  name: "topHundred",
  initialState: {
    topHundredResult: null,
    loading: false,
  },
  reducers: {
    storeTop100(state, action) {
      state.topHundredResult = action.payload;
      state.loading = false;
    },
    top100Loading(state, action) {
      state.loading = true;
    },
  },
});

export const topHundredActions = topHundred.actions;
export default topHundred;
