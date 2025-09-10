import { createSlice } from "@reduxjs/toolkit";
import { fetchCompanyOverview } from "../investmentThunks";

const initialState = {
  statusLoading: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  data: {},
};
const companyOverviewSlice = createSlice({
  name: "investment/companyOverview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyOverview.pending, (state) => {
        state.statusLoading = "loading";
        state.error = null;
      })
      .addCase(fetchCompanyOverview.fulfilled, (state, action) => {
        state.statusLoading = "succeeded";
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchCompanyOverview.rejected, (state, action) => {
        state.statusLoading = "failed";
        state.error = action.error.message;
      });
  },
});

export default companyOverviewSlice.reducer;
