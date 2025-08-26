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
    console.warn("We got a rejected action!", action);

    const currentTime = Date.now();
    const errorMessage =
      action.payload || action.error?.message || "Có lỗi xảy ra";

    // Chỉ hiển thị toast nếu:
    // 1. Lỗi khác với lỗi trước đó
    // 2. Hoặc đã qua 5 giây kể từ toast cuối cùng
    const shouldShowToast =
      errorMessage !== lastErrorMessage || currentTime - lastErrorTime > 5000;

    if (shouldShowToast) {
      // Xử lý lỗi xác thực (401)
      if (action.payload === "Authentication failed") {
        toast.error("Xác thực không thành công. Vui lòng đăng nhập lại.", {
          position: "top-right",
          autoClose: 3000,
          toastId: "auth-error",
          onClose: () => {
            cookie.remove("token");
            window.location.href = "/login";
          },
        });
      } else {
        // Xử lý các lỗi khác
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          toastId: errorMessage,
        });
      }

      // Cập nhật tracking
      lastErrorTime = currentTime;
      lastErrorMessage = errorMessage;
    }
  }

  return next(action);
};
