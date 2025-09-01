package com.nvb.fin_flow.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({FIELD})
@Retention(RUNTIME)
@Constraint(validatedBy = {PasswordValidator.class})
public @interface PasswordConstraint {
    String message() default "INVALID_PASSWORD";
    int min() default 0;
    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
