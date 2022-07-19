import * as React from "react";

import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { geTopHundred } from "../reduxActions/topHundredAction.js";
import { CustomCell } from "../components/KendoGrid/CustomKendoCell.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import useFetch from "../CustomHooks/useFetch";

let config = {
  method: "post",
  url: "http://localhost:8080/api/getTop100",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};
const Dashboard = () => {
  const dispatch = useDispatch();

  const { status, userId } = useSelector((state) => state.userAuth);
  const { topHundredResult, loading: top100Loading } = useSelector(
    (state) => state.top100
  );
console.log(status, userId)
  // const { data: endGameRes } = useSelector((state) => state.endGame);
  // console.log("data: ", endGameRes);

  // test
  let Id = null;
  if (status !== null) {
    Id = userId;
  }
  //test

  const { dataFromFetch, loading } = useFetch(config, Id);

  const rowRender = (trElement, props) => {
    const IdDoesMatch = props.dataItem._id === userId;
    const green = {
      backgroundColor: "rgba(51, 170, 51, .1)",
    };

    const noBackGroundColor = {
      backgroundColor: "",
    };
    const trProps = {
      style: IdDoesMatch ? green : noBackGroundColor,
    };
    return React.cloneElement(
      trElement,
      { ...trProps },
      trElement.props.children
    );
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Dispatched new getTop100");
      dispatch(geTopHundred("http://localhost:8080/api/getTop100", Id));
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <div id="Dashboard" className="dashboard-page main-content">
      <div className="card-container">
        <h3 className="card-title">Leaderboard</h3>

        <p style={{ color: "grey" }}>
          Note: The leaderboard will reset each week. Once the leaderboard
          resets, the top 100 players will be rewarded with in-game money
          according to their rankings and everything will start over, You may
          visit the rewards page to review the latest rewards.
        </p>

        <div className="card-component">
          {loading ? (
            <p>Please wait loading data...</p>
          ) : (
            <>
              <Grid
                data={
                  topHundredResult
                    ? topHundredResult
                    : dataFromFetch
                    ? dataFromFetch
                    : null
                }
                rowRender={rowRender}
              >
                <GridColumn title="User Name" field="userName" />
                <GridColumn title="Country" field="country" />
                <GridColumn title="Money" field="gain" />
                <GridColumn title="Rank" field="rank" />
                <GridColumn title="Daily Diff" cell={CustomCell} field="diff" />
              </Grid>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

