import * as React from "react";
import * as PropTypes from "prop-types";

import { useLocalization } from "@progress/kendo-react-intl";
import { useSelector } from "react-redux";
import { AppContext } from "./../AppContext";

import headerBg from "../assets/header-bg.png";

export const Header = (props) => {
  const { onButtonClick } = props;
  const { status, userId } = useSelector((state) => state.userAuth);

  const { avatar, localeId, onLanguageChange } = React.useContext(AppContext);
  const localizationService = useLocalization();

  const imgRef = React.useRef(null);
  const hasImage = avatar && avatar.length > 0;

  React.useEffect(() => {
    if (hasImage) {
      var reader = new FileReader();

      reader.onload = function (e) {
        imgRef.current.setAttribute("src", e.target.result);
      };

      reader.readAsDataURL(avatar[0].getRawFile());
    }
  }, [avatar, hasImage]);

  return (
    <header className="header" style={{ backgroundImage: `url(${headerBg})` }}>
      <div className="nav-container">
        <div className="menu-button">
          <span className={"k-icon k-i-menu"} onClick={onButtonClick} />
        </div>

        <div className="title">
          <h1>LeaderBoard</h1>
        </div>
      </div>
    </header>
  );
};

Header.displayName = "Header";
Header.propTypes = {
  page: PropTypes.string,
  onButtonClick: PropTypes.func,
};
