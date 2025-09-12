package com.nvb.fin_flow.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BudgetResponse {
    String id;
    BigDecimal amountLimit;
    LocalDate startDate;
    LocalDate endDate;
    CategoryResponse category;
    @Builder.Default
    Boolean isRecurring = false;
    BigDecimal amountSpent;
}
