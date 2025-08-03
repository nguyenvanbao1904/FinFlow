import { combineReducers } from "@reduxjs/toolkit";
import authSlice from './features/auth/authSlice';
const rootReducer = combineReducers({
  auth: authSlice,
});

export default rootReducer;
