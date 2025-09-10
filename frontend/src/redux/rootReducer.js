import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./features/auth/authSlice";
import transactionsSlice from "./features/transaction/transactionSlice";
import budgetSlice from "./features/budget/budgetSlice";
import otpSlice from "./features/otp/otpSlice";
import investmentReducer from "./features/investment/investmentReducer";
const rootReducer = combineReducers({
  auth: authSlice,
  transactions: transactionsSlice,
  budget: budgetSlice,
  otp: otpSlice,
  investments: investmentReducer,
});

export default rootReducer;
