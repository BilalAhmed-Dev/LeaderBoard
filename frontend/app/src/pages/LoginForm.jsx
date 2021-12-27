import * as React from "react";

import { KendoForm } from "../components/KendoForm/MyInputs";

import github from "../assets/github-icon.svg";

const LoginForm = () => {
  return (
    <div id="Info" className="info-page main-content">
      <div className="content">
        <div className="section-1">
          <h1>PANTEON Games</h1>
          <h2>Please enter your User Id</h2>
          <div className="button-group">
            <KendoForm />
          </div>

          <a
            className="github-link"
            href="https://github.com/BilalAhmed-Dev/FullStack-Leaderboad-Challenge.git"
          >
            <img src={github} alt="github icon" />
            <span className="github-text">Get the source code on GitHub</span>
          </a>
        </div>
        <div className="section-2">
          <p>
            This is a demo leaderboard application built using React 17 and the
            KendoReact components
          </p>
        </div>
      </div>
      <div className="footer" />
    </div>
  );
};

export default LoginForm;
