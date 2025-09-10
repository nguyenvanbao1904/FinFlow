import { createSlice } from "@reduxjs/toolkit";
import { fetchBoardMember } from "../investmentThunks";

const initialState = {
  statusLoading: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  data: [],
};

const boardMemberSlice = createSlice({
  name: "investment/boardMember",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardMember.pending, (state) => {
        state.statusLoading = "loading";
        state.error = null;
      })
      .addCase(fetchBoardMember.fulfilled, (state, action) => {
        state.statusLoading = "succeeded";
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchBoardMember.rejected, (state, action) => {
        state.statusLoading = "failed";
        state.error = action.error.message;
      });
  },
});

export default boardMemberSlice.reducer;
