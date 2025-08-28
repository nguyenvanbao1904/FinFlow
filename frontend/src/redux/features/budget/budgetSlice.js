import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { fetchBudgets } from "./budgetThunks";

const initialState = {
  period: {
    type: "WEEK",
    startDate: dayjs().startOf("week").format("DD/MM/YYYY"),
    endDate: dayjs().endOf("week").format("DD/MM/YYYY"),
  },
  budgets: {
    budgetResponses: [],
    totalPages: 0,
    statusLoading: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  summary: {
    totalBudgetLimit: 0,
    totalAmountSpent: 0,
    totalRemainingAmount: 0,
  },
};

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    setPeriod: (state, action) => {
      state.period = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.budgets.statusLoading = "loading";
        state.budgets.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        const page = action.meta.arg.page;
        state.budgets.statusLoading = "succeeded";
        state.budgets.error = null;
        if (page === 1) {
          state.budgets.budgetResponses = action.payload.budgetResponses;
          state.budgets.totalPages = action.payload.totalPages;
        } else {
          state.budgets.budgetResponses = [
            ...state.budgets.budgetResponses,
            ...action.payload.budgetResponses,
          ];
        }

        // Calculate summary
        const totalBudgetLimit = state.budgets.budgetResponses.reduce(
          (sum, budget) => sum + budget.amountLimit,
          0
        );
        const totalAmountSpent = state.budgets.budgetResponses.reduce(
          (sum, budget) => sum + budget.amountSpent,
          0
        );
        state.summary.totalBudgetLimit = totalBudgetLimit;
        state.summary.totalAmountSpent = totalAmountSpent;
        state.summary.totalRemainingAmount =
          totalBudgetLimit - totalAmountSpent;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.budgets.statusLoading = "failed";
        state.budgets.error = action.payload || action.error.message;
      });
  },
});

export const { setPeriod } = budgetSlice.actions;

export default budgetSlice.reducer;
