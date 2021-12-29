import { topHundredActions } from "../store/topHunderSlice";
import axios from "axios";
var qs = require("qs");
/// Login User
export const geTopHundred = (urloFTop100, userId) => async (dispatch) => {
  var IdOfTheUser = qs.stringify({
    userId,
  });
  var config = {
    method: "post",
    url: urloFTop100,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: IdOfTheUser,
  };
  dispatch(topHundredActions.top100Loading());
  try {
    const { data } = await axios(config);

    console.log(data);
    dispatch(topHundredActions.storeTop100(data));
  } catch (error) {
    console.log(error);
  }
};
