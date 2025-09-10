package com.nvb.fin_flow.controller.api;

import com.nvb.fin_flow.dto.response.ApiResponse;
import com.nvb.fin_flow.dto.response.DividendResponse;
import com.nvb.fin_flow.dto.response.FinancialReportResponse;
import com.nvb.fin_flow.service.FinancialReportService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/investment/financial-report")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApiFinancialReportController {
    FinancialReportService financialReportService;
    @GetMapping("/indicator-value")
    public ApiResponse<List<FinancialReportResponse>> getIndicatorValues(@RequestParam Map<String, String> params) {
        return ApiResponse.<List<FinancialReportResponse>>builder()
                .code(200)
                .message("Get indicator value success")
                .data(financialReportService.getIndicatorValues(params))
                .build();
    }
    @GetMapping("/income-statement")
    public ApiResponse<List<FinancialReportResponse>> getIncomeStatements(@RequestParam Map<String, String> params) {
        return ApiResponse.<List<FinancialReportResponse>>builder()
                .code(200)
                .message("Get income statement success")
                .data(financialReportService.getIncomeStatements(params))
                .build();
    }
    @GetMapping("/liabilities-and-equity")
    public ApiResponse<List<FinancialReportResponse>> getLiabilitiesAndEquityReports(@RequestParam Map<String, String> params) {
        return ApiResponse.<List<FinancialReportResponse>>builder()
                .code(200)
                .message("Get liabilities and equity report success")
                .data(financialReportService.getLiabilitiesAndEquityReports(params))
                .build();
    }

    @GetMapping("/assets-report")
    public ApiResponse<List<FinancialReportResponse>> getAssetsReports(@RequestParam Map<String, String> params) {
        return ApiResponse.<List<FinancialReportResponse>>builder()
                .code(200)
                .message("Get assets report success")
                .data(financialReportService.getAssetsReports(params))
                .build();
    }

    @GetMapping("/dividend")
    public ApiResponse<List<DividendResponse>> getDividends(@RequestParam Map<String, String> params) {
        return ApiResponse.<List<DividendResponse>>builder()
                .code(200)
                .message("Get dividend success")
                .data(financialReportService.getDividends(params))
                .build();
    }
}
