import { createSlice } from "@reduxjs/toolkit";
const addScore = createSlice({
  name: "addScore",
  initialState: {
    loading: false,
    message: null,
  },
  reducers: {
    message(state, action) {
      state.message = action.data;
      state.loading = false;
    },
    addScoreLoading(state, action) {
      state.loading = true;
    },
  },
});

export const addScoreActions = addScore.actions;
export default addScore;
