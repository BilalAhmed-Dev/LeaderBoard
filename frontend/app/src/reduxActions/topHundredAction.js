import { topHundredActions } from "../store/topHunderSlice";
import axios from "axios";

/// Login User
export const geTopHundred = (url) => async (dispatch) => {
  dispatch(topHundredActions.top100Loading());
  try {
    const { data } = await axios(url);

    console.log(data);
    dispatch(topHundredActions.storeTop100(data));
  } catch (error) {
    console.log(error);
  }
};
