import { createSlice } from "@reduxjs/toolkit";
import { fetchIndicatorValue } from "../investmentThunks";

const initialState = {
  statusLoading: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  data: [],
};
const indicatorValueSlice = createSlice({
  name: "investment/indicatorValue",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndicatorValue.pending, (state) => {
        state.statusLoading = "loading";
        state.error = null;
      })
      .addCase(fetchIndicatorValue.fulfilled, (state, action) => {
        state.statusLoading = "succeeded";
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchIndicatorValue.rejected, (state, action) => {
        state.statusLoading = "failed";
        state.error = action.error.message;
      });
  },
});

export default indicatorValueSlice.reducer;
