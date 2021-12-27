import { endGameActions } from "../store/endGameSlice";
import axios from "axios";
var qs = require("qs");

/// Login User
export const endAndDistributePrize = () => async (dispatch) => {
  var configOfEndGame = {
    method: "post",
    url: "http://52.142.17.13/api/triggerEndGame",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  dispatch(endGameActions.endOfGameLoad());
  try {
    const { data: item } = await axios(configOfEndGame);

    dispatch(endGameActions.storeEndGameData(item));
  } catch (error) {
    console.log(error);
  }
};
