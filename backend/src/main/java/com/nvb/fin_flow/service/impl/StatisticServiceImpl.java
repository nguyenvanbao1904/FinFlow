package com.nvb.fin_flow.service.impl;

import com.nvb.fin_flow.dto.response.CategoryDistribution;
import com.nvb.fin_flow.dto.response.TimeSeriesDataResponse;
import com.nvb.fin_flow.dto.response.TotalSummaryResponse;
import com.nvb.fin_flow.dto.response.TransactionSummaryResponse;
import com.nvb.fin_flow.enums.CategoryType;
import com.nvb.fin_flow.exception.AppException;
import com.nvb.fin_flow.exception.ErrorCode;
import com.nvb.fin_flow.repository.StatisticRepository;
import com.nvb.fin_flow.service.StatisticService;
import com.nvb.fin_flow.utilities.DateUtility;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
@Slf4j
public class StatisticServiceImpl implements StatisticService {
    StatisticRepository statisticRepository;
    DateUtility dateUtility;

    @Override
    public TransactionSummaryResponse getTransactionSummary(Map<String, String> params) {
        String username = params.get("username");
        String period = params.get("period");
        String from = params.get("from");
        String to = params.get("to");

        if (username == null || period == null || from == null || to == null) {
            throw new AppException(ErrorCode.PARAMS_INVALID);
        }

        LocalDate startDate = dateUtility.convertDate(from);
        LocalDate endDate = dateUtility.convertDate(to);

        TotalSummaryResponse totalSummary = statisticRepository.getTotalSummary(username, startDate, endDate);
        List<TimeSeriesDataResponse> timeSeriesData = statisticRepository.getTimeSeriesData(username, period, startDate, endDate);

        return TransactionSummaryResponse.builder().totalSummary(totalSummary).timeSeriesData(timeSeriesData).build();
    }

    @Override
    public List<CategoryDistribution> getCategoryDistribution(Map<String, String> params) {
        String username = params.get("username");
        String from = params.get("from");
        String to = params.get("to");
        String type = params.get("type");

        if (username == null || from == null || to == null) {
            throw new AppException(ErrorCode.PARAMS_INVALID);
        }

        CategoryType categoryType;
        try {
            categoryType = CategoryType.valueOf(type);
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.PARAMS_INVALID);
        }

        LocalDate startDate = dateUtility.convertDate(from);
        LocalDate endDate = dateUtility.convertDate(to);

        return statisticRepository.getCategoryDistribution(username, startDate, endDate, categoryType);
    }
}