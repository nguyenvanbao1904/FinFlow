package com.nvb.fin_flow.repository;

import com.nvb.fin_flow.dto.response.CategoryDistribution;
import com.nvb.fin_flow.dto.response.TimeSeriesDataResponse;
import com.nvb.fin_flow.dto.response.TotalSummaryResponse;
import com.nvb.fin_flow.enums.CategoryType;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StatisticRepository {
    TotalSummaryResponse getTotalSummary(String username, LocalDate startDate, LocalDate endDate);
    List<TimeSeriesDataResponse> getTimeSeriesData(String username, String period, LocalDate startDate, LocalDate endDate);
    List<CategoryDistribution> getCategoryDistribution(String username, LocalDate startDate, LocalDate endDate, CategoryType categoryType);
}