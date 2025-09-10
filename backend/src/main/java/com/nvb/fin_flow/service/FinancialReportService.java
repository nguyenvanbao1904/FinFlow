package com.nvb.fin_flow.service;

import com.nvb.fin_flow.dto.response.DividendResponse;
import com.nvb.fin_flow.dto.response.FinancialReportResponse;

import java.util.List;
import java.util.Map;

public interface FinancialReportService {
    List<FinancialReportResponse> getIndicatorValues(Map<String, String> params);
    List<FinancialReportResponse> getIncomeStatements(Map<String, String> params);
    List<FinancialReportResponse> getLiabilitiesAndEquityReports(Map<String, String> params);
    List<FinancialReportResponse> getAssetsReports(Map<String, String> params);
    List<DividendResponse> getDividends(Map<String, String> params);
}
