import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import endGame from "./endGameSlice";
import addScore from "./addScoreSlice";
import awardSlice from "./awardsSlice";
import topHundred from "./topHunderSlice";

export default configureStore({
  reducer: {
    userAuth: userSlice.reducer,
    endGame: endGame.reducer,
    addScore: addScore.reducer,
    Awards: awardSlice.reducer,
    top100: topHundred.reducer,
  },
});
