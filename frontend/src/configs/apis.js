import axios from "axios";
import cookie from "react-cookies";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const endpoints = {
  auth: {
    token: "/auth/token",
    logout: "/auth/logout",
    outbound: "/auth/outbound/authentication",
    introspect: "/auth/introspect",
    sendOtp: "/auth/send-otp",
    verifyOtp: "/auth/verify-otp",
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

export const authApis = () => {
  let token = cookie.load("token");

  if (!token) {
    window.location.href = "/login";
    return;
  }
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const publicApis = axios.create({
  baseURL: BASE_URL,
});
