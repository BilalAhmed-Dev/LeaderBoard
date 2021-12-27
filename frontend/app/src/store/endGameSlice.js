import { createSlice } from "@reduxjs/toolkit";
const endGame = createSlice({
  name: "endGame",
  initialState: {
    data: null,
    loading: false,
  },
  reducers: {
    storeEndGameData(state, action) {
      state.data = action.payload;
      state.loading = false;
    },
    endOfGameLoad(state, action) {
      state.loading = true;
    },
  },
});

export const endGameActions = endGame.actions;
export default endGame;
