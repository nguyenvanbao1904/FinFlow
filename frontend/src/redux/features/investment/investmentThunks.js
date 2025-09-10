import { authApis, endpoints } from "../../../configs/apis";
import { createAsyncThunk } from "@reduxjs/toolkit";

import dayjs from "dayjs";

const handleAuthError = (error) => {
  if (error.response?.status === 403) {
    return "Authentication failed";
  }
  return error.response?.data?.message || error.message || "An error occurred";
};

export const fetchCompanyOverview = createAsyncThunk(
  "investment/fetchCompanyOverview",
  async (_, { getState, rejectWithValue }) => {
    try {
      const code = getState().investments.symbol.selectedSymbol;
      const response = await authApis().get(
        `${endpoints.investment.company.get}/${code}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

export const fetchIndicatorValue = createAsyncThunk(
  "investment/fetchIndicatorValue",
  async ({ startDate, endDate, period }, { getState, rejectWithValue }) => {
    try {
      const code = getState().investments.symbol.selectedSymbol;
      const formattedStartDate = dayjs(startDate).format("DD/MM/YYYY");
      const formattedEndDate = dayjs(endDate).format("DD/MM/YYYY");
      const response = await authApis().get(
        `${endpoints.investment.financialReport.getIndicatorValue}?code=${code}&from=${formattedStartDate}&to=${formattedEndDate}&periodType=${period}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

export const fetchIncomeStatement = createAsyncThunk(
  "investment/fetchIncomeStatement",
  async ({ period }, { getState, rejectWithValue }) => {
    try {
      const code = getState().investments.symbol.selectedSymbol;
      const response = await authApis().get(
        `${endpoints.investment.financialReport.getIncomeStatement}?code=${code}&periodType=${period}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

export const fetchLiabilitiesAndEquity = createAsyncThunk(
  "investment/fetchLiabilitiesAndEquity",
  async ({ period }, { getState, rejectWithValue }) => {
    try {
      const code = getState().investments.symbol.selectedSymbol;
      const response = await authApis().get(
        `${endpoints.investment.financialReport.getLiabilitiesAndEquity}?code=${code}&periodType=${period}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

export const fetchAssetsReport = createAsyncThunk(
  "investment/fetchAssetsReport",
  async ({ period }, { getState, rejectWithValue }) => {
    try {
      const code = getState().investments.symbol.selectedSymbol;
      const response = await authApis().get(
        `${endpoints.investment.financialReport.getAssetsReport}?code=${code}&periodType=${period}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

export const fetchDividend = createAsyncThunk(
  "investment/fetchDividend",
  async (_, { getState, rejectWithValue }) => {
    try {
      const code = getState().investments.symbol.selectedSymbol;
      const response = await authApis().get(
        `${endpoints.investment.financialReport.getDividend}?code=${code}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

export const fetchStockShareholder = createAsyncThunk(
  "investment/fetchStockShareholder",
  async (_, { getState, rejectWithValue }) => {
    try {
      const code = getState().investments.symbol.selectedSymbol;
      const response = await authApis().get(
        `${endpoints.investment.company.getStockShareholder}?code=${code}&minPercentage=0.01`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

export const fetchBoardMember = createAsyncThunk(
  "investment/fetchBoardMember",
  async (_, { getState, rejectWithValue }) => {
    try {
      const code = getState().investments.symbol.selectedSymbol;
      const response = await authApis().get(
        `${endpoints.investment.company.getBoardMember}?code=${code}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);
