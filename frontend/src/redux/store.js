import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { errorHandlingMiddleware } from "./middleware/errorMiddleware";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(errorHandlingMiddleware),
});

export default store;

/**
 * @typedef {typeof store.dispatch} AppDispatch
 */
