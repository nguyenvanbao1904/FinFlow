package com.nvb.fin_flow.validator;

import com.nvb.fin_flow.enums.SystemSettingKey;
import com.nvb.fin_flow.service.SystemSettingsService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PasswordValidator implements ConstraintValidator<PasswordConstraint, String> {
    private final SystemSettingsService systemSettingsService;
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) return true;
        int min = Integer.parseInt(systemSettingsService.getSettingValue(SystemSettingKey.PASSWORD_LENGTH_MIN));
        return value.length() >= min;
    }
}
