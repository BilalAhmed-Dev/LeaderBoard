import React from "react";

import { HashRouter, Switch, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import PrizePoolTable from "./pages/PrizePoolTable.jsx";
import LoginForm from "./pages/LoginForm.jsx";
import DrawerRouterContainer from "./components/DrawerRouterContainer.jsx";
import {
  LocalizationProvider,
  loadMessages,
} from "@progress/kendo-react-intl";


import { enMessages } from "./messages/en-US";

import "hammerjs";
import "@progress/kendo-theme-default/dist/all.css";
import "./App.scss";



loadMessages(enMessages, "en-US");

const App = () => {

  return (
    <div className="App">
      <LocalizationProvider language='en-US'>
            <HashRouter>
              <DrawerRouterContainer>
                <Switch>
                  <Route exact={true} path="/" component={LoginForm} />
                  <Route
                    exact={true}
                    path="/PrizePoolTable"
                    component={PrizePoolTable}
                  />
                  <Route exact={true} path="/dashboard" component={Dashboard} />
                </Switch>
              </DrawerRouterContainer>
            </HashRouter>
      </LocalizationProvider>
    </div>
  );
};

export default App;
