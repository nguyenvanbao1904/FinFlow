package com.nvb.fin_flow.service;

import com.nvb.fin_flow.dto.response.CategoryDistribution;
import com.nvb.fin_flow.dto.response.TransactionSummaryResponse;

import java.util.List;
import java.util.Map;

public interface StatisticService {
    TransactionSummaryResponse getTransactionSummary(Map<String, String> params);
    List<CategoryDistribution> getCategoryDistribution(Map<String, String> params);
}
