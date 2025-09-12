package com.nvb.fin_flow.utilities;

import com.nvb.fin_flow.enums.RecurringType;
import com.nvb.fin_flow.exception.AppException;
import com.nvb.fin_flow.exception.ErrorCode;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Component
public class DateUtility {
    public LocalDate convertDate(String date){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        try {
            return LocalDate.parse(date, formatter);
        } catch (DateTimeParseException e) {
            throw new AppException(ErrorCode.INVALID_DATE_FORMAT);
        }
    }
    public int getQuarter(LocalDate date) {
        return (date.getMonthValue() - 1) / 3 + 1;
    }
    public static LocalDate calculateEndDate(LocalDate startDate, RecurringType recurringType) {
        return switch (recurringType) {
            case WEEKLY -> startDate.plusWeeks(1).minusDays(1);
            case MONTHLY -> startDate.plusMonths(1).minusDays(1);
            case YEARLY -> startDate.plusYears(1).minusDays(1);
        };
    }

    public static LocalDate calculateNextRecurrenceDate(LocalDate startDate, RecurringType recurringType) {
        return switch (recurringType) {
            case WEEKLY -> startDate.plusWeeks(1);
            case MONTHLY -> startDate.plusMonths(1);
            case YEARLY -> startDate.plusYears(1);
        };
    }
}
