package com.nvb.fin_flow.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String username;
    String firstName;
    String lastName;
    LocalDate dob;
    Boolean noPassword;
    Set<RoleResponse> roles;
    @JsonFormat(pattern = "dd/MM/yyyy")
    LocalDateTime registerDate;
    @JsonFormat(pattern = "dd/MM/yyyy")
    LocalDateTime lastLogin;
    Boolean isActive;
    String email;
    Boolean accountVerified;
}