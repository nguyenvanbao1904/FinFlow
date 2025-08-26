package com.nvb.fin_flow.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TotalSummaryResponse {
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal saving;
    private BigDecimal balance;
}
