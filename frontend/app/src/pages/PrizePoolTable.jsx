import * as React from "react";

import { Grid, GridColumn } from "@progress/kendo-react-grid";
import useFetch from "../CustomHooks/useFetch";
import { getAwards } from "../reduxActions/awards";
import { useSelector, useDispatch } from "react-redux";
import { endAndDistributePrize } from "../reduxActions/endGame";

let config = {
  method: "get",
  url: "http://52.142.17.13/api/getPrizePool",
};
const PrizePoolTable = () => {
  const dispatch = useDispatch();
  const { awardsResult, loading: awardsLoading } = useSelector(
    (state) => state.Awards
  );

  console.log("AwardsRes : ", awardsResult);

  const { dataFromFetch, loading } = useFetch(config);
  const endGameHandler = () => {
    dispatch(endAndDistributePrize());
    setTimeout(() => {
      dispatch(getAwards("http://52.142.17.13/api/getPrizePool"));
    }, 3000);
  };

  return (
    <div id="PrizePoolTable" className="dashboard-page main-content">
      <div className="card-container ">
        <h3 className="card-title">Prize Pool</h3>
        <br />

        {awardsResult === "{}" ? (
          ""
        ) : (
          <p style={{ color: "grey" }}>
            There seems to be a game in-progress right now, the reward page will
            be updated once the week is over and the rewards are distributed,
            for testing purposes you may end the game early to see the rewards
            by&nbsp;
            <a
              onClick={(e) => {
                e.preventDefault();

                return endGameHandler();
              }}
              href="#"
            >
              clicking here
            </a>
          </p>
        )}

        <span></span>
        <div className="card-component">
          {loading ? (
            <p>Please wait loading data...</p>
          ) : (
            <>
              <Grid data={awardsResult ? awardsResult : null}>
                <GridColumn title="User Name" field="userName" />
                <GridColumn title="Rank" field="rank" />
                <GridColumn title="Earned Money" field="gained" />
                <GridColumn title="Money" field="score" />
              </Grid>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrizePoolTable;
