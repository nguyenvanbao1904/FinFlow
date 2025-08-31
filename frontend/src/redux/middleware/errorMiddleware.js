import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import cookie from "react-cookies";

let lastErrorTime = 0;
let lastErrorMessage = "";

/**
 * Middleware để xử lý lỗi từ async thunks
 */
export const errorHandlingMiddleware = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const currentTime = Date.now();

    // Lấy thông tin lỗi từ payload (ưu tiên object có code/message)
    let errorCode, errorMessage;
    if (typeof action.payload === "object" && action.payload !== null) {
      errorCode = action.payload.code;
      errorMessage = action.payload.message || "Có lỗi xảy ra";
    } else {
      errorCode = null;
      errorMessage = action.payload || action.error?.message || "Có lỗi xảy ra";
    }

    const shouldShowToast =
      errorMessage !== lastErrorMessage || currentTime - lastErrorTime > 5000;

    if (shouldShowToast) {
      if (
        errorCode === 401 || // Unauthorized
        errorCode === 403 || // Forbidden
        errorMessage.toLowerCase().includes("authentication failed") ||
        errorMessage.toLowerCase().includes("account locked") ||
        errorMessage.toLowerCase().includes("unauthenticated")
      ) {
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          toastId: "auth-error",
          onClose: () => {
            cookie.remove("token");
            window.location.href = "/login";
          },
        });
      } else {
        // Các lỗi khác chỉ hiển thị toast
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          toastId: errorMessage,
        });
      }

      lastErrorTime = currentTime;
      lastErrorMessage = errorMessage;
    }
  }

  return next(action);
};
