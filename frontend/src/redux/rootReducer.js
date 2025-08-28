import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./features/auth/authSlice";
import transactionsSlice from "./features/transaction/transactionSlice";
import budgetSlice from "./features/budget/budgetSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  transactions: transactionsSlice,
  budget: budgetSlice,
});

export default rootReducer;
