import { awardSliceActions } from "../store/awardsSlice";
import axios from "axios";

/// Login User
export const getAwards = (url) => async (dispatch) => {
  dispatch(awardSliceActions.storeAwardsDataLoading());
  try {
    const { data } = await axios(url);

    console.log(data);
    dispatch(awardSliceActions.storeAwardsData(data));
  } catch (error) {
    console.log(error);
  }
};
