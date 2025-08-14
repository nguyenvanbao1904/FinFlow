package com.nvb.fin_flow.exception;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class AppException extends RuntimeException {
    private ErrorCode errorCode;

    public AppException(ErrorCode errorCode){
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public AppException(ErrorCode errorCode, Map<String, String> params){
        super(formatMessage(errorCode.getMessage(), params));
        this.errorCode = errorCode;
    }

    private static String formatMessage(String message, Map<String, String> params) {
        if (params != null) {
            for (Map.Entry<String, String> entry : params.entrySet()) {
                message = message.replace(
                        "{" + entry.getKey() + "}",
                        entry.getValue()
                );
            }
        }
        return message;
    }
}
