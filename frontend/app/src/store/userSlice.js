import { createSlice } from "@reduxjs/toolkit";
const userAuth = createSlice({
  name: "UserAuth",
  initialState: {
    userId: null,
    status: null,
  },
  reducers: {
    UserIsAuthenticated(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.userId = action.payload.password;
      state.status = action.payload.item.status;
    },

    LogOutUser(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.userId = null;
    },
  },
});

export const UserAuthActions = userAuth.actions;
export default userAuth;
