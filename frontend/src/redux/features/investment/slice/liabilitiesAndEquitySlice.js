import { createSlice } from "@reduxjs/toolkit";
import { fetchLiabilitiesAndEquity } from "../investmentThunks";

const initialState = {
  statusLoading: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  data: [], // Đổi từ {} thành [] để đảm bảo data luôn là một mảng
};
const liabilitiesAndEquitySlice = createSlice({
  name: "investment/liabilitiesAndEquity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiabilitiesAndEquity.pending, (state) => {
        state.statusLoading = "loading";
        state.error = null;
      })
      .addCase(fetchLiabilitiesAndEquity.fulfilled, (state, action) => {
        state.statusLoading = "succeeded";
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchLiabilitiesAndEquity.rejected, (state, action) => {
        state.statusLoading = "failed";
        state.error = action.error.message;
      });
  },
});

export default liabilitiesAndEquitySlice.reducer;
