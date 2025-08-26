package com.nvb.fin_flow.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    UNAUTHENTICATED(1001, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    ENTITY_NOT_EXISTED(1002, "{entity} not existed", HttpStatus.NOT_FOUND),
    USER_EXISTED(1003, "User already existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1004, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1005, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_DOB(1006, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    INVALID_REFERENCE(1007, "{entity} is invalid or does not exist", HttpStatus.BAD_REQUEST),
    SQL_EXCEPTION(1008, "{ms}", HttpStatus.BAD_REQUEST),
    PARAMS_INVALID(1009, "Params invalid", HttpStatus.BAD_REQUEST),
    INVALID_DATE_FORMAT(10010, "Invalid date format", HttpStatus.BAD_REQUEST),
    DO_NOT_HAVE_PERMISSION(10011, "Do not have permission", HttpStatus.FORBIDDEN),
    PASSWORD_EXISTED(10012, "Password already existed", HttpStatus.BAD_REQUEST),

    INVALID_KEY(9999, "Invalid key", HttpStatus.BAD_REQUEST),
    ;

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
