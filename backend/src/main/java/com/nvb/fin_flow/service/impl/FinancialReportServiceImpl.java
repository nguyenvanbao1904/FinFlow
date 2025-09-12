package com.nvb.fin_flow.service.impl;

import com.nvb.fin_flow.dto.response.DividendResponse;
import com.nvb.fin_flow.dto.response.FinancialReportResponse;
import com.nvb.fin_flow.exception.AppException;
import com.nvb.fin_flow.exception.ErrorCode;
import com.nvb.fin_flow.repository.FinancialReportRepository;
import com.nvb.fin_flow.service.FinancialReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FinancialReportServiceImpl implements FinancialReportService {

    private final FinancialReportRepository financialReportRepository;

    @Override
    @Cacheable(value = "indicatorValues", key = "#params['code']")
    public List<FinancialReportResponse> getIndicatorValues(Map<String, String> params) {
        validateCode(params);
        return financialReportRepository.getIndicatorValues(params);
    }

    @Override
    @Cacheable(value = "incomeStatements", key = "#params['code']")
    public List<FinancialReportResponse> getIncomeStatements(Map<String, String> params) {
        validateCode(params);
        return financialReportRepository.getIncomeStatements(params);
    }

    @Override
    @Cacheable(value = "liabilitiesAndEquityReports", key = "#params['code']")
    public List<FinancialReportResponse> getLiabilitiesAndEquityReports(Map<String, String> params) {
        validateCode(params);
        return financialReportRepository.getLiabilitiesAndEquityReports(params);
    }

    @Override
    @Cacheable(value = "assetsReports", key = "#params['code']")
    public List<FinancialReportResponse> getAssetsReports(Map<String, String> params) {
        validateCode(params);
        return financialReportRepository.getAssetsReports(params);
    }

    @Override
    @Cacheable(value = "dividends", key = "#params['code']")
    public List<DividendResponse> getDividends(Map<String, String> params) {
        validateCode(params);
        return financialReportRepository.getDividends(params);
    }

    private void validateCode(Map<String, String> params) {
        if (!StringUtils.hasText(params.get("code"))) {
            throw new AppException(ErrorCode.PARAMS_INVALID);
        }
    }
}
