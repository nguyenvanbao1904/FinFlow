package com.nvb.fin_flow.controller.api;

import com.nvb.fin_flow.dto.request.BudgetCreationRequest;
import com.nvb.fin_flow.dto.response.ApiResponse;
import com.nvb.fin_flow.dto.response.BudgetPageableResponse;
import com.nvb.fin_flow.dto.response.BudgetResponse;
import com.nvb.fin_flow.service.BudgetService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApiBudgetController {
    BudgetService budgetService;

    @PostMapping
    public ApiResponse<BudgetResponse> create(@RequestBody @Valid BudgetCreationRequest budgetCreationRequest) {
        return ApiResponse.<BudgetResponse>builder()
                .code(201)
                .data(budgetService.addOrUpdateBudget(budgetCreationRequest))
                .message("Create budget successfully")
                .build();
    }

    @GetMapping
    public ApiResponse<BudgetPageableResponse> list(@RequestParam Map<String, String> params, Authentication authentication) {
        params.put("username", authentication.getName());
        return ApiResponse.<BudgetPageableResponse>builder()
                .code(200)
                .data(budgetService.getBudgets(params))
                .message("Get budgets successfully")
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> destroy(@PathVariable String id){
        budgetService.deleteBudget(id);
        return ApiResponse.<Void>builder().code(204).message("Delete budget successfully").build();
    }
}
