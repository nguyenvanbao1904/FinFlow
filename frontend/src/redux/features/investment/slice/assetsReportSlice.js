import { createSlice } from "@reduxjs/toolkit";
import { fetchAssetsReport } from "../investmentThunks";

const initialState = {
  statusLoading: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  data: [],
};

const assetsReportSlice = createSlice({
  name: "investment/assetsReport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssetsReport.pending, (state) => {
        state.statusLoading = "loading";
        state.error = null;
      })
      .addCase(fetchAssetsReport.fulfilled, (state, action) => {
        state.statusLoading = "succeeded";
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchAssetsReport.rejected, (state, action) => {
        state.statusLoading = "failed";
        state.error = action.error.message;
      });
  },
});

export default assetsReportSlice.reducer;
