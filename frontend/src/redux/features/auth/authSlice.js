import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    getUser: (state, action) => {
        state.user = action.payload.user;
    }
  },
});

export const { login, logout, getUser } = authSlice.actions;

export default authSlice.reducer;
