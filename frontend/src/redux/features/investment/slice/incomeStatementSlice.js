import { createSlice } from "@reduxjs/toolkit";
import { fetchIncomeStatement } from "../investmentThunks";

const initialState = {
  statusLoading: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  data: [],
};
const incomeStatementSlice = createSlice({
  name: "investment/fetchIncomeStatement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomeStatement.pending, (state) => {
        state.statusLoading = "loading";
        state.error = null;
      })
      .addCase(fetchIncomeStatement.fulfilled, (state, action) => {
        state.statusLoading = "succeeded";
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchIncomeStatement.rejected, (state, action) => {
        state.statusLoading = "failed";
        state.error = action.error.message;
      });
  },
});

export default incomeStatementSlice.reducer;
