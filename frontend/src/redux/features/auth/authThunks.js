import { login, getUser, logout } from "./authSlice";
import { endpoints, publicApis, authApis } from "../../../configs/apis";
import cookie from "react-cookies";

export const loginUser = (credentials, navigate) => async (dispatch) => {
  try {
    let response = await publicApis.post(endpoints.auth.token, credentials);

    dispatch(login({ token: response.data.data.token }));
    cookie.save("token", response.data.data.token);

    let userResponse = await authApis().get(endpoints.users.my_info);
    dispatch(getUser({ user: userResponse.data.data }));
    navigate("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
  }
};

export const logoutUser = (navigate) => async (dispatch) => {
  try {
    let response = await publicApis.post(endpoints.auth.logout, {
      token: cookie.load("token"),
    });
    console.log("Logout response:", response.data.code);
    if (response.data.code === 1000) {
      console.log("Logout successful");
      dispatch(logout());
      cookie.remove("token");
      navigate("/login");
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const outboundLogin = (authCode, navigate) => async (dispatch) => {
  try {
    let response = await publicApis.post(
      `${endpoints.auth.outbound}?code=${authCode}`,
      null
    );
    dispatch(login({ token: response.data.data.token }));
    cookie.save("token", response.data.data.token);

    let userResponse = await authApis().get(endpoints.users.my_info);
    dispatch(getUser({ user: userResponse.data.data }));
    navigate("/dashboard");
  } catch (error) {
    console.error("Outbound login error:", error);
  }
};

export const introspect = (token) => async (dispatch) => {
  try {
    let response = await publicApis.post(endpoints.auth.introspect, { token });
    if (response.data.data.valid) {
      dispatch(login({ token }));
      cookie.save("token", token);
      try {
        let userResponse = await authApis().get(endpoints.users.my_info);
        dispatch(getUser({ user: userResponse.data.data }));
      } catch (userError) {
        console.error("Failed to fetch user info:", userError);
      }
    } else {
      console.error("Token introspection failed: Token is invalid");
      cookie.remove("token");
    }
  } catch (error) {
    console.error("Introspection error");
    cookie.remove("token");
  }
};
