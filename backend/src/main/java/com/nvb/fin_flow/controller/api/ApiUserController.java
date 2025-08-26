package com.nvb.fin_flow.controller.api;

import com.nvb.fin_flow.dto.request.PasswordRequest;
import com.nvb.fin_flow.dto.request.UserCreationRequest;
import com.nvb.fin_flow.dto.response.ApiResponse;
import com.nvb.fin_flow.dto.response.UserResponse;
import com.nvb.fin_flow.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApiUserController {
    UserService userService;

    @GetMapping("/my-info")
    ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.<UserResponse>builder()
                .data(userService.getMyInfo())
                .build();
    }

    @PostMapping("/register")
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .code(201)
                .message("Create account successfully, you could use it to login")
                .data(userService.createUser(request))
                .build();
    }

    @PostMapping("create-password")
    ApiResponse<Void> createPassword(@RequestBody @Valid PasswordRequest request) {
        userService.createPassword(request);
        return ApiResponse.<Void>builder()
                .code(201)
                .message("Password has been created, you could use it to login ")
                .build();
    }
}
