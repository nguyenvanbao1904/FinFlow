package com.nvb.fin_flow.dto.request;

import com.nvb.fin_flow.validator.PasswordConstraint;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationRequest {
    String username;
    @PasswordConstraint
    String password;
}
