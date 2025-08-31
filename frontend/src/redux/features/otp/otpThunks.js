import { createAsyncThunk } from "@reduxjs/toolkit";
import { endpoints, authApis } from "../../../configs/apis";

export const sendOtp = createAsyncThunk(
  "otp/sendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await authApis().post(endpoints.auth.sendOtp, { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Gửi OTP thất bại"
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "otp/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await authApis().post(endpoints.auth.verifyOtp, {
        email,
        otp,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Xác thực OTP thất bại"
      );
    }
  }
);
