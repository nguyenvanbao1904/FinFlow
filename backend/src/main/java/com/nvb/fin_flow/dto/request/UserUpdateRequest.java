package com.nvb.fin_flow.dto.request;

import java.time.LocalDate;
import java.util.List;

import com.nvb.fin_flow.validator.DobConstraint;
import com.nvb.fin_flow.validator.PasswordConstraint;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    @PasswordConstraint
    String password;
    String firstName;
    String lastName;

    @DobConstraint(min = 10, message = "INVALID_DOB")
    LocalDate dob;

    List<String> roles;
}