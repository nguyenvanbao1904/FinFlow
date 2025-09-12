package com.nvb.fin_flow.controller.api;

import com.nimbusds.jose.JOSEException;
import com.nvb.fin_flow.dto.request.*;
import com.nvb.fin_flow.dto.response.ApiResponse;
import com.nvb.fin_flow.dto.response.AuthenticationResponse;
import com.nvb.fin_flow.dto.response.IntrospectResponse;
import com.nvb.fin_flow.dto.response.OtpResponse;
import com.nvb.fin_flow.service.AuthenticationService;
import com.nvb.fin_flow.service.EmailService;
import com.nvb.fin_flow.service.OtpService;
import com.nvb.fin_flow.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.Random;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApiAuthenticationController {
    AuthenticationService authenticationService;
    OtpService otpService;
    UserService userService;
    EmailService emailService;

    @PostMapping("/token")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder().data(result).build();
    }

    @PostMapping("/refresh-token")
    ApiResponse<AuthenticationResponse> refreshToken(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(request);
        return ApiResponse.<AuthenticationResponse>builder().code(200).data(result).build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder().data(result).build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder().code(1000).build();
    }

    @PostMapping("/outbound/authentication")
    ApiResponse<AuthenticationResponse> outboundAuthenticate(
            @RequestParam("code") String code
    ){
        var result = authenticationService.outboundAuthenticate(code);
        return ApiResponse.<AuthenticationResponse>builder().data(result).build();
    }

    @PostMapping("/send-otp")
    public ApiResponse<OtpResponse> sendOtp(@Valid @RequestBody OtpSendRequest request) {
        String email = request.getEmail();
        String otp = String.valueOf(100000 + new Random().nextInt(900000));
        otpService.saveOtp(email, otp);
        emailService.sendOtpEmail(email, otp);
        return ApiResponse.<OtpResponse>builder()
                .data(OtpResponse.builder().message("OTP đã gửi").build())
                .build();
    }

    @PostMapping("/verify-otp")
    public ApiResponse<OtpResponse> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        String email = request.getEmail();
        String otp = request.getOtp();
        String storedOtp = otpService.getOtp(email);

        if (storedOtp != null && storedOtp.equals(otp)) {
            userService.verifyUserEmail(email);
            otpService.deleteOtp(email);
            return ApiResponse.<OtpResponse>builder()
                    .data(OtpResponse.builder().message("Xác thực thành công").build())
                    .build();
        }
        return ApiResponse.<OtpResponse>builder()
                .code(400)
                .message("OTP sai hoặc hết hạn")
                .build();
    }
}
