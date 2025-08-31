import { createAsyncThunk } from "@reduxjs/toolkit";
import { endpoints, publicApis, authApis } from "../../../configs/apis";
import cookie from "react-cookies";

const handleAuthError = (error) => {
  // Nếu có response từ backend thì lấy message, nếu không thì lấy message mặc định
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return "Có lỗi xảy ra";
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ credentials, navigate }, { rejectWithValue }) => {
    try {
      const response = await publicApis.post(endpoints.auth.token, credentials);
      const token = response.data.data.token;

      cookie.save("token", token);

      const userResponse = await authApis().get(endpoints.users.my_info);
      const user = userResponse.data.data;

      navigate("/dashboard");

      return { token, user };
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async ({ navigate }, { rejectWithValue }) => {
    try {
      const response = await publicApis.post(endpoints.auth.logout, {
        token: cookie.load("token"),
      });

      if (response.data.code === 1000) {
        cookie.remove("token");
        navigate("/login");
        return;
      }

      throw new Error("Logout failed");
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

export const outboundLogin = createAsyncThunk(
  "auth/outboundLogin",
  async ({ authCode, navigate }, { rejectWithValue }) => {
    try {
      const response = await publicApis.post(
        `${endpoints.auth.outbound}?code=${authCode}`,
        null
      );
      const token = response.data.data.token;

      cookie.save("token", token);

      const userResponse = await authApis().get(endpoints.users.my_info);
      const user = userResponse.data.data;

      navigate("/dashboard");

      return { token, user };
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

export const introspect = createAsyncThunk(
  "auth/introspect",
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await publicApis.post(endpoints.auth.introspect, {
        token,
      });

      if (response.data.data.valid) {
        cookie.save("token", token);

        try {
          const userResponse = await authApis().get(endpoints.users.my_info);
          const user = userResponse.data.data;
          return { token, user };
        } catch (userError) {
          cookie.remove("token");
          throw userError;
        }
      } else {
        cookie.remove("token");
        throw new Error("Token is invalid");
      }
    } catch (error) {
      cookie.remove("token");
      return rejectWithValue(handleAuthError(error));
    }
  }
);
