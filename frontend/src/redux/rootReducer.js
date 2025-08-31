import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./features/auth/authSlice";
import transactionsSlice from "./features/transaction/transactionSlice";
import budgetSlice from "./features/budget/budgetSlice";
import otpSlice from "./features/otp/otpSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  transactions: transactionsSlice,
  budget: budgetSlice,
  otp: otpSlice,
});

export default rootReducer;
