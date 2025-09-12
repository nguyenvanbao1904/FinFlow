import axios from "axios";
import cookie from "react-cookies";
import { decodeJwt } from "jose";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const endpoints = {
  auth: {
    token: "/auth/token",
    logout: "/auth/logout",
    outbound: "/auth/outbound/authentication",
    introspect: "/auth/introspect",
    sendOtp: "/auth/send-otp",
    verifyOtp: "/auth/verify-otp",
    refreshToken: "/auth/refresh-token",
  },
  users: {
    my_info: "/users/my-info",
    register: "/users/register",
    create_password: "/users/create-password",
  },
  categories: {
    get: "/categories",
    create: "/categories",
  },
  transactions: {
    get: "/transactions",
    create: "/transactions",
    summary: "/transactions/summary",
    delete: "/transactions",
  },
  statistics: {
    summary_transaction: "/statistics/summary-transaction",
    category_distribution: "/statistics/category-distribution",
  },
  icons: {
    get: "/icons",
  },
  budgets: {
    get: "/budgets",
    create: "/budgets",
    delete: "/budgets",
  },
  investment: {
    company: {
      get: "/investment/company",
      getStockShareholder: "/investment/company/stock-share-holder",
      getBoardMember: "/investment/company/board-member",
    },
    financialReport: {
      getIndicatorValue: "/investment/financial-report/indicator-value",
      getIncomeStatement: "/investment/financial-report/income-statement",
      getLiabilitiesAndEquity:
        "/investment/financial-report/liabilities-and-equity",
      getAssetsReport: "/investment/financial-report/assets-report",
      getDividend: "/investment/financial-report/dividend",
    },
  },
};

const authInstance = axios.create({
  baseURL: BASE_URL,
});

authInstance.interceptors.request.use(async (config) => {
  let token = cookie.load("token");

  if (!token) {
    window.location.href = "/login";
    return config;
  }

  try {
    const payload = decodeJwt(token);
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp - now < 900) {
      try {
        console.log("Refreshing token...");

        const res = await axios.post(
          `${BASE_URL}${endpoints.auth.refreshToken}`,
          { token }
        );
        const newToken = res.data.data.token;
        cookie.save("token", newToken);
        config.headers["Authorization"] = `Bearer ${newToken}`;
      } catch (err) {
        console.error("Refresh token failed", err);
        window.location.href = "/login";
      }
    } else {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (err) {
    console.error("Token decode failed", err);
    window.location.href = "/login";
  }

  return config;
});

export const authApis = () => authInstance;

export const publicApis = axios.create({
  baseURL: BASE_URL,
});
