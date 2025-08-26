import { createSlice } from "@reduxjs/toolkit";
import { loginUser, logoutUser, outboundLogin, introspect } from "./authThunks";

const initialState = {
  user: null,
  token: null,
  statusLoading: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.statusLoading = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.statusLoading = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.statusLoading = "succeeded";
        state.error = null;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.statusLoading = "failed";
        state.error = action.payload || action.error.message || "Login failed";
      })
      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.statusLoading = "loading";
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.statusLoading = "idle";
        state.error = null;
        state.user = null;
        state.token = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.statusLoading = "failed";
        state.error = action.payload || action.error.message || "Logout failed";
      })
      // Outbound Login
      .addCase(outboundLogin.pending, (state) => {
        state.statusLoading = "loading";
        state.error = null;
      })
      .addCase(outboundLogin.fulfilled, (state, action) => {
        state.statusLoading = "succeeded";
        state.error = null;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(outboundLogin.rejected, (state, action) => {
        state.statusLoading = "failed";
        state.error =
          action.payload || action.error.message || "Outbound login failed";
      })
      // Introspect
      .addCase(introspect.pending, (state) => {
        state.statusLoading = "loading";
        state.error = null;
      })
      .addCase(introspect.fulfilled, (state, action) => {
        state.statusLoading = "succeeded";
        state.error = null;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(introspect.rejected, (state, action) => {
        state.statusLoading = "failed";
        state.error =
          action.payload || action.error.message || "Token validation failed";
      });
  },
});

export const { clearError, resetAuth } = authSlice.actions;

export default authSlice.reducer;
