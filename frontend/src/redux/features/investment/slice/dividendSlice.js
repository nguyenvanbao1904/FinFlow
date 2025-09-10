import { createSlice } from "@reduxjs/toolkit";
import { fetchDividend } from "../investmentThunks";

const initialState = {
  statusLoading: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  data: [],
};

const dividendSlice = createSlice({
  name: "investment/dividend",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDividend.pending, (state) => {
        state.statusLoading = "loading";
        state.error = null;
      })
      .addCase(fetchDividend.fulfilled, (state, action) => {
        state.statusLoading = "succeeded";
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchDividend.rejected, (state, action) => {
        state.statusLoading = "failed";
        state.error = action.error.message;
      });
  },
});

export default dividendSlice.reducer;
