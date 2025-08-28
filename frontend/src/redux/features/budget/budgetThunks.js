import { authApis, endpoints } from "../../../configs/apis";
import { createAsyncThunk } from "@reduxjs/toolkit";

const handleAuthError = (error) => {
  if (error.response?.status === 401) {
    return "Authentication failed";
  }
  return error.response?.data?.message || error.message || "An error occurred";
};

export const fetchBudgets = createAsyncThunk(
  "budgets/fetchBudgets",
  async ({ period, page }, { rejectWithValue }) => {
    try {
      const response = await authApis().get(
        `${endpoints.budgets.get}?from=${period.startDate}&to=${period.endDate}&page=${page}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);
