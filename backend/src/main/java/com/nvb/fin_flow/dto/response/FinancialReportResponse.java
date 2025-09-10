package com.nvb.fin_flow.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FinancialReportResponse {
    String id;
    BigDecimal value;
    String companyCode;
    FinancialPeriodResponse financialPeriod;
    FinancialReportTypeResponse type;
}
