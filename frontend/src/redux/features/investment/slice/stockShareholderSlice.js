import { createSlice } from "@reduxjs/toolkit";
import { fetchStockShareholder } from "../investmentThunks";

const initialState = {
  statusLoading: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  data: [],
};

const stockShareholderSlice = createSlice({
  name: "investment/stockShareholder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockShareholder.pending, (state) => {
        state.statusLoading = "loading";
        state.error = null;
      })
      .addCase(fetchStockShareholder.fulfilled, (state, action) => {
        state.statusLoading = "succeeded";
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchStockShareholder.rejected, (state, action) => {
        state.statusLoading = "failed";
        state.error = action.error.message;
      });
  },
});

export default stockShareholderSlice.reducer;
