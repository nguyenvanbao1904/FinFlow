package com.nvb.fin_flow.controller.api;

import com.nvb.fin_flow.dto.response.ApiResponse;
import com.nvb.fin_flow.dto.response.CategoryDistribution;
import com.nvb.fin_flow.dto.response.TransactionSummaryResponse;
import com.nvb.fin_flow.service.StatisticService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApiStatisticController {
    StatisticService statisticService;

    @GetMapping("/summary-transaction")
    public ApiResponse<TransactionSummaryResponse> getTransactionSummary(@RequestParam Map<String, String> params, Authentication authentication) {
        params.put("username", authentication.getName());
        return ApiResponse.<TransactionSummaryResponse>builder()
                .code(201)
                .message("get transactions summary success")
                .data(statisticService.getTransactionSummary(params))
                .build();
    }

    @GetMapping("/category-distribution")
    public ApiResponse<List<CategoryDistribution>> getCategoryDistribution(@RequestParam Map<String, String> params, Authentication authentication) {
        params.put("username", authentication.getName());
        return ApiResponse.<List<CategoryDistribution>>builder()
                .code(201)
                .message("get category distribution success")
                .data(statisticService.getCategoryDistribution(params))
                .build();
    }
}
