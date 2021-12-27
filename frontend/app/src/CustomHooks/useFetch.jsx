import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { awardSliceActions } from "../store/awardsSlice";

var qs = require("qs");

function useFetch(config, userId = null) {
  const dispatch = useDispatch();
  const [dataFromFetch, setDataFromFetch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  let data1;
  if (userId !== null) {
    data1 = qs.stringify({
      userId: userId,
    });
  }

  console.log(config);
  useEffect(() => {
    setLoading(true);
    axios({ ...config, data: data1 ? data1 : "" })
      .then((response) => {
        if (config.url.includes("getTop100")) {
          setDataFromFetch(response.data);
        }
        if (config.url.includes("getPrizePool")) {
          dispatch(awardSliceActions.storeAwardsData(response.data));
        }
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [config, data1]);

  return { dataFromFetch, loading, error };
}

export default useFetch;
