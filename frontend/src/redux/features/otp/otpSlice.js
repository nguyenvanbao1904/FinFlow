import { createSlice } from "@reduxjs/toolkit";
import { sendOtp, verifyOtp } from "./otpThunks";

const initialState = {
  statusLoading: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  verified: false,
};

const otpSlice = createSlice({
  name: "otp",
  initialState,
  reducers: {
    resetOtp: (state) => {
      state.statusLoading = "idle";
      state.error = null;
      state.verified = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.statusLoading = "loading";
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.statusLoading = "succeeded";
        state.error = null;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.statusLoading = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.statusLoading = "loading";
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.statusLoading = "succeeded";
        state.error = null;
        state.verified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.statusLoading = "failed";
        state.error = action.payload || action.error.message;
        state.verified = false;
      });
  },
});

export const { resetOtp } = otpSlice.actions;
export default otpSlice.reducer;
