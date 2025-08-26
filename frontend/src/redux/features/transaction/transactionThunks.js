import { authApis, endpoints } from "../../../configs/apis";
import { createAsyncThunk } from "@reduxjs/toolkit";

const handleAuthError = (error) => {
  if (error.response?.status === 401) {
    return "Authentication failed";
  }
  return error.response?.data?.message || error.message || "An error occurred";
};

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async ({ period, page }, { rejectWithValue }) => {
    try {
      const response = await authApis().get(
        `${endpoints.transactions.get}?from=${period.startDate}&to=${period.endDate}&sort=date,desc&page=${page}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

export const fetchSummary = createAsyncThunk(
  "transactions/fetchSummary",
  async ({ period }, { rejectWithValue }) => {
    try {
      const response = await authApis().get(
        `${endpoints.statistics.summary_transaction}?from=${period.startDate}&to=${period.endDate}&period=${period.type}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

export const fetchCategoryDistribution = createAsyncThunk(
  "transactions/fetchCategoryDistribution",
  async ({ period, type }, { rejectWithValue }) => {
    try {
      const response = await authApis().get(
        `${endpoints.statistics.category_distribution}?from=${period.startDate}&to=${period.endDate}&type=${type}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);
