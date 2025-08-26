package com.nvb.fin_flow.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TimeSeriesDataResponse {
    private String period;
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal saving;
}
