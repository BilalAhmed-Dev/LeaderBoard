import { createSlice } from "@reduxjs/toolkit";
const awardSlice = createSlice({
  name: "awardSlice",
  initialState: {
    awardsResult: null,
    loading: false,
  },
  reducers: {
    storeAwardsData(state, action) {
      state.awardsResult = action.payload;
      state.loading = false;
    },
    storeAwardsDataLoading(state, action) {
      state.loading = true;
    },
  },
});

export const awardSliceActions = awardSlice.actions;
export default awardSlice;
