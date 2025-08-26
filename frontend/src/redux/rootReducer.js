import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./features/auth/authSlice";
import transactionsSlice from "./features/transaction/transactionSlice";
const rootReducer = combineReducers({
  auth: authSlice,
  transactions: transactionsSlice,
});

export default rootReducer;
