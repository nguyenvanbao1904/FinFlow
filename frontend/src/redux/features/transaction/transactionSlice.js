import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  fetchTransactions,
  fetchSummary,
  fetchCategoryDistribution,
} from "./transactionThunks";

dayjs.extend(customParseFormat);

// Initial state
const initialState = {
  period: {
    type: "WEEK",
    startDate: dayjs().startOf("week").format("DD/MM/YYYY"),
    endDate: dayjs().endOf("week").format("DD/MM/YYYY"),
  },
  transactions: {
    transactionResponses: [],
    totalPages: 0,
    statusLoading: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  summary: {
    timeSeriesData: [],
    totalSummary: {},
    statusLoading: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  categoryExpenseDistribution: {
    data: [],
    statusLoading: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  categoryIncomeDistribution: {
    data: [],
    statusLoading: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setPeriod: (state, action) => {
      state.period = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.transactions.statusLoading = "loading";
        state.transactions.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        const page = action.meta.arg.page;
        state.transactions.statusLoading = "succeeded";
        state.transactions.error = null;
        if (page === 1) {
          state.transactions.transactionResponses =
            action.payload.transactionResponses;
          state.transactions.totalPages = action.payload.totalPages;
        } else {
          state.transactions.transactionResponses = [
            ...state.transactions.transactionResponses,
            ...action.payload.transactionResponses,
          ];
        }
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.transactions.statusLoading = "failed";
        state.transactions.error =
          action.payload || action.error.message || "Unknown Error";
      })
      .addCase(fetchSummary.pending, (state) => {
        state.summary.statusLoading = "loading";
        state.summary.error = null;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.summary.statusLoading = "succeeded";
        state.summary.error = null;
        state.summary.timeSeriesData = action.payload.timeSeriesData;
        state.summary.totalSummary = action.payload.totalSummary;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.summary.statusLoading = "failed";
        state.summary.error =
          action.payload || action.error.message || "Unknown Error";
      })
      .addCase(fetchCategoryDistribution.pending, (state, action) => {
        const type = action.meta.arg.type;
        if (type === "EXPENSE") {
          state.categoryExpenseDistribution.statusLoading = "loading";
          state.categoryExpenseDistribution.error = null;
        } else if (type === "INCOME") {
          state.categoryIncomeDistribution.statusLoading = "loading";
          state.categoryIncomeDistribution.error = null;
        }
      })
      .addCase(fetchCategoryDistribution.fulfilled, (state, action) => {
        const type = action.meta.arg.type;
        if (type === "EXPENSE") {
          state.categoryExpenseDistribution.statusLoading = "succeeded";
          state.categoryExpenseDistribution.error = null;
          state.categoryExpenseDistribution.data = action.payload;
        } else if (type === "INCOME") {
          state.categoryIncomeDistribution.statusLoading = "succeeded";
          state.categoryIncomeDistribution.error = null;
          state.categoryIncomeDistribution.data = action.payload;
        }
      })
      .addCase(fetchCategoryDistribution.rejected, (state, action) => {
        const type = action.meta.arg.type;
        const error = action.payload || action.error.message || "Unknown Error";

        if (type === "EXPENSE") {
          state.categoryExpenseDistribution.statusLoading = "failed";
          state.categoryExpenseDistribution.error = error;
        } else if (type === "INCOME") {
          state.categoryIncomeDistribution.statusLoading = "failed";
          state.categoryIncomeDistribution.error = error;
        }
      });
  },
});

export const { setPeriod } = transactionSlice.actions;

export default transactionSlice.reducer;
