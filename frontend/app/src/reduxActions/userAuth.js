import { UserAuthActions } from "../store/userSlice";
import axios from "axios";
var qs = require("qs");

/// Login User
export const login = (password) => async (dispatch) => {
  var data1 = qs.stringify({
    userId: password,
  });

  var config = {
    method: "post",
    url: "http://localhost:8080/api/login",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data1,
  };
  try {
    const { data: item } = await axios(config);
    console.log(item);
    dispatch(UserAuthActions.UserIsAuthenticated({ item, password }));
  } catch (error) {
    console.log(error);
  }
};

export const logOut = (id) => async (dispatch) => {
  try {
    var data = qs.stringify({
      userId: id,
    });
    var config = {
      method: "post",
      url: "http://localhost:8080/api/logout",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };
    await axios(config);
    dispatch(UserAuthActions.LogOutUser());
  } catch (error) {
    console.log(error);
  }
};
