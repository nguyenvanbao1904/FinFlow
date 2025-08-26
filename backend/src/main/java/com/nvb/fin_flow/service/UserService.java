package com.nvb.fin_flow.service;

import com.nvb.fin_flow.dto.request.PasswordRequest;
import com.nvb.fin_flow.dto.request.UserCreationRequest;
import com.nvb.fin_flow.dto.response.UserResponse;
import com.nvb.fin_flow.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    UserResponse getMyInfo();
    UserResponse createUser(UserCreationRequest request);
    User getCurrentUser();
    void createPassword(PasswordRequest passwordRequest);
}
