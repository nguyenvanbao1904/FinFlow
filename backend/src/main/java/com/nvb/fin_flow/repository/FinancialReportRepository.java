package com.nvb.fin_flow.repository;

import com.nvb.fin_flow.dto.response.DividendResponse;
import com.nvb.fin_flow.dto.response.FinancialReportResponse;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;


public interface FinancialReportRepository {
    List<FinancialReportResponse> getIndicatorValues(Map<String, String> params);
    List<FinancialReportResponse> getIncomeStatements(Map<String, String> params);
    List<FinancialReportResponse> getLiabilitiesAndEquityReports(Map<String, String> params);
    List<FinancialReportResponse> getAssetsReports(Map<String, String> params);
    List<DividendResponse> getDividends(Map<String, String> params);
}
