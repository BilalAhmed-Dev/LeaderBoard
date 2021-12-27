import { addScoreActions } from "../store/addScoreSlice";
import axios from "axios";
var qs = require("qs");

/// Login User
export const addScoreToUser = (userId, score) => async (dispatch) => {
  console.log(userId, score);
  var dataOfAddScore = qs.stringify({
    userId,
    score,
  });
  var config = {
    method: "post",
    url: "http://52.142.17.13/addScore",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: dataOfAddScore,
  };
  console.log(data);
  dispatch(addScoreActions.addScoreLoading());
  try {
    const { data } = await axios(config);
    console.log(data);
    dispatch(addScoreActions.message(data));
  } catch (error) {
    console.log(error);
  }
};
