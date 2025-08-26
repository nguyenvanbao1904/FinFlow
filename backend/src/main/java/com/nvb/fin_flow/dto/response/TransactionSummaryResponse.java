package com.nvb.fin_flow.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TransactionSummaryResponse {
    private List<TimeSeriesDataResponse> timeSeriesData;
    private TotalSummaryResponse totalSummary;
}
