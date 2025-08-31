package com.nvb.fin_flow.service;

import com.nvb.fin_flow.dto.request.PasswordRequest;
import com.nvb.fin_flow.dto.request.UserCreationRequest;
import com.nvb.fin_flow.dto.response.UserMonthlyStatResponse;
import com.nvb.fin_flow.dto.response.UserPageableResponse;
import com.nvb.fin_flow.dto.response.UserResponse;
import com.nvb.fin_flow.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface UserService extends UserDetailsService {
    UserResponse getMyInfo();
    UserResponse createUser(UserCreationRequest request);
    User getCurrentUser();
    void createPassword(PasswordRequest passwordRequest);
    long getTotalUser();
    long getTotalUserByRegisterDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    long getTotalUserByLastLoginBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<UserMonthlyStatResponse> getNewUsersByMonth(int year);
    UserPageableResponse getUsers(Map<String, String> params);
    void toggleStatus(String userId);
    void verifyUserEmail(String email);
}
