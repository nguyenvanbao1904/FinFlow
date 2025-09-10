package com.nvb.fin_flow.enums;

public enum FinancialPeriodType {
    YEARLY, QUARTERLY;

    public static FinancialPeriodType fromString(String value) {
        if (value == null) return QUARTERLY;
        try {
            return FinancialPeriodType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return QUARTERLY;
        }
    }
}
