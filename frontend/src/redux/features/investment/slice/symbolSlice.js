import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedSymbol: "ACB",
};

const symbolSlice = createSlice({
  name: "symbol",
  initialState,
  reducers: {
    setSymbol: (state, action) => {
      state.selectedSymbol = action.payload;
    },
  },
});

export const { setSymbol } = symbolSlice.actions;

export default symbolSlice.reducer;
